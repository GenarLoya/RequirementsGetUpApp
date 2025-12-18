import axios from "axios";

/**
 * Axios instance configured for API calls
 * - withCredentials: true enables HTTP-only cookie authentication
 * - Automatically redirects to /login on 401 responses
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Critical: Send HTTP-only cookies with requests
});

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to login on authentication errors
    if (error.response?.status === 401) {
      // Only redirect if not already on login/register page
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
