import React, { useState } from "react"
import { analyzeFace } from "../api/index.js"

export default function Scanner() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const analysisResult = await analyzeFace(file)
      setResult(analysisResult)
    } catch (error) {
      console.error("Analysis error:", error)
      setResult({ success: false, error: "Analysis failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Emotion Scanner</h1>
      
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 text-white"
        />
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Analyzing image...</p>
          </div>
        )}
        
        {result && (
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            {result.success ? (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Analysis Result</h3>
                <p className="text-slate-300">Emotion: {result.emotion} ({result.emotion_confidence}%)</p>
                <p className="text-slate-300">Gender: {result.gender} ({result.gender_confidence}%)</p>
              </div>
            ) : (
              <p className="text-red-400">Error: {result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
