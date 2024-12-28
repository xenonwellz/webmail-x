import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RemixRouter from 'vite-plugin-remix-router'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), RemixRouter({}), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(path.dirname(''), './src'),
        },
    },
})
