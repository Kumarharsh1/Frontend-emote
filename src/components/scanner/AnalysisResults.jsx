import React from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/Card";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, ArrowLeft, Brain } from "lucide-react";

const emotionColors = {
  happy: { bg: "from-green-500 to-emerald-500", text: "text-green-400", icon: "??" },
  sad: { bg: "from-blue-500 to-indigo-500", text: "text-blue-400", icon: "??" },
  angry: { bg: "from-red-500 to-rose-500", text: "text-red-400", icon: "??" },
  surprised: { bg: "from-yellow-500 to-orange-500", text: "text-yellow-400", icon: "??" },
  neutral: { bg: "from-gray-500 to-slate-500", text: "text-gray-400", icon: "??" },
  fearful: { bg: "from-purple-500 to-violet-500", text: "text-purple-400", icon: "??" },
  disgusted: { bg: "from-pink-500 to-fuchsia-500", text: "text-pink-400", icon: "??" },
  excited: { bg: "from-lime-500 to-green-500", text: "text-lime-400", icon: "??" },
  confused: { bg: "from-orange-500 to-red-500", text: "text-orange-400", icon: "??" },
  bored: { bg: "from-slate-500 to-gray-500", text: "text-slate-400", icon: "??" },
  anxious: { bg: "from-violet-500 to-purple-500", text: "text-violet-400", icon: "??" },
  content: { bg: "from-teal-500 to-cyan-500", text: "text-teal-400", icon: "??" }
};

export default function AnalysisResults({ result, imageUrl, onReset, onBack }) {
  const colors = emotionColors[result?.emotion] || emotionColors.neutral;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white p-8">
          <p className="text-lg">No results to display</p>
          <Button
            onClick={onBack}
            className="mt-4 border-white/20 hover:bg-white/5 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="border-white/20 hover:bg-white/5 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onReset}
            className="border-white/20 hover:bg-white/5 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Analyze Another
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 overflow-hidden">
            <img src={imageUrl} alt="Analyzed" className="w-full aspect-square object-cover" />
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Analyzed Image</span>
                <Badge variant="secondary" className="text-xs">
                  AI Analyzed
                </Badge>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <span className="text-lg">{colors.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Primary Emotion</h3>
                  <p className="text-slate-400 text-sm">Detected facial expression</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white capitalize mb-4">{result.emotion || "Unknown"}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">AI Confidence</span>
                  <span className={`font-semibold ${colors.text}`}>{Math.round(result.emotion_confidence || 0)}%</span>
                </div>
                <Progress value={result.emotion_confidence || 0} className="h-2" />
              </div>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Gender Detection</h3>
                  <p className="text-slate-400 text-sm">Identified gender</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-white capitalize">{result.gender || "Unknown"}</p>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-4 py-2 text-lg">
                  {Math.round(result.gender_confidence || 0)}%
                </Badge>
              </div>
              <Progress value={result.gender_confidence || 0} className="h-2" />
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {result.analysis_notes || "Face successfully analyzed using AI emotion detection. The system detected facial features and expressions to determine emotion and gender with high accuracy."}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
