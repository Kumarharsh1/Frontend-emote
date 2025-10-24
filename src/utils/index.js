// Utility functions
export const API_BASE_URL = "https://emote-vn4b7.vercel.app";

export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-face`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis error:', error);
    return { success: false, error: 'Failed to analyze image' };
  }
};

export const formatConfidence = (confidence) => {
  return `${Math.round(confidence)}%`;
};

export const getEmotionColor = (emotion) => {
  const colors = {
    happy: 'text-green-600',
    sad: 'text-blue-600',
    angry: 'text-red-600',
    surprised: 'text-yellow-600',
    fearful: 'text-purple-600',
    disgusted: 'text-orange-600',
    neutral: 'text-gray-600'
  };
  return colors[emotion] || 'text-gray-600';
};
