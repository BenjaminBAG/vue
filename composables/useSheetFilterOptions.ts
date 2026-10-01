import { computed, ref } from 'vue'
import { useSheets } from './useSheets'
import { buildEntity, uniqueByField } from './useSheetData'
import { useSheetAccess } from './useSheetAccess'

type SelectedFilters = {
  etiquetas: string[]
  tipos: string[]
}

export const useSheetFilterOptions = (
  typesTable: string,
  onFiltersChanged: (filters: SelectedFilters) => void
) => {
  const { getTable } = useSheets()
  const { filterLabelsByPermission } = useSheetAccess()
  const etiquetas = ref<Record<string, any>[]>([])
  const tipos = ref<Record<string, any>[]>([])
  const errorMessage = ref('')

  const hasActiveFilters = computed(() =>
    etiquetas.value.some((item) => item.seleccionado) || tipos.value.some((item) => item.seleccionado)
  )

  const emitFilters = () => {
    onFiltersChanged({
      etiquetas: etiquetas.value
        .filter((item) => item.seleccionado)
        .map((item) => String(item.id).trim()),
      tipos: tipos.value
        .filter((item) => item.seleccionado)
        .map((item) => String(item.tipo).trim())
    })
  }

  const clearFilters = () => {
    etiquetas.value = etiquetas.value.map((item) => ({ ...item, seleccionado: false }))
    tipos.value = tipos.value.map((item) => ({ ...item, seleccionado: false }))
    emitFilters()
  }

  const load = async () => {
    try {
      const [dataEtiquetas, dataTipos] = await Promise.all([
        getTable('etiquetas'),
        getTable(typesTable)
      ])

      etiquetas.value = filterLabelsByPermission(dataEtiquetas)
        .map((item, index) => ({
          ...buildEntity(item, {
            id: ['id'],
            nombre: ['nombre'],
            color: ['color']
          }, index),
          seleccionado: false
        }))
        .filter((item) => item.nombre)

      tipos.value = uniqueByField(
        dataTipos
          .map((item) => ({
            tipo: String(item.tipo ?? '').trim(),
            seleccionado: false
          }))
          .filter((item) => item.tipo),
        'tipo'
      )

      errorMessage.value = ''
    } catch (error) {
      console.error(`Error al cargar los filtros de ${typesTable}:`, error)
      errorMessage.value = 'No se pudieron cargar los filtros.'
      etiquetas.value = []
      tipos.value = []
    }
  }

  return {
    etiquetas,
    tipos,
    errorMessage,
    hasActiveFilters,
    emitFilters,
    clearFilters,
    load
  }
}