<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { Asterisk, Clock, User, List } from 'lucide-vue-next'
    import { useAuth } from '../../../composables/useAuth'
    import { useSheets } from '../../../composables/useSheets'
    import { buildEntity } from '../../../composables/useSheetData'
    import BtnDeshacer from './btn_deshacer.vue'
    import FiltroSoloYo from './filtro_solo_yo.vue'
    import AreaDesplazamiento from '../../otros/area_desplazamiento.vue'

    const { usuario } = useAuth()
    const { getTable } = useSheets()
    const cambios = ref([])
    const usuarios = ref([])
    const soloYo = ref(false)
    const errorMensaje = ref('')

    const esCambioPropio = (item) => {
        const idUsuarioActivo = String(usuario.value?.id ?? '').trim()
        return Boolean(idUsuarioActivo) && item.idUsuario === idUsuarioActivo
    }

    const cambiosVisibles = computed(() => {
        if (!soloYo.value) return cambios.value
        return cambios.value.filter(esCambioPropio)
    })

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
                tipo: ['tipo']
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

    onMounted(cargarHistorial)
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="historial">
            <h2>Historial de cambios</h2>
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
                    <tr v-for="item in cambiosVisibles" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.fechaHora }}</td>
                        <td>{{ obtenerNombreUsuario(item.idUsuario) }}</td>
                        <td>{{ item.tipo }} en {{ item.idRegistro }}</td>
                        <td v-if="esCambioPropio(item)"><BtnDeshacer /></td>
                        <td v-else></td>
                    </tr>
                    <tr v-if="!errorMensaje && cambiosVisibles.length === 0">
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