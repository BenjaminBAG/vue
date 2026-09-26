<template>
    <div id="panel_lateral_calendarios">
        <header id="botones_seleccion">

        </header>

        <div id="seccion_selector_calendarios">
            <div class="titulo_h2">
                <Calendar class="icono"/>
                <h2>Calendarios</h2>
            </div>
    
            <ul v-if="calendarios.length">
                <li v-for="item in calendarios" :key="item.id || item.nombre">
                    <button
                    :activo="item === calendario-seleccionado"
                    :class="{'documento_activo': calendarioSeleccionado?.id === item.id}"
                     @click="seleccionarDocumento(item)"
                     >
                        {{ item.nombre }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { Calendar } from 'lucide-vue-next'
    import { useSheets } from '../../composables/useSheets'

    const calendarioSeleccionado = ref(null)
    const emit = defineEmits(['calendario-seleccionado'])
    const { fetchSheetRange } = useSheets()
    const documentos = ref([])
    const errorMensaje = ref('')
    const filtros = ref({ etiquetas: [], tipos: [] })

    const normalizarTexto = (valor) => String(valor ?? '').trim().toLowerCase()

    const calendarios = computed(() => {
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
            const data = await fetchSheetRange('calendarios!A:D')

            documentos.value = data
                .map((item, index) => {
                    const documento = Object.fromEntries(
                        Object.entries(item).map(([key, value]) => [String(key).trim().toLowerCase(), value])
                    )

                    return {
                        id: String(normalizarCampo(documento, ['id']) || index + 1),
                        nombre: normalizarCampo(documento, ['nombre', 'titulo', 'documento', 'title']) || '',
                        color: normalizarCampo(documento, ['tipo', 'categoria', 'clasificacion']) || '',
                        idEtiqueta: normalizarCampo(documento, ['idetiqueta', 'etiqueta', 'tag']) || ''
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
        calendarioSeleccionado.value = item
        emit('calendario-seleccionado', item)
    }

    onMounted(() => {
        cargarChips()
    })
</script>

<style scoped>
    #panel_lateral_calendarios {
        padding: 2em;
    }
    @media (max-width: 768px) {
        #panel_lateral_calendarios {
            display: none;
        }
    }
    #seccion_selector_calendarios {
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
    }
    #seccion_selector_calendarios ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    #seccion_selector_calendarios ul li button {
        position: relative;
        overflow: hidden;
        width: 95%;
        margin: 0.2em 0;
        padding: 0.5em 0.5em 0.5em 1em;
        font-size: 1em;
        text-align: left;
        border-radius: 10px;
        border: none;
        background-color: var(--blanco);
        transition: all 0.3s ease-in-out;
    }
    #seccion_selector_calendarios ul li button::before {
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
    #seccion_selector_calendarios ul li button:hover {
        cursor: pointer;
        padding-left: 1.5em;
        background-color: color-mix(var(--naranja), var(--blanco) 70%);
    }
    #seccion_selector_calendarios ul li button:hover::before {
        opacity: 1;
        transform: translateY(-50%) translateX(5px);
    }
    #seccion_selector_calendarios ul li .documento_activo {
        padding-left: 1.5em;
        background-color: color-mix(var(--naranja), var(--blanco) 70%);
    }
    .mensaje-vacio {
        margin: 1em 0 0;
        color: var(--gris-oscuro, #555);
        font-style: italic;
    }
</style>