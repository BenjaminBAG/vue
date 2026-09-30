<script setup>
    import { useAuth } from '~~/composables/useAuth'

    definePageMeta({
        middleware: async () => {
            const { restaurarSesion } = useAuth()
            const sesionActiva = await restaurarSesion()

            if (sesionActiva) {
                return navigateTo('/portal/inicio')
            }

            return navigateTo('/login')
        }
    })
</script>