import React, { useState } from "react"

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeImage = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('https://emote-vn4b7.vercel.app/api/analyze-face', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Failed to analyze image' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      analyzeImage(file)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Emotion Detector
        </h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>
          AI Powered Emotion & Gender Detection
        </p>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Upload Image
          </h2>
          
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              width: '100%'
            }}
          />

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #3b82f6',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p style={{ color: '#94a3b8' }}>Analyzing image...</p>
            </div>
          )}

          {result && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginTop: '1rem'
            }}>
              {result.success ? (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Analysis Result
                  </h3>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div>
                      <strong>Emotion:</strong> {result.emotion} ({Math.round(result.emotion_confidence)}%)
                    </div>
                    <div>
                      <strong>Gender:</strong> {result.gender} ({Math.round(result.gender_confidence)}%)
                    </div>
                    {result.analysis_notes && (
                      <div style={{ marginTop: '1rem', color: '#94a3b8' }}>
                        {result.analysis_notes}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#ef4444' }}>
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Backend: <strong>https://emote-vn4b7.vercel.app</strong>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
