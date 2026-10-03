<script setup>
    import { computed, nextTick, onMounted, ref, watch } from 'vue'
    import InputRegular from '../otros/InputRegular.vue'
    import BtnPrincipal from '../botones/BtnPrincipal.vue'
    import { Pencil } from 'lucide-vue-next'
    import HerramientasEdicion from '../otros/HerramientasEdicion.vue'
    import Selector from '../otros/Selector.vue'
    import { useSheets } from '../../composables/useSheets.ts'
    import { buildEntity } from '../../composables/useSheetData.ts'
    import TituloSeccion from '../otros/TituloSeccion.vue'

    const props = defineProps({
        documentoParaEditar: {
            type: Object,
            default: () => ({ nombre: '', contenidoMarkdown: '' })
        },
        modelValue: {
            type: String,
            default: ''
        },
        modo: {
            type: String,
            default: 'editar'
        }
    })

    const emit = defineEmits(['update:modelValue', 'documento-guardado'])
    const textareaRef = ref(null)
    const etiquetas = ref([])
    const nombreDocumento = ref('')
    const etiquetaSeleccionada = ref('')
    const guardando = ref(false)
    const mensaje = ref('')
    const error = ref(false)

    const { getTable, saveRow, updateRow } = useSheets()

    watch(
        [() => props.modo, () => props.documentoParaEditar?.id],
        ([modo]) => {
            if (modo === 'nuevo') {
                nombreDocumento.value = ''
                etiquetaSeleccionada.value = ''
                return
            }

            nombreDocumento.value = String(props.documentoParaEditar?.nombre ?? '')
            etiquetaSeleccionada.value = String(
                props.documentoParaEditar?.idEtiqueta ?? props.documentoParaEditar?.id_etiqueta ?? ''
            ).trim()
        },
        { immediate: true }
    )

    onMounted(async () => {
        try {
            const datos = await getTable('etiquetas')
            etiquetas.value = datos
                .map((item, index) => buildEntity(item, { id: ['id'], nombre: ['nombre'] }, index))
                .filter((item) => item.nombre)
        } catch (error) {
            console.error('Error al cargar las etiquetas de documentos:', error)
        }
    })

    const contenidoActual = computed(() => {
        if (props.modelValue !== undefined && props.modelValue !== null) {
            return props.modelValue
        }

        return props.documentoParaEditar?.contenidoMarkdown || ''
    })

    const actualizarContenido = (event) => {
        emit('update:modelValue', event.target.value)
    }

    const guardarDocumento = async () => {
        const esNuevo = props.modo === 'nuevo'
        const idExistente = props.documentoParaEditar?.id
        if (!esNuevo && !idExistente) return

        guardando.value = true
        mensaje.value = ''
        error.value = false

        const id = idExistente || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
        const nombre = nombreDocumento.value.trim()
        const contenidoMarkdown = contenidoActual.value
        const tipo = props.documentoParaEditar?.tipo || 'markdown'

        try {
            const fila = {
                id,
                nombre,
                tipo,
                contenido_markdown: contenidoMarkdown,
                id_etiqueta: etiquetaSeleccionada.value
            }

            if (esNuevo) {
                await saveRow('documentos', fila)
            } else {
                await updateRow('documentos', fila)
            }

            emit('documento-guardado', {
                ...props.documentoParaEditar,
                id,
                nombre,
                tipo,
                contenidoMarkdown,
                idEtiqueta: etiquetaSeleccionada.value
            }, props.modo)
            await nextTick()
            mensaje.value = esNuevo ? 'Documento guardado correctamente.' : 'Documento actualizado correctamente.'
        } catch (saveError) {
            console.error('Error al guardar el documento:', saveError)
            error.value = true
            mensaje.value = 'No se pudo guardar el documento. Comprueba la conexión con Google Sheets.'
        } finally {
            guardando.value = false
        }
    }

    const insertarTextoEnEditor = (texto) => {
        const textarea = textareaRef.value
        const valorActual = contenidoActual.value || ''

        if (!textarea) {
            emit('update:modelValue', valorActual + texto)
            return
        }

        const inicio = textarea.selectionStart ?? valorActual.length
        const fin = textarea.selectionEnd ?? valorActual.length
        const nuevoValor = valorActual.slice(0, inicio) + texto + valorActual.slice(fin)

        emit('update:modelValue', nuevoValor)

        nextTick(() => {
            textarea.focus()
            const nuevaPosicion = inicio + texto.length
            textarea.selectionStart = nuevaPosicion
            textarea.selectionEnd = nuevaPosicion
        })
    }
</script>

<template>
    <div id="seccion_editar">
        <TituloSeccion :icono="Pencil" :titulo="modo === 'nuevo' ? 'Nuevo documento' : 'Editar el documento'" />
        <form v-if="modo === 'nuevo' || documentoParaEditar?.id" @submit.prevent="guardarDocumento">
            <InputRegular
                label="Nombre del documento"
                type="text"
                placeholder=""
                required
                v-model="nombreDocumento"
            />
            <p>Etiqueta</p>
            <Selector v-model="etiquetaSeleccionada">
                <option value="">Selecciona una etiqueta</option>
                <option v-for="etiqueta in etiquetas" :key="etiqueta.id" :value="etiqueta.id">
                    {{ etiqueta.nombre }}
                </option>
            </Selector>
            <p>Contenido</p>
            <HerramientasEdicion @insertar-texto="insertarTextoEnEditor" />
            <textarea
                ref="textareaRef"
                spellcheck="false"
                name="contenido"
                :value="contenidoActual"
                @input="actualizarContenido"
            ></textarea>
            <BtnPrincipal :texto="guardando ? 'Guardando...' : 'Guardar'" :disabled="guardando" />
            <p v-if="mensaje" :class="{ error }" role="status">{{ mensaje }}</p>
        </form>
        <p v-else>Selecciona un documento para editarlo.</p>
    </div>
</template>

<style scoped>
    h2, p, textarea {
        color: var(--negro);
    }
    #seccion_editar {
        padding: 2em 0;
        textarea {
            field-sizing: content;
            width: 100%;
            min-height: 300px;
            padding: 1em;
            font-family: inherit;
            font-size: 1em;
            resize: none;
            box-sizing: border-box;
            border: none;
            border-radius: 0 0 10px 10px;
            background-color: var(--blanco);
            transition: border-left 0.01s, border-radius 0.3s;
            &:focus {
                outline: none;
                border-left: 5px solid var(--azul);
                border-radius: 0 0 10px 0;
            }
        }
    }

    .error {
        color: #a12622;
    }
</style>