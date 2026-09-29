// server/api/sheets.ts
import sheetSchema from '../docs/google-sheets-estructura.json'

type TableField = string | {
  name: string
  type?: string
  required?: boolean
  foreignKey?: string
}

type TableDefinition = {
  name: string
  range: string
  primaryKey?: string
  fields?: TableField[]
}

type SheetValue = string | number | boolean | null | undefined

type SheetRow = Record<string, SheetValue>

type SheetResponse = {
  values?: Array<Array<SheetValue>>
}

const normalizeKey = (value: string) =>
  String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const getTableDefinition = (tableName: string): TableDefinition | null => {
  const tables = Array.isArray((sheetSchema as any)?.tables) ? (sheetSchema as any).tables : []
  const target = String(tableName ?? '').trim().toLowerCase()

  return tables.find((table: TableDefinition) => String(table.name).trim().toLowerCase() === target) || null
}

const getFieldNames = (table: TableDefinition | null) => {
  if (!table?.fields?.length) return []

  return table.fields.map((field) => {
    if (typeof field === 'string') return field
    return field.name
  })
}

const parseGoogleSheetRows = (rows: Array<Array<SheetValue>> = []) => {
  if (!rows.length) return []

  const headers = (rows[0] || []).map((header: SheetValue) => String(header ?? '').trim())

  return rows.slice(1).map((row: Array<SheetValue> = []) => {
    const item: Record<string, SheetValue> = {}

    headers.forEach((header: string, index: number) => {
      const key = normalizeKey(header || `columna_${index + 1}`)
      item[key] = row[index] ?? ''
    })

    return item
  })
}

const toTableRow = (table: TableDefinition | null, source: Record<string, any> = {}) => {
  const fieldNames = getFieldNames(table)
  const normalizedSource = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [normalizeKey(key), value])
  )

  const row: Record<string, any> = {}

  fieldNames.forEach((fieldName) => {
    const fieldKey = normalizeKey(fieldName)
    row[fieldName] = normalizedSource[fieldKey] ?? ''
  })

  return row
}

const resolveTableFromRequest = (query: Record<string, any>) => {
  const targetTable = typeof query.table === 'string' ? query.table : ''
  if (!targetTable) {
    return {
      table: null,
      range: typeof query.range === 'string' ? query.range : 'usuarios!A:Z'
    }
  }

  const table = getTableDefinition(targetTable)
  return {
    table,
    range: typeof query.range === 'string' ? query.range : table?.range || 'usuarios!A:Z'
  }
}

const fetchSheetValues = async (sheetId: string, apiKey: string, range: string): Promise<SheetResponse> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`
  return await $fetch<SheetResponse>(url)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const sheetId = config.googleSheetId
  const apiKey = config.googleSheetsApiKey
  const query = getQuery(event)
  const action = String(query.action || 'read').toLowerCase()

  if (!sheetId || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Faltan las variables de entorno googleSheetId o googleSheetsApiKey'
    })
  }

  try {
    if (action === 'getbyid') {
      const { table } = resolveTableFromRequest(query)
      const tableName = typeof query.table === 'string' ? query.table : ''
      const idValue = typeof query.id === 'string' ? query.id : ''

      if (!tableName || !idValue) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Se requiere table e id para getById'
        })
      }

      const range = table?.range || 'usuarios!A:Z'
      const data = await fetchSheetValues(sheetId, apiKey, range)
      const rows = parseGoogleSheetRows(data.values || [])
      const primaryKey = table?.primaryKey || 'id'

      const item = rows.find((row) => String(row[normalizeKey(primaryKey)] ?? '').trim() === String(idValue).trim())

      return item || null
    }

    if (action === 'gettable' || action === 'table') {
      const { table, range } = resolveTableFromRequest(query)

      if (!table) {
        throw createError({
          statusCode: 400,
          statusMessage: 'La tabla solicitada no existe en google-sheets-estructura.json'
        })
      }

      const data = await fetchSheetValues(sheetId, apiKey, range)
      return parseGoogleSheetRows(data.values || [])
    }

    if (action === 'append' || action === 'save' || action === 'saveRows') {
      const { table } = resolveTableFromRequest(query)
      const tableName = typeof query.table === 'string' ? query.table : ''

      if (!tableName || !table) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Se requiere una tabla válida para guardar datos'
        })
      }

      const body = await readBody(event)
      const rows = Array.isArray(body?.rows) ? body.rows : Array.isArray(body) ? body : [body]
      const fieldNames = getFieldNames(table)

      if (!fieldNames.length) {
        throw createError({
          statusCode: 400,
          statusMessage: `La tabla ${tableName} no tiene campos definidos`
        })
      }

      const values = rows.map((row: Record<string, any>) => {
        const normalizedRow = toTableRow(table, row || {})
        return fieldNames.map((fieldName) => normalizedRow[fieldName] ?? '')
      })

      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(table.range)}:append?key=${apiKey}&valueInputOption=RAW&insertDataOption=INSERT_ROWS`

      await $fetch(appendUrl, {
        method: 'POST',
        body: {
          values
        }
      })

      return {
        ok: true,
        table: table.name,
        inserted: values.length,
        fields: fieldNames
      }
    }

    const requestedRange = typeof query.range === 'string' ? query.range : 'usuarios!A:Z'
    const data = await fetchSheetValues(sheetId, apiKey, requestedRange)
    return parseGoogleSheetRows(data.values || [])
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Error al obtener o guardar datos de Google Sheets'
    })
  }
})
