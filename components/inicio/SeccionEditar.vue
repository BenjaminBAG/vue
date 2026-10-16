<script setup>
    import { computed, nextTick, onMounted, ref, watch } from 'vue'
    import InputRegular from '../otros/InputRegular.vue'
    import BtnPrincipal from '../botones/BtnPrincipal.vue'
    import { Pencil } from 'lucide-vue-next'
    import HerramientasEdicion from '../otros/HerramientasEdicion.vue'
    import Selector from '../otros/selector.vue'
    import EditorMarkdown from '../otros/EditorMarkdown.vue'
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
    const editorMarkdownRef = ref(null)
    const etiquetas = ref([])
    const nombreDocumento = ref('')
    const tipoDocumento = ref('markdown')
    const estatusDocumento = ref('borrador')
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
                tipoDocumento.value = 'markdown'
                estatusDocumento.value = 'borrador'
                etiquetaSeleccionada.value = ''
                return
            }

            nombreDocumento.value = String(props.documentoParaEditar?.nombre ?? '')
            tipoDocumento.value = String(props.documentoParaEditar?.tipo ?? 'markdown')
            estatusDocumento.value = String(props.documentoParaEditar?.estatus ?? 'borrador')
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

    const actualizarContenido = (contenido) => {
        emit('update:modelValue', contenido)
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
        const tipo = tipoDocumento.value.trim()
        const estatus = estatusDocumento.value

        try {
            const fila = {
                id,
                nombre,
                tipo,
                contenido_markdown: contenidoMarkdown,
                id_etiqueta: etiquetaSeleccionada.value,
                estatus
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
                idEtiqueta: etiquetaSeleccionada.value,
                estatus
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
        const editor = editorMarkdownRef.value
        const valorActual = contenidoActual.value || ''

        if (!editor) {
            emit('update:modelValue', valorActual + texto)
            return
        }

        editor.insertarTexto(texto)
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
            <InputRegular
                label="Tipo"
                type="text"
                placeholder="Ej. markdown"
                required
                v-model="tipoDocumento"
            />
            <p>Estatus</p>
            <Selector v-model="estatusDocumento">
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
            </Selector>
            <p>Etiqueta</p>
            <Selector v-model="etiquetaSeleccionada">
                <option value="">Selecciona una etiqueta</option>
                <option v-for="etiqueta in etiquetas" :key="etiqueta.id" :value="etiqueta.id">
                    {{ etiqueta.nombre }}
                </option>
            </Selector>
            <p>Contenido</p>
            <HerramientasEdicion @insertar-texto="insertarTextoEnEditor" />
            <EditorMarkdown
                :key="`${modo}-${documentoParaEditar?.id ?? 'nuevo'}`"
                ref="editorMarkdownRef"
                :model-value="contenidoActual"
                @update:model-value="actualizarContenido"
            />
            <BtnPrincipal :texto="guardando ? 'Guardando...' : 'Guardar'" :disabled="guardando" />
            <p v-if="mensaje" :class="{ error }" role="status">{{ mensaje }}</p>
        </form>
        <p v-else>Selecciona un documento para editarlo.</p>
    </div>
</template>

<style scoped>
    h2, p {
        color: var(--negro);
    }
    #seccion_editar {
        padding: 2em 0;
    }
    .error {
        color: #a12622;
    }
</style>