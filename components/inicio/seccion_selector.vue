<script setup>
    import { onMounted } from 'vue'
    import { MousePointerClick } from 'lucide-vue-next'
    import { useSheetSelector } from '../../composables/useSheetSelector'
    import SeccionFiltro from '../../components/inicio/seccion_filtro.vue'
    import TituloSeccion from '../otros/TituloSeccion.vue'

    const emit = defineEmits(['documento-seleccionado'])
    const {
        selectedItem: documentoSeleccionado,
        filteredItems: documentosFiltrados,
        errorMessage: errorMensaje,
        updateFilters: actualizarFiltros,
        selectItem: seleccionarDocumento,
        load: cargarDocumentos
    } = useSheetSelector({
        tableName: 'documentos',
        mapping: {
            id: ['id'],
            nombre: ['nombre', 'titulo', 'documento', 'title'],
            tipo: ['tipo', 'categoria', 'clasificacion'],
            contenidoMarkdown: ['contenidomarkdown', 'markdown', 'contenido', 'texto', 'body'],
            idEtiqueta: ['idetiqueta', 'etiqueta', 'tag']
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
        
        <ul v-if="documentosFiltrados.length">
            <li v-for="item in documentosFiltrados" :key="item.id || item.nombre">
                <button
                :activo="item === documentoSeleccionado"
                :class="{'documento_activo': documentoSeleccionado?.id === item.id}"
                @click="seleccionarDocumento(item)"
                >
                    {{ item.nombre }}
                </button>
            </li>
        </ul>
    
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
        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            li {
                button {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    margin: 0.2em 0;
                    padding: 0.5em 0.5em 0.5em 1em;
                    font-size: 1em;
                    text-align: left;
                    border-radius: 10px;
                    border: none;
                    background-color: var(--blanco);
                    transition: all 0.3s ease-in-out;
                    &::before {
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
                    &:hover {
                        cursor: pointer;
                        padding-left: 1.5em;
                        background-color: color-mix(var(--naranja), var(--blanco) 70%);
                        &::before {
                            opacity: 1;
                            transform: translateY(-50%) translateX(5px);
                        }
                    }
                }
                .documento_activo {
                    padding-left: 1.5em;
                    background-color: color-mix(var(--naranja), var(--blanco) 70%);
                }
            }
        }
        .mensaje-vacio {
            margin: 1em 0 0;
            color: var(--gris);
            font-style: italic;
        }
    }
</style>
