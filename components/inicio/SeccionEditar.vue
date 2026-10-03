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
        }
    })

    const emit = defineEmits(['update:modelValue'])
    const textareaRef = ref(null)
    const etiquetas = ref([])
    const etiquetaSeleccionada = ref('')

    const { getTable } = useSheets()

    watch(
        () => props.documentoParaEditar?.idEtiqueta,
        (idEtiqueta) => { etiquetaSeleccionada.value = String(idEtiqueta ?? '').trim() },
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
        <TituloSeccion :icono=Pencil titulo="Editar el documento"/>
        <form>
            <InputRegular
                label="Nombre del documento"
                type="text"
                placeholder=""
                required
                :value="documentoParaEditar.nombre"
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
            <BtnPrincipal texto="Guardar" />
        </form>
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
</style>