// API Configuration - Connect to deployed backend
const API_BASE_URL = "https://emote-vn4b7.vercel.app";

// Analyze face by uploading image
export const analyzeFace = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    console.log('Sending request to backend:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/analyze-face`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Backend response:', result);
    return result;
  } catch (error) {
    console.error('Face analysis failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to connect to backend' 
    };
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

// Get analysis history (if implemented in backend)
export const getAnalysisHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return { success: false, error: error.message };
  }
};
