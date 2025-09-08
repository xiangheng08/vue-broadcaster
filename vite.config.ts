import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'unplugin-dts/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), dts({ bundleTypes: true, tsconfigPath: './tsconfig.lib.json' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./lib/main.ts', import.meta.url)),
      name: 'VueBroadcast',
      // 将添加适当的扩展名后缀
      fileName: 'vue-broadcast',
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖
        // 提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
