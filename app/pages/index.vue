<script setup>
    definePageMeta({
        middleware: () => {
            // 1. Obtén el estado de autenticación (ej. una cookie, estado global, pinia, etc.)
            const token = useCookie('auth_token') 
            const estaLogeado = !!token.value

            // 2. Redirige instantáneamente según el estado
            if (!estaLogeado) {
                return navigateTo('/portal/inicio')
            } else {
                return navigateTo('/login')
            }
        }
    })
</script>