import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "KU-ROOM-WEB",
        short_name: "KU-ROOM",
        description: "건국대학교 룸 매칭 지도 앱",
        theme_color: "#ffffff",
        icons: [
          {
            src: "kuroom-app-icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "kuroom-app-icon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "kuroom-app-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // 네이버 지도 API 외부 JS 캐시 처리
            urlPattern: /^https:\/\/openapi\.map\.naver\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "naver-api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1일
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@apis": path.resolve(__dirname, "./src/apis"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/shared/components"),
      "@constant": path.resolve(__dirname, "./src/shared/constant"),
      "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
      "@utils": path.resolve(__dirname, "./src/shared/utils"),
      "@types": path.resolve(__dirname, "./src/shared/types"),
      "@stores": path.resolve(__dirname, "./src/shared/stores"),
    },
  },
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
//       manifest: {
//         name: 'KU-ROOM-WEB',
//         short_name: 'KU-ROOM',
//         description: '당신의 앱 설명',
//         theme_color: '#ffffff',
//         icons: [
//           {
//             src: 'pwa-192x192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: 'pwa-512x512.png',
//             sizes: '512x512',
//             type: 'image/png'
//           },
//           {
//             src: 'pwa-512x512.png',
//             sizes: '512x512',
//             type: 'image/png',
//             purpose: 'any maskable'
//           }
//         ]
//       }
//     })
//   ]
// })
