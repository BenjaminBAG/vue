import { computed, ref } from 'vue'
import { useSheetCollection } from './useSheetCollection'
import { filterBySelection } from './useSheetData'

type SelectionFilters = {
  etiquetas: string[]
  tipos: string[]
}

type SheetSelectorOptions = {
  tableName: string
  mapping: Record<string, string | string[]>
  errorMessage: string
  logMessage: string
  onSelected: (item: Record<string, any>) => void
}

export const useSheetSelector = ({
  tableName,
  mapping,
  errorMessage,
  logMessage,
  onSelected
}: SheetSelectorOptions) => {
  const selectedItem = ref<Record<string, any> | null>(null)
  const filters = ref<SelectionFilters>({ etiquetas: [], tipos: [] })
  const { items, errorMessage: loadError, load } = useSheetCollection({
    tableName,
    mapping,
    errorMessage,
    logMessage,
    filter: (item) => Boolean(item.nombre)
  })

  const filteredItems = computed(() =>
    filterBySelection(items.value, filters.value.etiquetas, filters.value.tipos)
  )

  const updateFilters = (value?: Partial<SelectionFilters> | null) => {
    filters.value = {
      etiquetas: value?.etiquetas ?? [],
      tipos: value?.tipos ?? []
    }
  }

  const selectItem = (item: Record<string, any>) => {
    selectedItem.value = item
    onSelected(item)
  }

  return { selectedItem, filteredItems, errorMessage: loadError, updateFilters, selectItem, load }
}