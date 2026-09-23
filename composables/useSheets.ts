// composables/useSheets.ts
export const useSheets = () => {
  const fetchSheetRange = async (range = 'prueba!A:C') => {
    return await $fetch('/api/sheets', {
      query: { range },
      headers: {
        Accept: 'application/json'
      }
    })
  }

  return {
    fetchSheetRange
  }
}

