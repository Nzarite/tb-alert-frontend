import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["tbalert.beehyv.com"],
    cors: true,  // Enable CORS
    hmr: {
      protocol: 'wss',  // Ensure WebSocket uses WSS (secure)
      host: 'tbalert.beehyv.com',
      clientPort: 443,  // Change to 443 if running on HTTPS
    },
    proxy: {
      "/ws": {
        target: "wss://tbalert.beehyv.com", // Proxy WebSocket requests
        ws: true,
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS
      }
    }
  }
})
