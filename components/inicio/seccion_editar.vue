<script setup>
    import AreaDesplazamiento from '../otros/area_desplazamiento.vue'
    import { computed, nextTick, ref } from 'vue'
    import InputRegular from '../otros/input-regular.vue'
    import BtnPrincipal from '../botones/btn-principal.vue'
    import { Pencil } from 'lucide-vue-next'
    import BarraHerramientasEdicion from '../otros/barra_herramientas_edicion.vue'

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
        <div class="titulo_h2">
            <Pencil class="icono"/>
            <h2>Editor de documentos</h2>
        </div>
        <form>
            <AreaDesplazamiento :altura-max="'calc(100vh - 30em)'">
                <p><strong>Nombre del documento</strong></p>
                <InputRegular 
                    type="text"
                    placeholder=""
                    required
                    :value="documentoParaEditar.nombre"
                />
                <p><strong>Contenido</strong></p>
                <BarraHerramientasEdicion @insertar-texto="insertarTextoEnEditor" />
                <textarea
                    ref="textareaRef"
                    spellcheck="false"
                    name="contenido"
                    :value="contenidoActual"
                    @input="actualizarContenido"
                ></textarea>
            </AreaDesplazamiento>
            <BtnPrincipal texto="Guardar" />
        </form>
    </div>
</template>

<style>
    h2, p, svg, textarea {
        color: var(--negro);
    }
    #seccion_editar {
        padding: 2em 0;
    }
    #seccion_editar .titulo_h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 2em;
    }
    #seccion_editar .titulo_h2 .icono {
        width: 2em;
        height: 2em;
        flex-shrink: 0;
        stroke-width: 0.2em;
    }
    #seccion_editar textarea {
        field-sizing: content;
        width: 100%;
        min-height: 300px;
        max-height: 600px;
        padding: 12px;
        font-family: inherit;
        font-size: 1em;
        resize: none;
        box-sizing: border-box;
        border-radius: 0;
        scrollbar-width: none;
        border: none;
        border-radius: 0 0 10px 10px;
        background-color: var(--blanco);
        transition: border-left 0.01s, border-radius 0.3s;
    }
    #seccion_editar textarea:focus {
        outline: none;
        border-left: 5px solid var(--azul);
        border-radius: 0 0 10px 0;
    }
</style>