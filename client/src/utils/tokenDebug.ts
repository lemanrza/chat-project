export const debugToken = () => {
  const token = localStorage.getItem("token");
  console.log("Raw token from localStorage:", token);

  if (token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const decoded = JSON.parse(atob(payload));
        console.log("Token payload:", decoded);
        console.log("Token expires at:", new Date(decoded.exp * 1000));
        console.log("Token is expired:", Date.now() > decoded.exp * 1000);
      }
    } catch (e) {
      console.log("Could not decode token:", e);
    }
  } else {
    console.log("No token found");
  }
};

export const clearToken = () => {
  localStorage.removeItem("token");
  console.log("Token cleared");
};
