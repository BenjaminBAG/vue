<script setup>
    import { ref } from 'vue'
    import FormularioDinamico from '../../otros/FormularioDinamico.vue'
    import AreaDesplazamiento from '../../otros/AreaDesplazamiento.vue'
    import BtnPrincipal from '../../botones/BtnPrincipal.vue'
    import { useSheets } from '../../../composables/useSheets.ts'

    const { saveRow } = useSheets()
    const datosNuevoUsuario = ref({})
    const guardando = ref(false)
    const mensaje = ref('')
    const error = ref(false)
    const camposNuevoUsuario = [
        { id: 'nombre', nombre: 'Nombre', tipo: 'text', placeholder: 'Escribe el nombre completo del usuario', requerido: true },
        { id: 'email', nombre: 'Email', tipo: 'email', placeholder: 'Escribe el email del usuario', requerido: true },
        { id: 'clave', nombre: 'Clave', tipo: 'password', placeholder: 'Escribe una contraseña de 8 caracteres', requerido: true },
        {
            id: 'rol',
            nombre: 'Rol',
            tipo: 'select',
            requerido: true,
            opciones: [
                { value: 'Administrador', label: 'Administrador' },
                { value: 'Lector', label: 'Lector' }
            ]
        }
    ]

    const guardarUsuario = async () => {
        mensaje.value = ''
        error.value = false
        guardando.value = true

        try {
            await saveRow('usuarios', {
                id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
                nombre: String(datosNuevoUsuario.value.nombre ?? '').trim(),
                email: String(datosNuevoUsuario.value.email ?? '').trim(),
                clave: datosNuevoUsuario.value.clave ?? '',
                rol: datosNuevoUsuario.value.rol ?? '',
                imagen: ''
            })

            mensaje.value = 'Usuario guardado correctamente.'
            datosNuevoUsuario.value = {}
        } catch (saveError) {
            console.error('Error al guardar el usuario:', saveError)
            error.value = true
            mensaje.value = 'No se pudo guardar el usuario. Comprueba la conexión con Google Sheets.'
        } finally {
            guardando.value = false
        }
    }
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="panel_administracion">
            <h2>Usuarios</h2>
            <hr>
            <form @submit.prevent="guardarUsuario">
                <h3>Nuevo Usuario</h3>
                <FormularioDinamico v-model="datosNuevoUsuario" :campos="camposNuevoUsuario" />
                <BtnPrincipal :texto="guardando ? 'Guardando...' : 'Guardar'" :disabled="guardando" />
                <p v-if="mensaje" :class="{ error }" role="status">{{ mensaje }}</p>
            </form>
        </div>
    </AreaDesplazamiento>
</template>

<style scoped>
    .panel_administracion {
        padding: 2em;
    }
    form {
        display: grid;
        gap: 0.75em;
    }
    .error {
        color: #a12622;
    }
</style>