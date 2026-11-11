import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Build schreibt direkt in die veröffentlichte App: website/ux-grundlagen
// (relative Pfade, damit die Seite unter /lernapps/ux-grundlagen/ auf GitHub Pages läuft)
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        outDir: '../../ux-grundlagen',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    radix: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio'],
                    icons: ['lucide-react'],
                    charts: ['recharts']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    }
})
