const API_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = async (emailOrUsername, password) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUsername, password }), 
    }); 
    if (!response.ok) {
      throw new Error('Failed to login user'); 
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};