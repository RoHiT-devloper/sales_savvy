// utils/roleVerifier.js
export const verifyUserRole = async (username, requiredRole) => {
  try {
    const response = await fetch(`http://localhost:8080/verifyUserRole?username=${username}`);
    if (!response.ok) {
      throw new Error('Failed to verify user role');
    }
    
    const data = await response.json();
    if (data.success && data.role === requiredRole) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying user role:', error);
    return false;
  }
};

export const getCurrentUserRole = async (username) => {
  try {
    const response = await fetch(`http://localhost:8080/verifyUserRole?username=${username}`);
    if (!response.ok) {
      throw new Error('Failed to get user role');
    }
    
    const data = await response.json();
    if (data.success) {
      return data.role;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};