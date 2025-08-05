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
      throw new Error('Failed to login. Please check your credentials and try again.'); 
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/users/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error('Failed to verify token. Please login again.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in verifyToken:', error);
    throw error;
  }
};

// fetch profile information
export const fetchProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profile. Please try again.'); 
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    throw error;
  }
};

// update profile information
export const updateProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile. Please try again.'); 
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

// data api
export const fetchData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data. Please try again.'); 
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
};

export const fetchMetrics = async (uid, token) => {
  try {
    const response = await fetch(`${API_URL}/api/metrics/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics for UID: ${uid}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in fetchMetrics for UID ${uid}:`, error);
    throw error;
  }
};

export const fetchNetworkStatus = async (uid, token) => {
  try {
    const response = await fetch(`${API_URL}/api/networkStatus/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch network status for UID: ${uid}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchNetworkStatus for UID ${uid}:`, error);
    throw error;
  }
};

export const fetchDevices = async (uid, token) => {
  try {
    const response = await fetch(`${API_URL}/api/devices/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch devices for UID: ${uid}. Please try again.`);
    }
    return await response.json(); 
  } catch (error) {
    console.error('Error in fetchDevices:', error);
    throw error;
  }
};

export const updateDeviceTrust = async (token, mac, trustLevel) => {
  try {
    const response = await fetch(`${API_URL}/api/devices/update/${mac}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ trustLevel }),
    });
    if (!response.ok) {
      throw new Error('Failed to update device trust level. Please try again.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateDeviceTrust:', error);
    throw error;
  }
};

export const fetchAlerts = async (token, uid) => {
  console.log("debug alert uid:", uid);
  try {
    const response = await fetch(`${API_URL}/api/alert/unresolved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'uid': uid,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch alerts. Please try again.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchAlerts:', error);
    throw error;
  }
};