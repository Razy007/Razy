import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        // Environment variables
        define: {
            'import.meta.env.VITE_PI_API_KEY': JSON.stringify(env.VITE_PI_API_KEY),
            'import.meta.env.VITE_PI_SANDBOX': JSON.stringify(env.VITE_PI_SANDBOX),
            'import.meta.env.VITE_USE_MOCK_AUTH': JSON.stringify(env.VITE_USE_MOCK_AUTH),
            'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
            'import.meta.env.VITE_GCV_VALUE': JSON.stringify(env.VITE_GCV_VALUE),
        },

        // Development server
        server: {
            host: true, // Listen on all addresses (0.0.0.0)
            port: 5173,
            strictPort: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:3001',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },

        // Build configuration
        build: {
            minify: 'esbuild',
            sourcemap: true,
            target: 'es2020',
            cssTarget: 'es2020',
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
                    },
                },
            },
            chunkSizeWarningLimit: 1000,
        }
    }
})
