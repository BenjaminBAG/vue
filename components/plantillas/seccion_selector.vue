<template>
    <div id="seccion_lista">
        <div class="titulo_h2">
            <MousePointerClick class="icono"/>
            <h2>Selección de Plantillas</h2>
        </div>
        <SeccionFiltro @filtros-cambiados="actualizarFiltros" />

        <ul v-if="documentosFiltrados.length">
            <li v-for="item in documentosFiltrados" :key="item.id || item.nombre">
                <button :activo="item === documentoSeleccionado" :class="{'documento_activo': documentoSeleccionado?.id === item.id}" @click="seleccionarDocumento(item)">{{ item.nombre }}</button>
            </li>
        </ul>

        <p v-else-if="errorMensaje" class="mensaje-error">{{ errorMensaje }}</p>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { MousePointerClick } from 'lucide-vue-next'
    import { useSheetSelector } from '../../composables/useSheetSelector'
    import SeccionFiltro from '../../components/plantillas/seccion_filtro.vue'

    const emit = defineEmits(['documento-seleccionado'])
    const {
        selectedItem: documentoSeleccionado,
        filteredItems: documentosFiltrados,
        errorMessage: errorMensaje,
        updateFilters: actualizarFiltros,
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

<style scoped>
    h2, button, svg {
        color: var(--negro);
    }
    #seccion_lista {
        padding: 2em 0;
    }
    .titulo_h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 1em;
    }
    .titulo_h2 .icono {
        width: 2em;
        height: 2em;
        flex-shrink: 0;
        stroke-width: 0.2em;
    }
    .titulo_h2 h2 {
        margin: 0;
        font-size: 1.5rem;
    }
    #seccion_lista ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    #seccion_lista ul li button {
        position: relative;
        overflow: hidden;
        width: 90%;
        padding: 0.5em 0.5em 0.5em 1em;
        margin: 0.2em;
        text-align: left;
        border-radius: 10px;
        border: none;
        background-color: var(--blanco);
        transition: all 0.3s ease-in-out;
        font-size: 1em;
    }
    #seccion_lista ul li button::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%) translateX(-15px);
        opacity: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 10px solid var(--naranja);
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }
    #seccion_lista ul li button:hover {
        cursor: pointer;
        padding-left: 1.5em;
        background-color: color-mix(var(--naranja), var(--blanco) 70%);
    }
    #seccion_lista ul li button:hover::before {
        opacity: 1;
        transform: translateY(-50%) translateX(5px); /* Se mueve suavemente hacia la derecha */
    }
    #seccion_lista ul li .documento_activo {
        padding-left: 1.5em;
        background-color: color-mix(var(--naranja), var(--blanco) 70%);
    }
</style>
