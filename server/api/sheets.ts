// server/api/sheets.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const sheetId = config.googleSheetId
  const apiKey = config.googleSheetsApiKey
  const query = getQuery(event)
  const range = typeof query.range === 'string' ? query.range : 'prueba!A:C'

  if (!sheetId || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Faltan las variables de entorno googleSheetId o googleSheetsApiKey'
    })
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`

  try {
    const data: any = await $fetch(url)

    const rows = data.values || []
    const headers = rows[0] || []

    const formattedData = rows.slice(1).map((row: any) => {
      const item: Record<string, any> = {}
      headers.forEach((header: string, index: number) => {
        const key = String(header || `columna_${index + 1}`).trim().toLowerCase()
        item[key] = row[index] ?? ''
      })
      return item
    })

    return formattedData
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener datos de Google Sheets',
    })
  }
})
