<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { Asterisk, Clock, User, List } from 'lucide-vue-next'
    import { useAuth } from '../../../composables/useAuth.ts'
    import { useSheets } from '../../../composables/useSheets.ts'
    import { buildEntity } from '../../../composables/useSheetData.ts'
    import BtnDeshacer from './BtnDeshacer.vue'
    import FiltroSoloYo from './FiltroSoloYo.vue'
    import AreaDesplazamiento from '../../otros/AreaDesplazamiento.vue'

    const { usuario } = useAuth()
    const { getTable, undoChange } = useSheets()
    const cambios = ref([])
    const usuarios = ref([])
    const soloYo = ref(false)
    const errorMensaje = ref('')
    const descripcionActiva = ref(null)
    const cambioEnProgreso = ref(null)

    const esCambioPropio = (item) => {
        const idUsuarioActivo = String(usuario.value?.id ?? '').trim()
        return Boolean(idUsuarioActivo) && item.idUsuario === idUsuarioActivo
    }

    const cambiosVisibles = computed(() => {
        if (!soloYo.value) return cambios.value.filter(x => x.ambito !== 'privado' || x.ambito === 'privado' && esCambioPropio(x))
        return cambios.value.filter(esCambioPropio)
    })

    const cambiosOrdenados = computed(() => [...cambiosVisibles.value].sort((a, b) => {
        const fechaA = new Date(a.fechaHora || 0).getTime()
        const fechaB = new Date(b.fechaHora || 0).getTime()
        return fechaB - fechaA
    }))

    const obtenerNombreUsuario = (idUsuario) => {
        const usuarioEncontrado = usuarios.value.find((u) => u.id === idUsuario)
        return usuarioEncontrado ? usuarioEncontrado.nombre : idUsuario
    }

    const cargarHistorial = async () => {
        try {
            const [cambiosRaw, usuariosRaw] = await Promise.all([
                getTable('cambios', undefined, { applyAccessFilter: false }),
                getTable('usuarios')
            ])

            cambios.value = cambiosRaw.map((item, index) => buildEntity(item, {
                id: ['id'],
                idUsuario: ['id_usuario', 'idusuario'],
                idRegistro: ['id_registro', 'idregistro'],
                fechaHora: ['fecha_hora', 'fechahora'],
                tipo: ['tipo'],
                valorAnterior: ['valor_anterior'],
                valorNuevo: ['valor_nuevo'],
                ambito: ['ambito']
            }, index))
            usuarios.value = usuariosRaw.map((item, index) => buildEntity(item, {
                id: ['id'],
                nombre: ['nombre']
            }, index))
            errorMensaje.value = ''
        } catch (error) {
            console.error('Error al cargar el historial de cambios:', error)
            errorMensaje.value = 'No se pudo cargar el historial de cambios.'
        }
    }

    const deshacerCambio = async (cambio) => {
        if (!cambio?.id || cambioEnProgreso.value) return

        cambioEnProgreso.value = cambio.id
        errorMensaje.value = ''
        try {
            await undoChange(cambio.id)
            await cargarHistorial()
        } catch (error) {
            console.error('Error al deshacer el cambio:', error)
            errorMensaje.value = error?.data?.statusMessage || error?.message || 'No se pudo deshacer el cambio.'
        } finally {
            cambioEnProgreso.value = null
        }
    }

    onMounted(cargarHistorial)
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="historial">
            <h2>Historial de cambios</h2>
            <p>Se muestran todos los cambios públicos y los privados de tu usuario.</p>
            <FiltroSoloYo v-model="soloYo" />
            <p v-if="errorMensaje" class="mensaje-historial">{{ errorMensaje }}</p>
            <table>
                <thead>
                    <tr class="cabecera">
                        <th class="id"><Asterisk />Id</th>
                        <th class="tiempo"><Clock />Tiempo</th>
                        <th class="nombre"><User />Nombre</th>
                        <th class="descripcion"><List />Descripción</th>
                        <th class="deshacer"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cambiosOrdenados" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.fechaHora }}</td>
                        <td>{{ obtenerNombreUsuario(item.idUsuario) }}</td>
                        <td>
                            <button
                                type="button"
                                class="boton-mostrar-descripcion"
                                :aria-expanded="String(item.id === descripcionActiva)"
                                @click="descripcionActiva = descripcionActiva === item.id ? null : item.id"
                            >
                                {{ item.tipo }} ({{ item.ambito }}) en {{ item.idRegistro }}
                                <span class="texto-toggle">{{ descripcionActiva === item.id ? 'Ocultar' : 'Mostrar' }}</span>
                            </button>
                            <div v-if="descripcionActiva === item.id" class="descripcion-expandida">
                                <span class="valor-anterior">
                                    {{ item.valorAnterior === "" ? "(vacío)" : item.valorAnterior }}
                                </span>
                                <span class="flecha">→</span>
                                <span class="valor-nuevo">
                                    {{ item.valorNuevo === "" ? "(vacío)" : item.valorNuevo }}
                                </span>
                            </div>
                        </td>
                        <td v-if="esCambioPropio(item)">
                            <BtnDeshacer
                                :deshabilitado="cambioEnProgreso !== null"
                                :cargando="cambioEnProgreso === item.id"
                                @deshacer="deshacerCambio(item)"
                            />
                        </td>
                        <td v-else></td>
                    </tr>
                    <tr v-if="!errorMensaje && cambiosOrdenados.length === 0">
                        <td colspan="5" class="mensaje-historial">No hay cambios para mostrar.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AreaDesplazamiento>
</template>

<style scoped>
    .historial {
        padding: 2em;
        table {
            width: 100%;
            border-collapse: collapse;
            .cabecera {
                .id, .tiempo, .nombre, .descripcion, .deshacer  {
                    text-align: left;
                }
                svg {
                    height: 1em;
                    width: auto;
                    margin-right: 0.5em;
                    stroke-width: 0.2em;
                }
            }
            td, th {
                padding: 0.6em 0.4em;
                vertical-align: top;
                .valor-anterior {
                    font-family: var(--fuente-mono);
                    font-size: 0.8em;
                    color: var(--rojo)
                }
                .valor-nuevo {
                    font-family: var(--fuente-mono);
                    font-size: 0.8em;
                    color: var(--verde)
                }
            }
            .boton-mostrar-descripcion {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1em;
                width: 100%;
                padding: 0;
                border: none;
                background: transparent;
                color: inherit;
                cursor: pointer;
                text-align: left;
                .texto-toggle {
                    color: var(--gris);
                    font-size: 0.8em;
                    white-space: nowrap;
                }
            }
            .descripcion-expandida {
                display: flex;
                align-items: center;
                gap: 0.5em;
                width: 100%;
                max-width: 100%;
                margin-top: 0.5em;
                padding: 0.75em;
                overflow-wrap: anywhere;
                overflow-x: auto;
                border-radius: 0.5em;
                background-color: color-mix(in srgb, var(--gris-claro, #f0f0f0) 60%, transparent);
                .flecha {
                    flex-shrink: 0;
                }
            }
        }
    }
    .mensaje-historial {
        padding: 0.75em 0;
        color: var(--gris);
        font-style: italic;
        text-align: left;
    }
</style>