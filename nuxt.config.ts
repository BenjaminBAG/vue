// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '../app/estilos_generales.css',
    '../utils/estilos/variables.css',
    '../utils/estilos/modo_oscuro.css',
    '../utils/markdown/markdown.css'
  ],
  runtimeConfig: {
    googleSheetId: '',
    googleSheetsApiKey: ''
  }
})
