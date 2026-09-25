// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '../utils/estilos/variables.css',
    '../utils/markdown/markdown.css',
    '../app/estilos_generales.css'
  ],
  runtimeConfig: {
    googleSheetId: '',
    googleSheetsApiKey: ''
  }
})
