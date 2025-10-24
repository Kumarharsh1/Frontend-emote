const API_BASE_URL = "https://emote-vn4b7.vercel.app"

export const analyzeFace = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await fetch(`${API_BASE_URL}/api/analyze-face`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Face analysis failed:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to connect to backend' 
    }
  }
}

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    return await response.json()
  } catch (error) {
    return { status: 'unhealthy', error: error.message }
  }
}
