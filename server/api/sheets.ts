// server/api/sheets.ts
import { google } from 'googleapis'
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
  ambito?: string
  fields?: TableField[]
}

type SheetValue = string | number | boolean | null | undefined

type SheetRow = Record<string, SheetValue>

type SheetResponse = {
  values?: Array<Array<SheetValue>> | null
}

type SheetsClient = ReturnType<typeof google.sheets>

type ServiceAccountCredentials = {
  client_email: string
  private_key: string
}

const isServiceAccountCredentials = (value: unknown): value is ServiceAccountCredentials =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  'client_email' in value &&
  typeof value.client_email === 'string' &&
  'private_key' in value &&
  typeof value.private_key === 'string'

const getGoogleAuthCredentials = (value: unknown) => {
  let credentials: unknown = value

  if (typeof value === 'string') {
    const credentialValue = value.trim()
    if (!credentialValue) {
      throw createError({ statusCode: 500, statusMessage: 'La credencial de Google está vacía.' })
    }

    if (!credentialValue.startsWith('{')) return { keyFile: credentialValue }

    try {
      credentials = JSON.parse(credentialValue)
    } catch {
      throw createError({ statusCode: 500, statusMessage: 'La credencial de Google no contiene un JSON válido.' })
    }
  }

  if (!isServiceAccountCredentials(credentials)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'La credencial de Google debe incluir client_email y private_key.'
    })
  }

  return {
    credentials: {
      ...credentials,
      private_key: credentials.private_key.replace(/\\n/g, '\n')
    }
  }
}

const normalizeKey = (value: string) =>
  String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const normalizeIdentifier = (value: unknown) =>
  String(value ?? '').trim()

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

const fetchSheetValues = async (
  sheets: SheetsClient,
  sheetId: string,
  range: string
): Promise<SheetResponse> => {
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range
  })
  return data
}

const getActorId = async (event: Parameters<typeof defineEventHandler>[0] extends (event: infer T) => any ? T : never, sheets: SheetsClient, sheetId: string) => {
  const authCookie = getCookie(event, 'auth_token')
  let session: any = authCookie ?? {}

  for (let attempts = 0; attempts < 2 && typeof session === 'string'; attempts += 1) {
    try {
      session = JSON.parse(session)
    } catch {
      session = {}
    }
  }

  if (!session || typeof session !== 'object') session = {}

  const actorId = String(session?.id ?? '').trim()
  if (!actorId) {
    throw createError({ statusCode: 401, statusMessage: 'Inicia sesión para guardar cambios.' })
  }

  const usersTable = getTableDefinition('usuarios')
  const usersData = await fetchSheetValues(sheets, sheetId, usersTable?.range || 'usuarios!A:Z')
  const actorExists = parseGoogleSheetRows(usersData.values || []).some((user) =>
    String(user[normalizeKey(usersTable?.primaryKey || 'id')] ?? '').trim() === actorId
  )

  if (!actorExists) {
    throw createError({ statusCode: 401, statusMessage: 'La sesión no corresponde a un usuario válido.' })
  }

  return actorId
}

const cellData = (value: any) => ({
  userEnteredValue: typeof value === 'number'
    ? { numberValue: value }
    : typeof value === 'boolean'
      ? { boolValue: value }
      : { stringValue: String(value ?? '') }
})

const rowData = (row: Record<string, any>, fieldNames: string[]) => ({
  values: fieldNames.map((fieldName) => cellData(row[fieldName]))
})

const serializeAuditRecord = (table: TableDefinition, row: Record<string, any>) => {
  if (!Object.keys(row).length) return '[]'

  const entries: [string, any][] = [['tabla', table.name]]

  getFieldNames(table).forEach((fieldName) => {
    const value = row[fieldName] ?? ''
    const isSensitive = /clave|password|token|secret|private.?key/i.test(fieldName)
    entries.push([fieldName, isSensitive && value !== '' ? '[REDACTADO]' : value])
  })

  const serialized = JSON.stringify(entries)
  if (serialized.length > 49000) {
    throw createError({ statusCode: 413, statusMessage: 'El registro es demasiado grande para guardarse completo en la auditoría.' })
  }
  return serialized
}

const deserializeAuditRecord = (serialized: string | null | undefined) => {
  if (!serialized) return { table: null, values: {} }

  try {
    const parsed = JSON.parse(serialized)
    if (!Array.isArray(parsed)) return { table: null, values: {} }

    const [tableEntry, ...fieldEntries] = parsed
    const tableName = typeof tableEntry?.[1] === 'string' ? tableEntry[1] : ''
    return {
      table: tableName,
      values: Object.fromEntries(
        fieldEntries
          .filter((entry): entry is [string, any] => Array.isArray(entry) && entry.length >= 2)
          .map(([key, value]) => [key, value ?? ''])
      )
    }
  } catch {
    return { table: null, values: {} }
  }
}

const createAuditRow = (
  table: TableDefinition,
  recordId: string,
  actorId: string,
  timestamp: string,
  action: 'creación' | 'modificación' | 'eliminación',
  previousRow: Record<string, any>,
  nextRow: Record<string, any>
) => ({
  id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
  id_usuario: actorId,
  id_registro: recordId,
  fecha_hora: timestamp,
  tipo: action,
  valor_anterior: serializeAuditRecord(table, previousRow),
  valor_nuevo: serializeAuditRecord(table, nextRow),
  ambito: table.ambito
})

const getSheetId = async (sheets: SheetsClient, spreadsheetId: string, title: string) => {
  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets(properties(sheetId,title))'
  })
  const sheet = data.sheets?.find((item) => item.properties?.title === title)
  if (sheet?.properties?.sheetId == null) {
    throw createError({ statusCode: 500, statusMessage: `No se encontró la hoja ${title}.` })
  }
  return sheet.properties.sheetId
}

const getTableSheetName = (table: TableDefinition) => {
  const sheetName = table.range.split('!')[0]
  if (!sheetName) throw createError({ statusCode: 500, statusMessage: `La tabla ${table.name} no tiene una hoja configurada.` })
  return sheetName
}

const assertWritableTable = (table: TableDefinition) => {
  if (table.name.toLowerCase() === 'cambios') {
    throw createError({ statusCode: 403, statusMessage: 'La hoja cambios solo se modifica desde el registro automático.' })
  }
  if (!['público', 'privado'].includes(String(table.ambito ?? ''))) {
    throw createError({ statusCode: 500, statusMessage: `La tabla ${table.name} debe definir un ambito público o privado.` })
  }
}

const appendCellsRequest = (sheetId: number, rows: Record<string, any>[], fieldNames: string[]) => ({
  appendCells: {
    sheetId,
    rows: rows.map((row) => rowData(row, fieldNames)),
    fields: 'userEnteredValue'
  }
})

const updateAndAudit = async (
  sheets: SheetsClient,
  spreadsheetId: string,
  table: TableDefinition,
  tableSheetId: number,
  updateRequest: Record<string, any>,
  auditRows: Record<string, any>[]
) => {
  const requests: Record<string, any>[] = [updateRequest]

  if (auditRows.length) {
    const auditTable = getTableDefinition('cambios')
    if (!auditTable) throw createError({ statusCode: 500, statusMessage: 'No existe la tabla cambios en el esquema.' })
    const auditSheetId = await getSheetId(sheets, spreadsheetId, getTableSheetName(auditTable))
    requests.push(appendCellsRequest(auditSheetId, auditRows, getFieldNames(auditTable)))
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests }
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const sheetId = config.googleSheetId
  const serviceAccountKey = config.googleServiceAccountKey
  const query = getQuery(event)
  const action = String(query.action || 'read').toLowerCase()

  if (!sheetId || !serviceAccountKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Faltan las variables googleSheetId o googleServiceAccountKey'
    })
  }

  try {
    const auth = new google.auth.GoogleAuth({
      ...getGoogleAuthCredentials(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })
    const sheets = google.sheets({ version: 'v4', auth })

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
      const data = await fetchSheetValues(sheets, sheetId, range)
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

      const data = await fetchSheetValues(sheets, sheetId, range)
      return parseGoogleSheetRows(data.values || [])
    }

    if (action === 'update') {
      const { table } = resolveTableFromRequest(query)
      const tableName = typeof query.table === 'string' ? query.table : ''

      if (!tableName || !table) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Se requiere una tabla válida para actualizar datos'
        })
      }

      assertWritableTable(table)
      const actorId = await getActorId(event, sheets, sheetId)
      const body = await readBody(event)
      const sourceRow = body?.row || body
      const normalizedSource = Object.fromEntries(
        Object.entries(sourceRow || {}).map(([key, value]) => [normalizeKey(key), value])
      )
      const fieldNames = getFieldNames(table)
      const primaryKey = table.primaryKey || 'id'
      const primaryKeyIndex = fieldNames.findIndex((fieldName) => normalizeKey(fieldName) === normalizeKey(primaryKey))
      const id = String(normalizedSource[normalizeKey(primaryKey)] ?? '').trim()

      if (primaryKeyIndex < 0 || !id) {
        throw createError({
          statusCode: 400,
          statusMessage: `Se requiere ${primaryKey} para actualizar ${tableName}`
        })
      }

      const sheetData = await fetchSheetValues(sheets, sheetId, table.range)
      const sheetRows = sheetData.values || []
      const headerIndex = (sheetRows[0] || []).findIndex((header) => normalizeKey(String(header ?? '')) === normalizeKey(primaryKey))

      if (headerIndex < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `No se encontró la columna ${primaryKey} en ${tableName}`
        })
      }

      const rowIndex = sheetRows.slice(1).findIndex((sheetRow) =>
        String(sheetRow[headerIndex] ?? '').trim() === id
      )

      if (rowIndex < 0) {
        throw createError({
          statusCode: 404,
          statusMessage: `No se encontró el registro ${id} en ${tableName}`
        })
      }

      const headers = sheetRows[0] || []
      const currentSheetRow = sheetRows[rowIndex + 1] || []
      const previousSource = Object.fromEntries(
        headers.map((header, index) => [normalizeKey(String(header ?? '')), currentSheetRow[index] ?? ''])
      )
      const previousRow = toTableRow(table, previousSource)
      const row = { ...previousRow }
      fieldNames.forEach((fieldName) => {
        const key = normalizeKey(fieldName)
        if (Object.prototype.hasOwnProperty.call(normalizedSource, key)) {
          row[fieldName] = normalizedSource[key] ?? ''
        }
      })

      const changedFields = fieldNames.filter((fieldName) =>
        String(previousRow[fieldName] ?? '') !== String(row[fieldName] ?? '')
      )

      if (!changedFields.length) return { ok: true, table: table.name, id, updatedFields: [] }

      const auditRow = createAuditRow(
        table,
        id,
        actorId,
        new Date().toISOString(),
        'modificación',
        previousRow,
        row
      )
      const sheetRowNumber = rowIndex + 2
      const updateRequest = {
        updateCells: {
          start: {
            sheetId: await getSheetId(sheets, sheetId, getTableSheetName(table)),
            rowIndex: sheetRowNumber - 1,
            columnIndex: 0
          },
          rows: [rowData(row, fieldNames)],
          fields: 'userEnteredValue'
        }
      }

      const tableSheetId = updateRequest.updateCells.start.sheetId
      await updateAndAudit(sheets, sheetId, table, tableSheetId, updateRequest, [auditRow])

      return { ok: true, table: table.name, id, updatedFields: changedFields }
    }

    if (action === 'undo') {
      const changeId = typeof query.id === 'string' ? query.id.trim() : ''
      if (!changeId) {
        throw createError({ statusCode: 400, statusMessage: 'Se requiere un id de cambio para deshacer.' })
      }

      const actorId = await getActorId(event, sheets, sheetId)
      const auditTable = getTableDefinition('cambios')
      if (!auditTable) throw createError({ statusCode: 500, statusMessage: 'No existe la tabla cambios en el esquema.' })
      const auditSheetData = await fetchSheetValues(sheets, sheetId, auditTable.range)
      const auditRows = parseGoogleSheetRows(auditSheetData.values || [])
      const auditRow = auditRows.find((row) => String(row.id ?? '').trim() === changeId)
      if (!auditRow) throw createError({ statusCode: 404, statusMessage: `No se encontró el cambio ${changeId}.` })

      const usersTable = getTableDefinition('usuarios')
      const usersRows = usersTable ? parseGoogleSheetRows((await fetchSheetValues(sheets, sheetId, usersTable.range)).values || []) : []
      const usuarioRegistrado = usersRows.find((user) => normalizeIdentifier(user[normalizeKey(usersTable?.primaryKey || 'id')]) === actorId)
      const idUsuarioCambio = normalizeIdentifier(auditRow.id_usuario)
      if (!usuarioRegistrado || idUsuarioCambio !== normalizeIdentifier(usuarioRegistrado[normalizeKey(usersTable?.primaryKey || 'id')])) {
        throw createError({
          statusCode: 403,
          statusMessage: `No puedes deshacer un cambio que no pertenece a tu usuario. Sesión: ${actorId}. Cambio: ${idUsuarioCambio}.`
        })
      }

      const actionType = String(auditRow.tipo ?? '').trim()
      const previousAudit = deserializeAuditRecord(String(auditRow.valor_anterior ?? ''))
      const targetId = String(auditRow.id_registro ?? '').trim()
      const targetTable = previousAudit.table ? getTableDefinition(previousAudit.table) : null
      if (!targetTable) throw createError({ statusCode: 500, statusMessage: 'No se pudo identificar la tabla del cambio.' })

      const tableRows = parseGoogleSheetRows((await fetchSheetValues(sheets, sheetId, targetTable.range)).values || [])
      const primaryKey = targetTable.primaryKey || 'id'
      const rowIndex = tableRows.findIndex((row) => String(row[normalizeKey(primaryKey)] ?? '').trim() === targetId)
      const row = toTableRow(targetTable, previousAudit.values)

      if (actionType === 'creación') {
        if (rowIndex < 0) throw createError({ statusCode: 404, statusMessage: `No se encontró el registro ${targetId} para deshacer su creación.` })
        const tableSheetId = await getSheetId(sheets, sheetId, getTableSheetName(targetTable))
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetId,
          requestBody: { requests: [{ deleteDimension: { range: { sheetId: tableSheetId, dimension: 'ROWS', startIndex: rowIndex + 1, endIndex: rowIndex + 2 } } }] }
        })
      } else if (actionType === 'eliminación') {
        const tableSheetId = await getSheetId(sheets, sheetId, getTableSheetName(targetTable))
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetId,
          requestBody: { requests: [appendCellsRequest(tableSheetId, [row], getFieldNames(targetTable))] }
        })
      } else if (actionType === 'modificación') {
        if (rowIndex < 0) throw createError({ statusCode: 404, statusMessage: `No se encontró el registro ${targetId} para restaurar su estado anterior.` })
        const sheetRowNumber = rowIndex + 2
        const updateRequest = {
          updateCells: {
            start: { sheetId: await getSheetId(sheets, sheetId, getTableSheetName(targetTable)), rowIndex: sheetRowNumber - 1, columnIndex: 0 },
            rows: [rowData(row, getFieldNames(targetTable))],
            fields: 'userEnteredValue'
          }
        }
        await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests: [updateRequest] } })
      }

      return { ok: true, table: targetTable.name, id: targetId, undo: true, action: actionType }
    }

    if (action === 'delete') {
      const { table } = resolveTableFromRequest(query)
      const tableName = typeof query.table === 'string' ? query.table : ''
      const id = typeof query.id === 'string' ? query.id.trim() : ''

      if (!tableName || !table || !id) {
        throw createError({ statusCode: 400, statusMessage: 'Se requiere una tabla válida e id para eliminar datos.' })
      }

      assertWritableTable(table)
      const actorId = await getActorId(event, sheets, sheetId)
      const primaryKey = table.primaryKey || 'id'
      const sheetData = await fetchSheetValues(sheets, sheetId, table.range)
      const sheetRows = sheetData.values || []
      const headers = sheetRows[0] || []
      const primaryKeyIndex = headers.findIndex((header) => normalizeKey(String(header ?? '')) === normalizeKey(primaryKey))

      if (primaryKeyIndex < 0) {
        throw createError({ statusCode: 400, statusMessage: `No se encontró la columna ${primaryKey} en ${tableName}.` })
      }

      const rowIndex = sheetRows.slice(1).findIndex((sheetRow) =>
        String(sheetRow[primaryKeyIndex] ?? '').trim() === id
      )
      if (rowIndex < 0) {
        throw createError({ statusCode: 404, statusMessage: `No se encontró el registro ${id}.` })
      }

      const previousSource = Object.fromEntries(
        headers.map((header, index) => [normalizeKey(String(header ?? '')), sheetRows[rowIndex + 1]?.[index] ?? ''])
      )
      const previousRow = toTableRow(table, previousSource)
      const auditRow = createAuditRow(
        table,
        id,
        actorId,
        new Date().toISOString(),
        'eliminación',
        previousRow,
        {}
      )
      const tableSheetId = await getSheetId(sheets, sheetId, getTableSheetName(table))
      const auditTable = getTableDefinition('cambios')
      if (!auditTable) throw createError({ statusCode: 500, statusMessage: 'No existe la tabla cambios en el esquema.' })
      const auditSheetId = await getSheetId(sheets, sheetId, getTableSheetName(auditTable))

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: tableSheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex + 1,
                  endIndex: rowIndex + 2
                }
              }
            },
            appendCellsRequest(auditSheetId, [auditRow], getFieldNames(auditTable))
          ]
        }
      })

      return { ok: true, table: table.name, id, deleted: true }
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

      assertWritableTable(table)
      const actorId = await getActorId(event, sheets, sheetId)
      const body = await readBody(event)
      const rows = Array.isArray(body?.rows) ? body.rows : Array.isArray(body) ? body : [body]
      const fieldNames = getFieldNames(table)

      if (!fieldNames.length) {
        throw createError({
          statusCode: 400,
          statusMessage: `La tabla ${tableName} no tiene campos definidos`
        })
      }

      const normalizedRows: Record<string, any>[] = rows.map((row: Record<string, any>) => toTableRow(table, row || {}))
      const primaryKey = table.primaryKey || 'id'
      if (normalizedRows.some((row) => !String(row[primaryKey] ?? '').trim())) {
        throw createError({ statusCode: 400, statusMessage: `Cada fila debe incluir ${primaryKey}.` })
      }

      if (!normalizedRows.length) {
        return { ok: true, table: table.name, inserted: 0, fields: fieldNames }
      }

      const timestamp = new Date().toISOString()
      const auditRows = normalizedRows.map((row) => createAuditRow(
        table,
        String(row[primaryKey]),
        actorId,
        timestamp,
        'creación',
        {},
        row
      ))
      const tableSheetId = await getSheetId(sheets, sheetId, getTableSheetName(table))
      const requests: Record<string, any>[] = [appendCellsRequest(tableSheetId, normalizedRows, fieldNames)]

      if (auditRows.length) {
        const auditTable = getTableDefinition('cambios')
        if (!auditTable) throw createError({ statusCode: 500, statusMessage: 'No existe la tabla cambios en el esquema.' })
        const auditSheetId = await getSheetId(sheets, sheetId, getTableSheetName(auditTable))
        requests.push(appendCellsRequest(auditSheetId, auditRows, getFieldNames(auditTable)))
      }

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests }
      })

      return {
        ok: true,
        table: table.name,
        inserted: normalizedRows.length,
        fields: fieldNames
      }
    }

    const requestedRange = typeof query.range === 'string' ? query.range : 'usuarios!A:Z'
    const data = await fetchSheetValues(sheets, sheetId, requestedRange)
    return parseGoogleSheetRows(data.values || [])
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage: error?.statusMessage || error?.response?.data?.error?.message || error?.message || 'Error al obtener o guardar datos de Google Sheets'
    })
  }
})
