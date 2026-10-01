import { ref } from 'vue'
import { useSheets } from './useSheets'
import { buildEntity } from './useSheetData'

type SheetCollectionOptions = {
  tableName: string
  mapping: Record<string, string | string[]>
  errorMessage: string
  logMessage: string
  filter?: (item: Record<string, any>) => boolean
}

export const useSheetCollection = ({
  tableName,
  mapping,
  errorMessage: defaultErrorMessage,
  logMessage,
  filter = () => true
}: SheetCollectionOptions) => {
  const { getTable } = useSheets()
  const items = ref<Record<string, any>[]>([])
  const errorMessage = ref('')
  const loading = ref(false)

  const load = async () => {
    loading.value = true

    try {
      const rows = await getTable(tableName)
      items.value = rows
        .map((row, index) => buildEntity(row, mapping, index))
        .filter(filter)
      errorMessage.value = ''
    } catch (error) {
      console.error(logMessage, error)
      items.value = []
      errorMessage.value = defaultErrorMessage
    } finally {
      loading.value = false
    }
  }

  return { items, errorMessage, loading, load }
}