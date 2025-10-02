
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Permite conexiones desde cualquier IP
    port: 8080,
    strictPort: true, // No intenta otro puerto si 8080 está ocupado
    proxy: {
      // Configuración de proxy para Supabase remoto con manejo de errores mejorado
      '/supabase-proxy': {
        target: process.env.VITE_SUPABASE_URL || 'https://qomxnbfsabgdbnttzojm.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-proxy/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Error de proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Enviando solicitud proxy a:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Recibida respuesta proxy para:', req.url, 'status:', proxyRes.statusCode);
          });
        },
        // Configuración extra para aumentar la tolerancia a errores
        timeout: 15000,    // Timeout más largo (15s)
        proxyTimeout: 16000 // Dar un poco más de tiempo al proxy
      },
      // Proxy específico para autenticación con manejo de errores mejorado
      '/auth': {
        target: process.env.VITE_SUPABASE_URL || 'https://qomxnbfsabgdbnttzojm.supabase.co',
        changeOrigin: true,
        timeout: 15000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Error de proxy auth:', err);
            // El error se manejará en la aplicación, no detiene el proceso
          });
        }
      }
    },
    cors: {
      origin: true, // Habilita CORS para todas las solicitudes
      credentials: true, // Permite cookies y autenticación
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
      allowedHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey'] // Headers permitidos
    },
    hmr: {
      // Configuración para Hot Module Replacement
      clientPort: 443, // Para HTTPS
      overlay: true
    },
    watch: {
      // Configuración para filesystem watching
      usePolling: true, // Útil para entornos virtualizados
      interval: 1000    // Intervalo de polling reducido para mejor rendimiento
    },
    allowedHosts: ['localhost', '127.0.0.1', 'purepix.host-crafter.com.ar'], // Dominios permitidos
    fs: {
      // Strict por defecto, permitir acceso fuera de la raíz para ciertas carpetas
      strict: true,
      allow: ['.']
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Mejorar manejo de variables de entorno
  define: {
    'process.env': {}
  },
  // Optimizaciones para producción
  build: {
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
}));
