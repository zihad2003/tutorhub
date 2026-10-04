const API_BASE_URL = 'http://localhost:5001/api/data';

export async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function postToAPI(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
}
