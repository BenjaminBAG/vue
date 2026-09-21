export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const scriptUrl = config.googleScriptUrl // Asegúrate de registrarlo en nuxt.config.ts

  if (!scriptUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Falta configurar NUXT_GOOGLE_SCRIPT_URL' })
  }

  const method = getMethod(event) // Obtiene si es GET, POST, etc.

  // 1. MANEJO DE PETICIONES GET (Leer datos)
  if (method === 'GET') {
    const query = getQuery(event)
    const sheetName = query.sheet || 'Datos' // Pestaña dinámica desde la URL (?sheet=Inventario)

    try {
      const response = await $fetch(scriptUrl, {
        query: { sheet: sheetName }
      })
      return response
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // 2. MANEJO DE PETICIONES POST (Escribir datos)
  if (method === 'POST') {
    const body = await readBody(event) // Lee el JSON enviado desde el frontend
    
    if (!body || !body.data) {
      return { success: false, error: 'Faltan los datos a insertar en el cuerpo (body.data)' }
    }

    try {
      // Google Apps Script a veces requiere manejar redirecciones, $fetch lo hace automáticamente
      const response = await $fetch(scriptUrl, {
        method: 'POST',
        body: {
          sheet: body.sheet || 'Datos', // Pestaña dinámica
          data: body.data               // Objeto con los datos
        }
      })
      return response
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return { success: false, error: 'Método no soportado' }
})
