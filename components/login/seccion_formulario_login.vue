<template>
    <div id="seccion_formulario_login">
        <form @submit.prevent="iniciarSesionUsuario">
            <section id="seccion_titulo_formulario_login">
                <h1>Iniciar sesión</h1>
                <span>Ingresa tus credenciales para acceder al portal</span>
            </section>
            <section id="seccion_inputs_formulario_login">
                <label>Dirección de correo electrónico</label>
                <InputRegular
                    v-model="email"
                    type="email"
                    placeholder="Escribe tu correo..."
                    required
                />
                <label>Contraseña</label>
                <InputRegular
                    v-model="clave"
                    type="password"
                    placeholder="Escribe tu contraseña..."
                    minlength="8"
                    maxlength="12"
                    required
                />
                <p v-if="errorMensaje" class="mensaje-error">{{ errorMensaje }}</p>
                <BtnPrincipal :texto="cargando ? 'Ingresando...' : 'Ingresar'" :disabled="cargando" />
            </section>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import BtnPrincipal from '../../components/botones/btn-principal.vue'
    import InputRegular from '../../components/otros/input-regular.vue'
    import { useAuth } from '../../composables/useAuth'

    const { iniciarSesion } = useAuth()
    const email = ref('')
    const clave = ref('')
    const errorMensaje = ref('')
    const cargando = ref(false)

    const iniciarSesionUsuario = async () => {
        errorMensaje.value = ''

        if (!email.value.trim() || !clave.value.trim()) {
            errorMensaje.value = 'Debes escribir email y contraseña.'
            return
        }

        cargando.value = true

        try {
            await iniciarSesion({
                email: email.value,
                clave: clave.value
            })

            await navigateTo('/portal/inicio')
        } catch (error) {
            errorMensaje.value = error instanceof Error ? error.message : 'No se pudo iniciar sesión.'
        } finally {
            cargando.value = false
        }
    }
</script>

<style scoped>
    #seccion_formulario_login {
      grid-column: 1;
      grid-row: 2;
      width: calc(100% - padding);
      height: calc(100% - padding);
      padding: 2em;
      background-color: var(--beige);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    @media (max-width: 768px) {
        #seccion_formulario_login {
            grid-column: 1 / 3;
        }
    }
    #seccion_formulario_login form {
        max-width: 600px;
        min-width: 300px;
        color: var(--blanco-siempre);
        display: flex;
        flex-direction: column;
        gap: 2em;
    }
    #seccion_formulario_login #seccion_inputs_formulario_login {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
</style>