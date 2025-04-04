import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from  'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
    },
    sourcemap:true,
    target: 'esnext',
    minify: false
  },
  plugins: [dts(), vue()],
})
