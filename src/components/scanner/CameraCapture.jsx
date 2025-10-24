import React, { useRef, useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/Card";
import { Camera, X, Circle, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsReady(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Cannot access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `face-${Date.now()}.jpg`, { type: "image/jpeg" });
      stopCamera();
      onCapture(file);
    }, "image/jpeg", 0.95);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setIsReady(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 overflow-hidden">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-[4/3] object-cover bg-black"
          />
          
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white">Starting camera...</p>
              </div>
            </div>
          )}

          {/* Face guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-80">
              <div className="absolute inset-0 border-2 border-blue-500/50 rounded-full"></div>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>
            </div>
          </div>

          <Button
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg"
            onClick={onCancel}
          >
            <X className="w-5 h-5" />
          </Button>

          <Button
            className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg"
            onClick={toggleCamera}
          >
            <RotateCw className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 text-center border-t border-white/10">
          <p className="text-slate-400 mb-6">Position your face within the guide</p>
          <Button
            onClick={capturePhoto}
            disabled={!isReady}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg shadow-blue-500/50"
          >
            <Circle className="w-6 h-6 mr-2" />
            Capture Photo
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
