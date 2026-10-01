import { getFieldValue, normalizeSheetText, toNormalizedRecord } from './useSheetData'

export const useSheetAccess = () => {
  const permisos = useState<Array<Record<string, any>>>('permisos_usuario', () => [])

  const getPermissionForLabel = (labelId: string | number | null | undefined) => {
    const targetId = String(labelId ?? '').trim()
    if (!targetId) return null

    const roles = permisos.value
      .filter((item) => String(getFieldValue(item, ['id_etiqueta', 'idEtiqueta'])).trim() === targetId)
      .map((item) => normalizeSheetText(getFieldValue(item, ['permiso'])))
      .filter(Boolean)

    return ['administrador', 'editor', 'lector'].find((role) => roles.includes(role)) ?? roles[0] ?? null
  }

  const canRead = (labelId: string | number | null | undefined) =>
    ['administrador', 'editor', 'lector'].includes(getPermissionForLabel(labelId) ?? '')

  const canEdit = (labelId: string | number | null | undefined) =>
    ['administrador', 'editor'].includes(getPermissionForLabel(labelId) ?? '')

  const filterLabelsByPermission = <T extends Record<string, any>>(labels: T[] = []) =>
    labels.filter((label) => canRead(getFieldValue(label, ['id'])))

  const filterByLabelPermission = <T extends Record<string, any>>(items: T[] = []) => {
    const labelKey = 'idetiqueta'

    return items.filter((item) => {
      const normalized = toNormalizedRecord(item)
      if (!(labelKey in normalized)) return true

      return canRead(normalized[labelKey])
    })
  }

  return {
    getPermissionForLabel,
    canRead,
    canEdit,
    filterLabelsByPermission,
    filterByLabelPermission
  }
}