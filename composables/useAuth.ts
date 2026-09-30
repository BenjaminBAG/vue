import { useCookie, useState } from '#imports'

type PermisoUsuario = {
  id: string
  idUsuario: string
  idEtiqueta: string
  permiso: string
}

type UsuarioSesion = {
  id?: string | number
  nombre?: string
  email?: string
  rol?: string
  imagen?: string
  permisos: PermisoUsuario[]
  [key: string]: any
}

const normalizarPermiso = (permiso: Record<string, any>): PermisoUsuario => ({
  id: String(permiso?.id ?? '').trim(),
  idUsuario: String(permiso?.idUsuario ?? permiso?.idusuario ?? permiso?.id_usuario ?? '').trim(),
  idEtiqueta: String(permiso?.idEtiqueta ?? permiso?.idetiqueta ?? permiso?.id_etiqueta ?? '').trim(),
  permiso: String(permiso?.permiso ?? 'lector').trim().toLowerCase()
})

const normalizarUsuario = (usuario: Record<string, any>, permisos: PermisoUsuario[] = []): UsuarioSesion => ({
  id: usuario?.id ?? usuario?.ID,
  nombre: String(usuario?.nombre ?? '').trim(),
  email: String(usuario?.email ?? usuario?.correo ?? '').trim(),
  rol: String(usuario?.rol ?? '').trim(),
  imagen: String(usuario?.imagen ?? '').trim(),
  permisos
})

export const useAuth = () => {
  const usuario = useState<UsuarioSesion | null>('usuario_sesion', () => null)
  const permisos = useState<PermisoUsuario[]>('permisos_usuario', () => [])
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/'
  })

  const obtenerPermisosDelUsuario = (usuarioActual: UsuarioSesion | null | undefined) => {
    const permisosRaw = Array.isArray(usuarioActual?.permisos) ? usuarioActual.permisos : []

    return permisosRaw.map(normalizarPermiso)
  }

  const filtrarPorPermisos = <T extends Record<string, any>>(items: T[] = []) => {
    if (!usuario.value) return []

    const permisosUsuario = obtenerPermisosDelUsuario(usuario.value)

    if (!permisosUsuario.length) return []

    return items.filter((item) => {
      const idEtiquetaItem = String(item?.idEtiqueta ?? item?.idetiqueta ?? item?.id_etiqueta ?? '').trim()
      const permisoRelacion = permisosUsuario.find((permiso: PermisoUsuario) => permiso.idEtiqueta === idEtiquetaItem)

      if (!permisoRelacion) return false

      const tieneAcceso = permisoRelacion.permiso === 'administrador' || permisoRelacion.permiso === 'lector'
      return tieneAcceso
    })
  }

  const iniciarSesion = async ({ email, clave }: { email: string; clave: string }) => {
    const usuarios = await $fetch<Array<Record<string, any>>>('/api/sheets', {
      method: 'GET',
      query: {
        action: 'getTable',
        table: 'usuarios'
      }
    })

    const usuarioEncontrado = usuarios.find((item: Record<string, any>) => {
      const emailNormalizado = String(item?.email ?? item?.correo ?? '').trim().toLowerCase()
      const claveNormalizada = String(item?.clave ?? item?.password ?? '').trim()
      return emailNormalizado === String(email ?? '').trim().toLowerCase() && claveNormalizada === String(clave ?? '').trim()
    })

    if (!usuarioEncontrado) {
      throw new Error('Credenciales incorrectas.')
    }

    const permisosUsuario = await $fetch<Array<Record<string, any>>>('/api/sheets', {
      method: 'GET',
      query: {
        action: 'getTable',
        table: 'permisos'
      }
    })

    const permisosRelacionados = permisosUsuario.filter((permiso: Record<string, any>) => {
      const idUsuario = String(permiso?.idUsuario ?? permiso?.idusuario ?? permiso?.id_usuario ?? '').trim()
      return idUsuario === String(usuarioEncontrado.id ?? usuarioEncontrado.ID ?? '').trim()
    })

    const usuarioConPermisos = normalizarUsuario(usuarioEncontrado, permisosRelacionados.map(normalizarPermiso))

    usuario.value = usuarioConPermisos
    permisos.value = usuarioConPermisos.permisos
    token.value = JSON.stringify({
      id: usuarioConPermisos.id,
      email: usuarioConPermisos.email,
      nombre: usuarioConPermisos.nombre
    })

    return usuarioConPermisos
  }

  const cerrarSesion = () => {
    usuario.value = null
    permisos.value = []
    token.value = null
  }

  const restaurarSesion = async () => {
    if (usuario.value) return usuario.value

    const valorCookie = token.value
    if (!valorCookie) return null

    try {
      const datosSesion = typeof valorCookie === 'string' ? JSON.parse(valorCookie) : valorCookie
      if (!datosSesion?.id) {
        token.value = null
        return null
      }

      const usuarioBase = normalizarUsuario(datosSesion)
      usuario.value = usuarioBase
      permisos.value = []

      try {
        const [usuarios, permisosUsuario] = await Promise.all([
          $fetch<Array<Record<string, any>>>('/api/sheets', {
            query: { action: 'getTable', table: 'usuarios' }
          }),
          $fetch<Array<Record<string, any>>>('/api/sheets', {
            query: { action: 'getTable', table: 'permisos' }
          })
        ])

        const usuarioEncontrado = usuarios.find((item) =>
          String(item?.id ?? item?.ID ?? '').trim() === String(datosSesion.id).trim()
        )

        if (usuarioEncontrado) {
          const permisosRelacionados = permisosUsuario
            .filter((permiso) => String(permiso?.idUsuario ?? permiso?.idusuario ?? permiso?.id_usuario ?? '').trim() === String(datosSesion.id).trim())
            .map(normalizarPermiso)
          const usuarioRestaurado = normalizarUsuario(usuarioEncontrado, permisosRelacionados)

          usuario.value = usuarioRestaurado
          permisos.value = usuarioRestaurado.permisos
          return usuarioRestaurado
        }

        return usuarioBase
      } catch {
        return usuarioBase
      }
    } catch (error) {
      token.value = null
      return null
    }
  }

  return {
    usuario,
    permisos,
    token,
    iniciarSesion,
    cerrarSesion,
    restaurarSesion,
    obtenerPermisosDelUsuario,
    filtrarPorPermisos
  }
}
