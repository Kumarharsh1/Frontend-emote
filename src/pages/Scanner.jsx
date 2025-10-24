import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Camera, Upload, Video, Eye } from "lucide-react";
import CameraCapture from "@/components/scanner/CameraCapture";
import UploadZone from "@/components/scanner/UploadZone";
import LiveVideoDetection from "@/components/scanner/LiveVideoDetection";
import AnalysisResults from "@/components/scanner/AnalysisResults";
import base44 from "@/api/base44Client";

// API endpoint - change this to your Flask server URL
const API_BASE_URL = "http://localhost:5000";

export default function Scanner() {
  const [mode, setMode] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeImageWithAI = async (file) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log("Starting AI analysis...");
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("image", file);

      // Send the image to your backend API endpoint
      const response = await fetch(`${API_BASE_URL}/api/analyze-face`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed on the server: ${response.status} ${response.statusText}`);
      }

      const analysis = await response.json();
      console.log("AI Analysis result:", analysis);

      if (!analysis.success) {
        throw new Error(analysis.error || "Failed to analyze the image. Please ensure the image shows a clear face.");
      }

      // Save to database (your existing Base44 code)
      const imageUrl = URL.createObjectURL(file);
      const detectionRecord = await base44.entities.Detection.create({
        image_url: imageUrl,
        emotion: analysis.emotion,
        emotion_confidence: analysis.emotion_confidence,
        gender: analysis.gender,
        gender_confidence: analysis.gender_confidence,
        additional_emotions: {},
        face_detected: true,
        detection_timestamp: new Date().toISOString()
      });

      const result = {
        emotion: analysis.emotion,
        emotion_confidence: analysis.emotion_confidence,
        gender: analysis.gender,
        gender_confidence: analysis.gender_confidence,
        analysis_notes: `Face analyzed with high accuracy using DeepFace AI. Detected ${analysis.emotion} emotion (${analysis.emotion_confidence}% confidence) and ${analysis.gender} gender (${analysis.gender_confidence}% confidence).`,
        image_url: imageUrl,
        id: detectionRecord.id
      };

      setAnalysisResult(result);
      
    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.message || "Failed to analyze image. Please ensure the image shows a clear face and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageCapture = async (file) => {
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    await analyzeImageWithAI(file);
  };

  const handleReset = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setMode(null);
  };

  const handleBack = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setMode(null);
  };

  if (analysisResult) {
    return (
      <AnalysisResults 
        result={analysisResult} 
        imageUrl={capturedImage}
        onReset={handleReset}
        onBack={handleBack}
      />
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 md:pb-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">AI is Analyzing...</h2>
          <p className="text-slate-400 mb-4">Using DeepFace AI for high-accuracy detection</p>
          <p className="text-slate-500 text-sm mb-6">Detecting emotions and gender with advanced neural networks</p>
          {capturedImage && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={capturedImage}
              alt="Uploaded"
              className="w-64 h-64 object-cover rounded-2xl mx-auto border-2 border-white/20"
            />
          )}
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pb-20 md:pb-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-red-500/10 border-red-500/50 p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-slate-400 text-sm mb-6">
              Make sure:
              <br />• Face is clearly visible
              <br />• Good lighting conditions
              <br />• No obstructions (glasses, masks)
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-full"
              >
                Try Again
              </button>
              <button
                onClick={handleBack}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full"
              >
                Go Back
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Emotion & Gender Detection
          </h1>
          <p className="text-slate-400 text-lg">Powered by DeepFace AI - High accuracy facial analysis</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Deep Learning Model</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!mode ? (
            <motion.div
              key="mode-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {/* Feature 1: Upload Image */}
              <Card 
                className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-6 cursor-pointer hover:border-purple-500/50 transition-all duration-300 group"
                onClick={() => setMode("upload")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-all">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Image</h3>
                  <p className="text-slate-400 text-sm">Analyze photos from your device</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-purple-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-400">DeepFace AI</span>
                  </div>
                </div>
              </Card>

              {/* Feature 2: Capture Photo */}
              <Card 
                className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-6 cursor-pointer hover:border-blue-500/50 transition-all duration-300 group"
                onClick={() => setMode("live")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:shadow-blue-500/80 transition-all">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Capture Photo</h3>
                  <p className="text-slate-400 text-sm">Take a photo with your camera</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-blue-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-400">AI Analysis</span>
                  </div>
                </div>
              </Card>

              {/* Feature 3: Live Video Detection */}
              <Card 
                className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-6 cursor-pointer hover:border-green-500/50 transition-all duration-300 group"
                onClick={() => setMode("live-video")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:shadow-green-500/80 transition-all">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Live Video</h3>
                  <p className="text-slate-400 text-sm">Real-time emotion detection</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live Analysis</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : mode === "live-video" ? (
            <LiveVideoDetection onBack={() => setMode(null)} />
          ) : mode === "live" ? (
            <CameraCapture 
              onCapture={handleImageCapture}
              onCancel={() => setMode(null)}
            />
          ) : (
            <UploadZone 
              onUpload={handleImageCapture}
              onCancel={() => setMode(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
