// Base44 API Client with Vite environment variables
const BASE_URL = import.meta.env.VITE_BASE44_API_URL || "https://app.base44.com/api/apps/YOUR_APP_ID_HERE";
const API_KEY = import.meta.env.VITE_BASE44_API_KEY || "your_api_key_here";

export const base44 = {
    entities: {
        Detection: {
            list: async (sort = "-created_date", limit = 50) => {
                const response = await fetch(`${BASE_URL}/entities/Detection?sort=${sort}&limit=${limit}`, {
                    headers: {
                        "api_key": API_KEY,
                        "Content-Type": "application/json"
                    }
                });
                return await response.json();
            },
            create: async (data) => {
                const response = await fetch(`${BASE_URL}/entities/Detection`, {
                    method: "POST",
                    headers: {
                        "api_key": API_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                return await response.json();
            }
        }
    }
};

export default base44;
