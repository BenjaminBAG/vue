<template>
    <div id="seccion_lista">
        <div class="titulo_h2">
            <MousePointerClick class="icono"/>
            <h2>Selección de Plantillas</h2>
        </div>
        <SeccionFiltro @filtros-cambiados="actualizarFiltros" />

        <ul v-if="documentosFiltrados.length">
            <li v-for="item in documentosFiltrados" :key="item.id || item.nombre">
                <button :activo="item === Documento-seleccionado" :class="{'documento_activo': documentoSeleccionado?.id === item.id}" @click="seleccionarDocumento(item)">{{ item.nombre }}</button>
            </li>
        </ul>

        <p v-else-if="errorMensaje" class="mensaje-error">{{ errorMensaje }}</p>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { MousePointerClick } from 'lucide-vue-next'
    import { useSheets } from '../../composables/useSheets'
    import SeccionFiltro from '../../components/plantillas/seccion_filtro.vue'

    const documentoSeleccionado = ref(null)
    const emit = defineEmits(['documento-seleccionado'])
    const { fetchSheetRange } = useSheets()
    const documentos = ref([])
    const errorMensaje = ref('')
    const filtros = ref({ etiquetas: [], tipos: [] })

    const normalizarTexto = (valor) => String(valor ?? '').trim().toLowerCase()

    const documentosFiltrados = computed(() => {
        const etiquetasSeleccionadas = new Set(filtros.value.etiquetas.map((item) => String(item).trim()))
        const tiposSeleccionados = new Set(filtros.value.tipos.map((item) => normalizarTexto(item)))

        const hayFiltroEtiquetas = etiquetasSeleccionadas.size > 0
        const hayFiltroTipos = tiposSeleccionados.size > 0

        return documentos.value.filter((item) => {
            const etiquetasDocumento = String(item.idEtiqueta ?? '')
                .split(/[\s,;|]+/)
                .map((valor) => String(valor).trim())
                .filter(Boolean)

            const coincideEtiqueta = !hayFiltroEtiquetas || etiquetasDocumento.some((valor) => etiquetasSeleccionadas.has(String(valor)))
            const coincideTipo = !hayFiltroTipos || tiposSeleccionados.has(normalizarTexto(item.tipo))

            return coincideEtiqueta && coincideTipo
        })
    })

    const normalizarCampo = (obj, candidatos) => {
        const claves = Object.keys(obj || {}).map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, ''))

        for (const candidato of candidatos) {
            const claveNormalizada = candidato.toLowerCase().replace(/[^a-z0-9]/g, '')
            const indice = claves.indexOf(claveNormalizada)

            if (indice !== -1) {
                return Object.values(obj)[indice]
            }
        }

        return ''
    }

    const cargarChips = async () => {
        try {
            const data = await fetchSheetRange('plantillas!A:E')

            documentos.value = data
                .map((item, index) => {
                    const documento = Object.fromEntries(
                        Object.entries(item).map(([key, value]) => [String(key).trim().toLowerCase(), value])
                    )

                    return {
                        id: String(normalizarCampo(documento, ['id']) || index + 1),
                        nombre: normalizarCampo(documento, ['nombre', 'titulo', 'documento', 'title']) || '',
                        tipo: normalizarCampo(documento, ['tipo', 'categoria', 'clasificacion']) || '',
                        urlDocumento: normalizarCampo(documento, ['urlDocumento', 'url', 'contenido', 'texto', 'body']) || '',
                        idEtiqueta: normalizarCampo(documento, ['idetiqueta', 'etiqueta', 'tag']) || '',
                    }
                })
                .filter((item) => item.nombre)

            errorMensaje.value = ''
        } catch (error) {
            console.error('Error al cargar los chips:', error)
            errorMensaje.value = 'No se pudieron cargar los documentos.'
            documentos.value = []
        }
    }

    const actualizarFiltros = (nuevosFiltros) => {
        filtros.value = nuevosFiltros || { etiquetas: [], tipos: [] }
    }

    const seleccionarDocumento = (item) => {
        documentoSeleccionado.value = item
        emit('documento-seleccionado', item)
    }

    
    onMounted(() => {
        cargarChips()
    })
</script>

<style>
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
