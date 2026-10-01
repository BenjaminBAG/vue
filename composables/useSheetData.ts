export const normalizeSheetText = (value: unknown) => String(value ?? '').trim().toLowerCase()

export const normalizeSheetKey = (value: string) =>
  String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')

export const toNormalizedRecord = (record: Record<string, any> = {}) =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [normalizeSheetKey(key), value])
  )

export const getFieldValue = (record: Record<string, any> = {}, candidates: string[]) => {
  const normalized = toNormalizedRecord(record)

  for (const candidate of candidates) {
    const key = normalizeSheetKey(candidate)
    if (key in normalized) return normalized[key]
  }

  return ''
}

export const filterByUserId = <T extends Record<string, any>>(
  items: T[] = [],
  userId: string | number | null | undefined
) => {
  const activeUserId = String(userId ?? '').trim()
  const userIdKey = normalizeSheetKey('id_usuario')

  return items.filter((item) => {
    const normalized = toNormalizedRecord(item)
    if (!(userIdKey in normalized)) return true

    return Boolean(activeUserId) && String(normalized[userIdKey] ?? '').trim() === activeUserId
  })
}

export const buildEntity = (
  source: Record<string, any> = {},
  mapping: Record<string, string | string[]>,
  fallbackIndex = 0
) => {
  const normalized = toNormalizedRecord(source)
  const entity: Record<string, any> = {}

  Object.entries(mapping).forEach(([targetKey, sourceKeys]) => {
    const keys = Array.isArray(sourceKeys) ? sourceKeys : [sourceKeys]
    const value = getFieldValue(normalized, keys)
    entity[targetKey] = value !== '' ? value : targetKey === 'id' ? String(fallbackIndex + 1) : ''
  })

  return entity
}

export const filterBySelection = (
  items: Record<string, any>[],
  selectedTags: string[] = [],
  selectedTypes: string[] = []
) => {
  const tagSet = new Set(selectedTags.map((value) => String(value).trim()))
  const typeSet = new Set(selectedTypes.map((value) => normalizeSheetText(value)))

  const hasTagFilter = tagSet.size > 0
  const hasTypeFilter = typeSet.size > 0

  return items.filter((item) => {
    const itemTags = String(item.idEtiqueta ?? '')
      .split(/[\s,;|]+/)
      .map((value) => String(value).trim())
      .filter(Boolean)

    const matchesTag = !hasTagFilter || itemTags.some((value) => tagSet.has(String(value)))
    const matchesType = !hasTypeFilter || typeSet.has(normalizeSheetText(item.tipo))

    return matchesTag && matchesType
  })
}

export const uniqueByField = (items: Record<string, any>[], fieldName: string) => {
  const unique = new Map<string, Record<string, any>>()

  items.forEach((item) => {
    const value = String(item[fieldName] ?? '').trim()
    if (!value || unique.has(value)) return
    unique.set(value, { ...item, [fieldName]: value })
  })

  return [...unique.values()]
}
