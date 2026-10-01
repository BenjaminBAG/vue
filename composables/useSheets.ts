// composables/useSheets.ts
import { filterByUserId } from './useSheetData'
import { useSheetAccess } from './useSheetAccess.ts'

export const useSheets = () => {
  const usuarioSesion = useState<{ id?: string | number } | null>('usuario_sesion', () => null)
  const { filterByLabelPermission } = useSheetAccess()

  const filtrarPorAcceso = (data: any, userId: string | number | null | undefined, sourceTable: string) => {
    const idUsuario = String(userId ?? usuarioSesion.value?.id ?? '').trim()
    const isPermissionTable = sourceTable.trim().toLowerCase() === 'permisos'
    const filterRows = (rows: Record<string, any>[]) => {
      const userRows = filterByUserId(rows, idUsuario)
      return isPermissionTable ? userRows : filterByLabelPermission(userRows)
    }

    if (Array.isArray(data)) return filterRows(data)
    if (data && typeof data === 'object') return filterRows([data])[0] ?? null
    return data
  }

  const request = async ({
    action = 'read',
    table,
    id,
    range,
    payload,
    method = 'GET'
  }: {
    action?: string
    table?: string
    id?: string | number
    range?: string
    payload?: Record<string, any> | any[] | null
    method?: 'GET' | 'POST'
  } = {}) => {
    const query: Record<string, string> = { action }

    if (table) query.table = table
    if (id !== undefined && id !== null) query.id = String(id)
    if (range) query.range = range

    const fetchOptions = {
      method,
      query,
      headers: {
        Accept: 'application/json'
      },
      ...(payload !== undefined ? { body: payload as any } : {})
    } as any

    return await $fetch<any>('/api/sheets', fetchOptions)
  }

  const fetchSheetRange = async (range = 'usuarios!A:Z', userId?: string | number | null) => {
    const sourceTable = range.split('!')[0] ?? ''
    return filtrarPorAcceso(await request({ action: 'read', range }), userId, sourceTable)
  }

  const getTable = async (
    tableName: string,
    userId?: string | number | null,
    options: { applyAccessFilter?: boolean } = {}
  ): Promise<Record<string, any>[]> => {
    const data = await request({ action: 'getTable', table: tableName })
    return options.applyAccessFilter === false
      ? data as Record<string, any>[]
      : filtrarPorAcceso(data, userId, tableName) as Record<string, any>[]
  }

  const getById = async (tableName: string, id: string | number, userId?: string | number | null) => {
    return filtrarPorAcceso(await request({ action: 'getById', table: tableName, id }), userId, tableName)
  }

  const saveRows = async (tableName: string, rows: Record<string, any>[]) => {
    return await request({
      action: 'append',
      table: tableName,
      payload: { rows },
      method: 'POST'
    })
  }

  const saveRow = async (tableName: string, row: Record<string, any>) => {
    return await saveRows(tableName, [row])
  }

  return {
    fetchSheetRange,
    getTable,
    getById,
    saveRows,
    saveRow
  }
}

export const useSheet = useSheets
export default useSheets

