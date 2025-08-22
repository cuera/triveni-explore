import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.avif'],
      manifest: {
        name: 'Triveni',
        short_name: 'Triveni',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: '/icon-192.avif', sizes: '192x192', type: 'image/avif' },
          { src: '/icon-512.avif', sizes: '512x512', type: 'image/avif' }
        ]
      },
      workbox: { 
        globPatterns: ['**/*.{js,css,html,png,jpg,json,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        globIgnores: ['**/herobanner*.png', '**/logo.png'] // Exclude old large images from PWA cache
      }
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
