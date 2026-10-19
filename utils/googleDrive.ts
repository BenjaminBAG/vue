export const getGoogleDriveId = (value: unknown) => {
  const input = String(value ?? '').trim()
  if (!input) return ''

  const pathMatch = input.match(/\/(?:document\/d|folders)\/([^/?#]+)/i)
  if (pathMatch) return pathMatch[1]

  const queryMatch = input.match(/[?&]id=([^&#]+)/i)
  return queryMatch ? decodeURIComponent(queryMatch[1]) : input
}

export const getGoogleDocUrl = (value: unknown) => {
  const id = getGoogleDriveId(value)
  return id ? `https://docs.google.com/document/d/${encodeURIComponent(id)}/edit` : ''
}
