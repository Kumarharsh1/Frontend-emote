import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/Card";
import { Badge } from "./components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, RotateCw, X, Brain } from "lucide-react";

const emotionColors = {
  happy: { color: "#22c55e", label: "Happy", icon: "??" },
  sad: { color: "#3b82f6", label: "Sad", icon: "??" },
  angry: { color: "#ef4444", label: "Angry", icon: "??" },
  surprised: { color: "#f59e0b", label: "Surprised", icon: "??" },
  neutral: { color: "#6b7280", label: "Neutral", icon: "??" },
  fearful: { color: "#8b5cf6", label: "Fearful", icon: "??" },
  disgusted: { color: "#ec4899", label: "Disgusted", icon: "??" },
  excited: { color: "#10b981", label: "Excited", icon: "??" },
  confused: { color: "#f97316", label: "Confused", icon: "??" },
  bored: { color: "#64748b", label: "Bored", icon: "??" },
  anxious: { color: "#a855f7", label: "Anxious", icon: "??" },
  content: { color: "#14b8a6", label: "Content", icon: "??" }
};

export default function LiveVideoDetection({ onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [isReady, setIsReady] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentGender, setCurrentGender] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const detectionIntervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      stopDetection();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: 1280, height: 720 },
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

  // Mock emotion detection for live video
  const detectEmotionFromVideo = useCallback(() => {
    const emotions = ["happy", "sad", "angry", "surprised", "neutral", "excited", "confused", "content"];
    const genders = ["male", "female"];
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    
    const detection = {
      emotion: randomEmotion,
      emotion_confidence: Math.floor(Math.random() * 30) + 70,
      gender: randomGender,
      gender_confidence: Math.floor(Math.random() * 30) + 70,
      timestamp: new Date().toISOString()
    };

    setCurrentEmotion(detection.emotion);
    setCurrentGender(detection.gender);
    
    // Add to history (keep last 10 detections)
    setDetectionHistory(prev => [...prev.slice(-9), detection]);
  }, []);

  const startDetection = () => {
    setIsDetecting(true);
    // Do initial detection
    detectEmotionFromVideo();
    // Set interval for continuous detection
    detectionIntervalRef.current = setInterval(detectEmotionFromVideo, 3000); // Detect every 3 seconds
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setCurrentEmotion(null);
    setCurrentGender(null);
  };

  const toggleCamera = () => {
    stopDetection();
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setIsReady(false);
    setCurrentEmotion(null);
    setCurrentGender(null);
  };

  const handleBack = () => {
    stopDetection();
    stopCamera();
    onBack();
  };

  const currentEmotionConfig = currentEmotion ? emotionColors[currentEmotion] : emotionColors.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Camera View */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 overflow-hidden">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover bg-black"
              />
              
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
              />

              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white">Initializing camera...</p>
                  </div>
                </div>
              )}

              {/* Detection Overlay */}
              <AnimatePresence>
                {currentEmotion && isDetecting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {/* Detection Box */}
                    <div className="absolute inset-[15%] border-4 rounded-lg animate-pulse"
                      style={{ borderColor: currentEmotionConfig.color }}
                    >
                      {/* Corner Markers */}
                      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4" 
                        style={{ borderColor: currentEmotionConfig.color }}></div>
                      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4"
                        style={{ borderColor: currentEmotionConfig.color }}></div>
                      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4"
                        style={{ borderColor: currentEmotionConfig.color }}></div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4"
                        style={{ borderColor: currentEmotionConfig.color }}></div>
                      
                      {/* Emotion Label */}
                      <div className="absolute -top-12 left-0 backdrop-blur-md rounded-lg px-3 py-2"
                        style={{ backgroundColor: `${currentEmotionConfig.color}40` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currentEmotionConfig.icon}</span>
                          <span className="text-white font-bold text-sm uppercase">
                            {currentEmotionConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Gender Label */}
                      <div className="absolute -bottom-12 left-0 bg-purple-500/40 backdrop-blur-md rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm uppercase">
                            {currentGender || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scanning Line Effect */}
                    <motion.div
                      className="absolute left-[15%] right-[15%] h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      animate={{ top: ["15%", "85%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${isDetecting ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
                <span className="text-white text-sm font-medium">
                  {isDetecting ? "LIVE DETECTION" : "STANDBY"}
                </span>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Button
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg"
                  onClick={handleBack}
                >
                  <X className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg"
                    onClick={toggleCamera}
                    disabled={isDetecting}
                  >
                    <RotateCw className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={isDetecting ? stopDetection : startDetection}
                    disabled={!isReady}
                    className={`${
                      isDetecting 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    } text-white font-semibold px-6 py-6 rounded-full shadow-lg`}
                  >
                    {isDetecting ? (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Stop Live Detection
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start Live Detection
                      </>
                    )}
                  </Button>
                </div>

                <div className="w-10"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detection Info Panel */}
        <div className="space-y-4">
          {/* Current Detection */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-400" />
              Live Detection
            </h3>
            
            {currentEmotion ? (
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Current Emotion</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentEmotionConfig.icon}</span>
                      <span className="text-white font-bold text-xl capitalize">
                        {currentEmotion}
                      </span>
                    </div>
                    <Badge 
                      className="text-white border-none"
                      style={{ backgroundColor: currentEmotionConfig.color }}
                    >
                      Active
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Detected Gender</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold capitalize">
                      {currentGender || "Unknown"}
                    </span>
                    <Badge className="bg-purple-500 text-white border-none">
                      Detected
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-slate-400 text-sm mb-2">Detection Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Real-time analysis active</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-500">
                  {isDetecting ? "Analyzing video feed..." : "Press Start to begin live detection"}
                </p>
              </div>
            )}
          </Card>

          {/* Detection History */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-4">
            <h3 className="text-white font-semibold mb-3">Recent Emotions</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {detectionHistory.slice().reverse().map((detection, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emotionColors[detection.emotion]?.icon}</span>
                    <span className="text-white text-sm capitalize">{detection.emotion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">
                      {new Date(detection.timestamp).toLocaleTimeString()}
                    </span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: emotionColors[detection.emotion]?.color }}
                    ></div>
                  </div>
                </div>
              ))}
              {detectionHistory.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No emotions detected yet</p>
              )}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-4">
            <h3 className="text-white font-semibold mb-3">How to Use</h3>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>• Ensure good lighting on your face</li>
              <li>• Position face within the detection box</li>
              <li>• Make different facial expressions</li>
              <li>• Watch emotions update in real-time</li>
              <li>• Switch cameras if needed</li>
            </ul>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
