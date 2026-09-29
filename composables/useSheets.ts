// composables/useSheets.ts
export const useSheets = () => {
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

  const fetchSheetRange = async (range = 'usuarios!A:Z') => {
    return await request({ action: 'read', range })
  }

  const getTable = async (tableName: string) => {
    return await request({ action: 'getTable', table: tableName })
  }

  const getById = async (tableName: string, id: string | number) => {
    return await request({ action: 'getById', table: tableName, id })
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

