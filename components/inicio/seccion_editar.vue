<script setup>
    import { computed } from 'vue'
    import InputRegular from '../otros/input-regular.vue'
    import BtnPrincipal from '../botones/btn-principal.vue'
    import { Pencil } from 'lucide-vue-next'

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

    const contenidoActual = computed(() => {
        if (props.modelValue !== undefined && props.modelValue !== null) {
            return props.modelValue
        }

        return props.documentoParaEditar?.contenidoMarkdown || ''
    })

    const actualizarContenido = (event) => {
        emit('update:modelValue', event.target.value)
    }
</script>

<template>
    <div id="seccion_editar">
        <div class="titulo_h2">
            <Pencil class="icono"/>
            <h2>Editor de documentos</h2>
        </div>
        <form>
            <p><strong>Nombre del documento</strong></p>
            <InputRegular 
                type="text"
                placeholder=""
                required
                :value="documentoParaEditar.nombre"
            />
            <p><strong>Contenido</strong></p>
            <textarea
                spellcheck="false"
                name="contenido"
                :value="contenidoActual"
                @input="actualizarContenido"
            ></textarea>
            <BtnPrincipal texto="Guardar" />
        </form>
    </div>
</template>

<style>
    #seccion_editar {
        padding: 1em;
    }
    #seccion_editar .titulo_h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
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
        font-size: 16px;
        resize: none;
        box-sizing: border-box;
        border-radius: 0;
        scrollbar-width: none;
        border: 1px solid var(--beige);
        transition: background-color 0.3s;
    }
    #seccion_editar textarea:focus {
        outline: none;
        background-color: var(--negro);
        color: var(--blanco);
    }
    
</style>