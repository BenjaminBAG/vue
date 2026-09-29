import { useAuth } from '../../composables/useAuth'
export default defineNuxtRouteMiddleware((to) => {
  const { usuario, restaurarSesion } = useAuth()
  const sesionActiva = restaurarSesion()

  const estaEnPortal = to.path.startsWith('/portal')
  const estaEnLogin = to.path === '/login'

  if (estaEnPortal && !sesionActiva && !usuario.value) {
    return navigateTo('/login')
  }

  if (estaEnLogin && sesionActiva) {
    return navigateTo('/portal/inicio')
  }
})
