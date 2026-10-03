<script setup>
    import { onMounted } from 'vue'
    import { MousePointerClick } from 'lucide-vue-next'
    import { useSheetSelector } from '../../composables/useSheetSelector'
    import SeccionFiltro from './SeccionFiltro.vue'
    import TituloSeccion from '../otros/TituloSeccion.vue'
    import Busqueda from '../otros/Busqueda.vue'
    import ChipUnico from '../otros/ChipUnico.vue'

    const emit = defineEmits(['documento-seleccionado'])
    const {
        selectedItem: documentoSeleccionado,
        filteredItems: documentosFiltrados,
        errorMessage: errorMensaje,
        updateFilters: actualizarFiltros,
        updateSearch: actualizarBusqueda,
        selectItem: seleccionarDocumento,
        load: cargarPlantillas
    } = useSheetSelector({
        tableName: 'plantillas',
        mapping: {
            id: ['id'],
            nombre: ['nombre', 'titulo', 'documento', 'title'],
            tipo: ['tipo', 'categoria', 'clasificacion'],
            urlDocumento: ['urldocumento', 'url', 'documento', 'contenido'],
            idEtiqueta: ['idetiqueta', 'etiqueta', 'tag']
        },
        errorMessage: 'No se pudieron cargar las plantillas.',
        logMessage: 'Error al cargar las plantillas',
        onSelected: (item) => emit('documento-seleccionado', item)
    })

    onMounted(cargarPlantillas)
</script>

<template>
    <div id="seccion_lista">
        <TituloSeccion titulo="Selección de Plantillas" :icono="MousePointerClick" />
        <SeccionFiltro @filtros-cambiados="actualizarFiltros" />
        <Busqueda @buscar="actualizarBusqueda" />

        <ChipUnico v-if="documentosFiltrados.length" v-for="item in documentosFiltrados"
        :docSeleccionado="documentoSeleccionado"
        :item="item"
        @click="seleccionarDocumento(item)"
        />
        
        <p v-else-if="errorMensaje" class="mensaje-error">{{ errorMensaje }}</p>
    </div>
</template>

<style scoped>
    h2, button, svg {
        color: var(--negro);
    }
    #seccion_lista {
        padding: 2em 0;
    }
</style>