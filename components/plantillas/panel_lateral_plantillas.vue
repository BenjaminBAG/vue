<template>
    <div id="panel_lateral_plantillas">
        <header id="botones_seleccion">
            <!-- Pasamos true o false si la vista coincide -->
            <BtnCircularSelector 
                :activo="vistaActiva === 'selector'" 
                @click="cambiarVista('selector')"
            />
            <BtnCircularEditar 
                :activo="vistaActiva === 'editar'" 
                @click="cambiarVista('editar')"
            />
            <BtnCircularNuevo 
                :activo="vistaActiva === 'nuevo'" 
                @click="cambiarVista('nuevo')"
            />
            <BtnCircularExternalLink 
                :ruta="documentoSeleccionado?.urlDocumento || ''"
            />
        </header>
        <div id="contenedor_secciones">
            <KeepAlive>
                <SeccionLista
                    v-if="vistaActiva === 'selector'"
                    @documento-seleccionado="emitirDocumentoSeleccionado"
                />
                <SeccionEditar
                    v-else-if="vistaActiva === 'editar'"
                    :documento-para-editar="documentoSeleccionado"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                />
                <SeccionEditar
                    v-else-if="vistaActiva === 'nuevo'"
                    :model-value="null"
                    @update:modelValue="actualizarContenidoEditor"
                />
            </KeepAlive>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/btn-circular-selector.vue'
    import BtnCircularEditar from '../botones/btn-circular-editar.vue'
    import BtnCircularNuevo from '../botones/btn-circular-nuevo.vue'
    import BtnCircularExternalLink from '../botones/btn-circular-external_link.vue'
    import SeccionLista from './seccion_selector.vue'
    import SeccionEditar from './seccion_editar.vue'

    const emit = defineEmits(['documento-seleccionado', 'vista-cambiada', 'contenido-editor-cambiado'])

    const vistaActiva = ref('selector')
    const contenidoEditor = ref('')

    const cambiarVista = (nuevaVista) => {
        vistaActiva.value = nuevaVista
        emit('vista-cambiada', nuevaVista)
    }

    const documentoSeleccionado = ref(null)

    const actualizarContenidoEditor = (nuevoTexto) => {
        contenidoEditor.value = nuevoTexto
        emit('contenido-editor-cambiado', nuevoTexto)
    }

    const emitirDocumentoSeleccionado = (documento) => {
        if (!documento) {
            console.log('no hay doc')
            return
        }
        documentoSeleccionado.value = documento
        contenidoEditor.value = documento?.contenidoMarkdown || documento?.contenido || ''
        emit('documento-seleccionado', documento)
    }

    defineProps({
        titulos: {
            type: Array,
            default: () => []
        }
    })
</script>


<style scoped>
    #panel_lateral_plantillas {
        padding: 1em 2em;
    }
    @media (max-width: 768px) {
        #panel_lateral_plantillas {
            display: none;
        }
    }
    #panel_lateral_plantillas #botones_seleccion {
        padding: 1em;
        display: flex;
        gap: 0.5em;
        position: sticky;
        top: 2em;
        background-color: inherit;
        flex-wrap: wrap;
    }
    #panel_lateral_plantillas #botones_seleccion > * {
        flex-shrink: 0;
    }

    #panel_lateral_plantillas #contenedor_secciones {
        position: sticky;
        top: 10em;
        max-height: calc(100vh - 12em); 
        overflow-y: auto; 
    }
</style>

