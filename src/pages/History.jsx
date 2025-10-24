import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Trash2, Calendar, Brain } from "lucide-react";
import { format } from "date-fns";
import base44 from "@/api/base44Client";

const emotionColors = {
  happy: { bg: "from-green-500 to-emerald-500", text: "text-green-400" },
  sad: { bg: "from-blue-500 to-indigo-500", text: "text-blue-400" },
  angry: { bg: "from-red-500 to-rose-500", text: "text-red-400" },
  surprised: { bg: "from-yellow-500 to-orange-500", text: "text-yellow-400" },
  neutral: { bg: "from-gray-500 to-slate-500", text: "text-gray-400" },
  fearful: { bg: "from-purple-500 to-violet-500", text: "text-purple-400" },
  disgusted: { bg: "from-pink-500 to-fuchsia-500", text: "text-pink-400" },
  excited: { bg: "from-lime-500 to-green-500", text: "text-lime-400" },
  confused: { bg: "from-orange-500 to-red-500", text: "text-orange-400" },
  bored: { bg: "from-slate-500 to-gray-500", text: "text-slate-400" },
  anxious: { bg: "from-violet-500 to-purple-500", text: "text-violet-400" },
  content: { bg: "from-teal-500 to-cyan-500", text: "text-teal-400" }
};

export default function History() {
  const queryClient = useQueryClient();
  
  const { data: detections = [], isLoading } = useQuery({
    queryKey: ["detections"],
    queryFn: () => base44.entities.Detection.list("-created_date", 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Detection.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detections"] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 md:pb-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading detection history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Detection History</h1>
          <p className="text-slate-400">Your emotion and gender analysis results</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <Brain className="w-4 h-4" />
            AI Emotion Detection
          </div>
        </motion.div>

        {detections.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 p-12 text-center">
            <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Detections Yet</h3>
            <p className="text-slate-400">Start analyzing faces to see your history here</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detections.map((detection, index) => {
              const emotionGradient = emotionColors[detection.emotion] || emotionColors.neutral;
              
              return (
                <motion.div
                  key={detection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 overflow-hidden hover:border-white/30 transition-all">
                    {detection.image_url && (
                      <div className="relative h-64">
                        <img src={detection.image_url} alt="Detection" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                        
                        <Button
                          className="absolute top-3 right-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm text-white p-2 rounded-lg"
                          onClick={() => deleteMutation.mutate(detection.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="mb-2">
                            <Badge className={`bg-gradient-to-r ${emotionGradient.bg} text-white border-none`}>
                              {detection.emotion} - {detection.emotion_confidence}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge className="bg-white/10 text-white border-white/20">
                              <User className="w-3 h-3 mr-1" />
                              {detection.gender} ({detection.gender_confidence}%)
                            </Badge>
                            <div className="flex items-center gap-1 text-slate-400 text-xs">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(detection.created_date), "MMM d, HH:mm")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
