<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { Tag } from 'lucide-vue-next'
    import { useSheets } from '../../composables/useSheets'
    import { useSheetAccess } from '../../composables/useSheetAccess'
    import { buildEntity } from '../../composables/useSheetData'
    import BotonLimpiarFiltro from '../botones/BtnLimpiarFiltro.vue'
    import ChipReactivo from '../otros/ChipReactivo.vue'

    const emit = defineEmits(['filtros-cambiados'])
    const { getTable } = useSheets()
    const { filterLabelsByPermission } = useSheetAccess()
    const etiquetas = ref([])
    const errorMensaje = ref('')

    const hayFiltrosActivos = computed(() => etiquetas.value.some((item) => item.seleccionado))

    const emitirFiltros = () => {
        emit('filtros-cambiados', {
            etiquetas: etiquetas.value
                .filter((item) => item.seleccionado)
                .map((item) => String(item.id).trim())
        })
    }

    const limpiarFiltros = () => {
        etiquetas.value = etiquetas.value.map((item) => ({ ...item, seleccionado: false }))
        emitirFiltros()
    }

    const cargarEtiquetas = async () => {
        try {
            const data = await getTable('etiquetas')
            etiquetas.value = filterLabelsByPermission(data)
                .map((item, index) => ({
                    ...buildEntity(item, {
                        id: ['id'],
                        nombre: ['nombre']
                    }, index),
                    seleccionado: false
                }))
                .filter((item) => item.nombre)
            errorMensaje.value = ''
        } catch (error) {
            console.error('Error al cargar las etiquetas de calendarios:', error)
            errorMensaje.value = 'No se pudieron cargar las etiquetas.'
        }
    }

    onMounted(cargarEtiquetas)
</script>

<template>
    <section id="seccion_filtro">
        <ul v-if="etiquetas.length">
            <ChipReactivo v-for="item in etiquetas"
            :key="item.id"
            :valor="item"
            :icono="Tag"
            @emitir-filtros="emitirFiltros"
            />
        </ul>
        <p v-else-if="errorMensaje" class="mensaje-filtro">{{ errorMensaje }}</p>
        <p v-else class="mensaje-filtro">No hay etiquetas disponibles.</p>

        <BotonLimpiarFiltro
            :disabled="!hayFiltrosActivos"
            @limpiar-filtro="limpiarFiltros"
        />
    </section>
</template>

<style scoped>
    #seccion_filtro {
        padding-right: 1em;
        margin-bottom: 1.5em;
        ul {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4em;
            margin: 0;
            padding: 0;
            list-style: none;
            li {
                display: inline-block;
            }
        }
    }
    .mensaje-filtro {
        margin: 0.5em 0;
        color: var(--gris);
        font-style: italic;
    }
    #seccion_filtro :deep(.boton-limpiar-filtro) {
        margin-top: 0.75em;
    }
</style>
