<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { User, Tag } from 'lucide-vue-next'
    import InputRegular from '../../otros/input-regular.vue'
    import BtPrincipal from '../../botones/btn-principal.vue'
    import AreaDesplazamiento from '../../otros/area_desplazamiento.vue'
    import { useAuth } from '../../../composables/useAuth'
    import { useSheets } from '../../../composables/useSheets'
    import { buildEntity, getFieldValue } from '../../../composables/useSheetData'

    const { usuario: usuarioSesion } = useAuth()
    const { getTable } = useSheets()
    const usuario = computed(() => usuarioSesion.value ?? {})
    const permisos = ref([])
    const etiquetas = ref([])
    const cargando = ref(true)
    const errorMensaje = ref('')

    const obtenerEtiqueta = (permiso) => {
        const idEtiqueta = String(getFieldValue(permiso, ['id_etiqueta', 'idEtiqueta'])).trim()
        return etiquetas.value.find((etiqueta) => etiqueta.id === idEtiqueta) ?? { nombre: '' }
    }

    const cargarDatos = async () => {
        try {
            const idUsuario = String(getFieldValue(usuario.value, ['id'])).trim()
            if (!idUsuario) return

            const [datosPermisos, datosEtiquetas] = await Promise.all([
                getTable('permisos'),
                getTable('etiquetas')
            ])

            permisos.value = datosPermisos
                .map((item, index) => buildEntity(item, {
                    id: ['id'],
                    idEtiqueta: ['id_etiqueta', 'idEtiqueta'],
                    rol: ['permiso', 'rol']
                }, index))

            etiquetas.value = datosEtiquetas
                .map((item, index) => buildEntity(item, {
                    id: ['id'],
                    nombre: ['nombre']
                }, index))

            errorMensaje.value = ''
        } catch (error) {
            console.error('Error al cargar los datos del perfil:', error)
            errorMensaje.value = 'No se pudieron cargar los datos del perfil.'
        } finally {
            cargando.value = false
        }
    }

    onMounted(cargarDatos)

</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="opciones-perfil">
            <h2>Mi Perfil</h2>
            <header>
                <img v-if="usuario.imagen" :src="usuario.imagen">
                <User v-else />
                <p>{{ usuario.nombre }}</p>
                <span>{{ usuario.rol }}</span>
            </header>
            <hr>
            <form action="">
                <label for="">Cambiar nombre</label>
                <InputRegular
                    type="text"
                    :modelValue="usuario.nombre"
                />
                <label for="">Cambiar imagen</label>
                <InputRegular
                    type="text"
                    :modelValue="usuario.imagen"
                />
                <BtPrincipal texto="Guardar cambios"/>
            </form>
            <hr>
            <div class="permisos">
                <table v-if="permisos.length">
                    <tr class="cabecera">
                        <th class="etiqueta"><Tag />Etiqueta</th>
                        <th class="rol"><User />Rol</th>
                    </tr>
                    <tr class="datos" v-for="item in permisos" :key="item.id">
                        <td class="etiquetas">{{ obtenerEtiqueta(item).nombre }}</td>
                        <td class="roles">{{ item.rol }}</td>
                    </tr>
                </table>
                <p v-else-if="errorMensaje">{{ errorMensaje }}</p>
                <p v-else-if="!cargando">No tienes permisos asignados.</p>
            </div>
        </div>
    </AreaDesplazamiento>
</template>

<style scoped>
    .opciones-perfil {
        padding: 2em;
        header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: left;
            margin-bottom: 2em;
            img, svg {
                width: 3em;
                height: 3em;
                object-fit: cover;
                background-color: var(--blanco);
                color: var(--azul);
                border-radius: 50%;
            }
            svg {
                padding: 0.5em;
            }
            p {
                margin: 1em;
            }
            span {
                color: var(--azul);
                font-weight: bold;
            }
        }
        .permisos {
            table {
                width: 100%;;
                .cabecera{
                    .etiqueta {
                        width: 100px;
                        text-align: left;
                    }
                    .rol {
                        width: 150px;
                        text-align: left;
                    }
                    svg {
                        height: 1em;
                        width: auto;
                        margin-right: 0.5em;
                        stroke-width: 0.2em;
                    }
                }
                .datos {
                    .etiquetas {
                        font-family: var(--fuente-mono);
                        align-items: center;
                    }
                    .roles {
                        color: var(--azul);
                        font-family: var(--fuente-mono);
                        font-weight: bold;
                        align-items: center;
                    }
                }
            };
        }
    }
</style>