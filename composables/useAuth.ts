import { useCookie, useState } from '#app'

type PermisoUsuario = {
  idEtiqueta: string
  permiso: 'lector' | 'administrador' | string
  nombre: string
}

type UsuarioSesion = {
  id?: string | number
  nombre?: string
  email?: string
  permisos: PermisoUsuario[]
  [key: string]: any
}

export const useAuth = () => {
  const usuario = useState<UsuarioSesion | null>('usuario_sesion', () => null)
  const permisos = useState<PermisoUsuario[]>('permisos_usuario', () => [])
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  const obtenerPermisosDelUsuario = (usuarioActual: UsuarioSesion | null | undefined) => {
    const permisosRaw = Array.isArray(usuarioActual?.permisos) ? usuarioActual.permisos : []

    return permisosRaw.map((permiso: any) => ({
      idEtiqueta: String(permiso?.idEtiqueta ?? permiso?.id_etiqueta ?? '').trim(),
      permiso: String(permiso?.permiso ?? permiso?.rol ?? 'lector').trim().toLowerCase(),
      nombre: String(permiso?.nombre ?? '').trim()
    }))
  }

  const filtrarPorPermisos = <T extends Record<string, any>>(items: T[] = []) => {
    if (!usuario.value) return []

    const permisosUsuario = obtenerPermisosDelUsuario(usuario.value)

    if (!permisosUsuario.length) return []

    return items.filter((item) => {
      const idEtiquetaItem = String(item?.idEtiqueta ?? item?.id_etiqueta ?? '').trim()
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
      const idUsuario = String(permiso?.idUsuario ?? permiso?.id_usuario ?? '').trim()
      return idUsuario === String(usuarioEncontrado.id ?? usuarioEncontrado.ID ?? '').trim()
    })

    const usuarioConPermisos: UsuarioSesion = {
      ...usuarioEncontrado,
      permisos: permisosRelacionados.map((permiso: Record<string, any>) => ({
        idEtiqueta: String(permiso?.idEtiqueta ?? permiso?.id_etiqueta ?? '').trim(),
        permiso: String(permiso?.permiso ?? permiso?.rol ?? 'lector').trim().toLowerCase(),
        nombre: String(permiso?.nombre ?? '').trim()
      }))
    }

    usuario.value = usuarioConPermisos
    permisos.value = usuarioConPermisos.permisos
    token.value = JSON.stringify({
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
      nombre: usuarioEncontrado.nombre
    })

    return usuarioConPermisos
  }

  const cerrarSesion = () => {
    usuario.value = null
    permisos.value = []
    token.value = null
  }

  const restaurarSesion = () => {
    if (usuario.value) return usuario.value

    const valorCookie = token.value
    if (!valorCookie) return null

    try {
      const datosSesion = typeof valorCookie === 'string' ? JSON.parse(valorCookie) : valorCookie
      const usuarioRestaurado: UsuarioSesion = {
        id: datosSesion?.id,
        email: datosSesion?.email,
        nombre: datosSesion?.nombre,
        permisos: []
      }

      usuario.value = usuarioRestaurado
      return usuarioRestaurado
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
