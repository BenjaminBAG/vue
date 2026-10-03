<script setup>
    import { onMounted } from 'vue'
    import { MousePointerClick } from 'lucide-vue-next'
    import { useSheetSelector } from '../../composables/useSheetSelector.ts'
    import SeccionFiltro from '../../components/inicio/SeccionFiltro.vue'
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
        load: cargarDocumentos
    } = useSheetSelector({
        tableName: 'documentos',
        mapping: {
            id: ['id'],
            nombre: ['nombre'],
            tipo: ['tipo'],
            contenidoMarkdown: ['contenidomarkdown'],
            idEtiqueta: ['idetiqueta']
        },
        errorMessage: 'No se pudieron cargar los documentos.',
        logMessage: 'Error al cargar los documentos',
        onSelected: (item) => emit('documento-seleccionado', item)
    })

    onMounted(cargarDocumentos)
</script>

<template>
    <div id="seccion_lista">
        <TituloSeccion :icono=MousePointerClick titulo="Selección de Documentos"/>
        <SeccionFiltro @filtros-cambiados="actualizarFiltros" />
        <Busqueda @buscar="actualizarBusqueda" />
        
        <ChipUnico v-if="documentosFiltrados.length" v-for="item in documentosFiltrados"
        :docSeleccionado="documentoSeleccionado"
        :item="item"
        @click="seleccionarDocumento(item)"
        />
    
        <p v-else-if="errorMensaje" class="mensaje-error">{{ errorMensaje }}</p>
        <p v-else class="mensaje-vacio">No hay documentos para los filtros seleccionados.</p>
    </div>
</template>

<style scoped>
    h2, p, button, svg {
        color: var(--negro);
    }
    #seccion_lista {
        padding: 2em 0;
        .mensaje-vacio {
            margin: 1em 0 0;
            color: var(--gris);
            font-style: italic;
        }
    }
</style>