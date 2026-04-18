// Auto-switching API BASE URL: Prefers production Render when online, localhost when developing.
export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (["localhost", "127.0.0.1"].includes(window.location.hostname) ? "http://localhost:3002" : "https://hospital-application-1-gff3.onrender.com");
