import React, { useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/Card";
import { Upload, X, Image } from "lucide-react";
import { motion } from "framer-motion";

export default function UploadZone({ onUpload, onCancel }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    } else {
      alert("Please select a valid image file (JPG, PNG, JPEG)");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    } else {
      alert("Please drop a valid image file (JPG, PNG, JPEG)");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 overflow-hidden">
        <div className="relative p-12">
          <Button
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white p-2 rounded-lg"
            onClick={onCancel}
          >
            <X className="w-5 h-5" />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragActive 
                ? "border-purple-500 bg-purple-500/10" 
                : "border-white/20 hover:border-purple-500/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Image className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {dragActive ? "Drop Image Here" : "Select an Image"}
            </h3>
            <p className="text-slate-400 mb-6">
              {dragActive 
                ? "Release to upload" 
                : "Click to browse or drag & drop a photo showing a clear face"
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-6 rounded-full pointer-events-none"
            >
              <Upload className="w-5 h-5 mr-2" />
              Browse Files
            </Button>
            <p className="text-slate-500 text-sm mt-4">Supported: JPG, PNG, JPEG</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
