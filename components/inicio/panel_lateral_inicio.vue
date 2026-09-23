<template>
    <div id="panel_lateral_inicio">
        <header id="botones_seleccion">
            <!-- Pasamos true o false si la vista coincide -->
            <BtnCircularSelector 
                :activo="vistaActiva === 'selector'" 
                @click="cambiarVista('selector')"
            />
            <BtnCircularLista 
                :activo="vistaActiva === 'indice'" 
                @click="cambiarVista('indice')"
            />
            <BtnCircularFiltrar 
                :activo="vistaActiva === 'filtro'" 
                @click="cambiarVista('filtro')"
            />
            <BtnCircularEditar 
                :activo="vistaActiva === 'editar'" 
                @click="cambiarVista('editar')"
            />
            <BtnCircularNuevo 
                :activo="vistaActiva === 'nuevo'" 
                @click="cambiarVista('nuevo')"
            />
        </header>
        <div id="contenedor_secciones">
            <KeepAlive>
                <SeccionLista v-if="vistaActiva === 'selector'" @documento-seleccionado="emitirDocumentoSeleccionado" />
                <SeccionIndice v-else-if="vistaActiva === 'indice'" :titulos="titulos" />
                <SeccionFiltro v-else-if="vistaActiva === 'filtro'" />
                <SeccionEditar
                    v-else-if="vistaActiva === 'editar'"
                    :documento-para-editar="documentoSeleccionado"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                />
                <SeccionEditar
                    v-else-if="vistaActiva === 'nuevo'"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                />
            </KeepAlive>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/btn-circular-selector.vue'
    import BtnCircularLista from '../botones/btn-circular-indice.vue'
    import BtnCircularFiltrar from '../botones/btn-circular-filtrar.vue'
    import BtnCircularEditar from '../botones/btn-circular-editar.vue'
    import BtnCircularNuevo from '../botones/btn-circular-nuevo.vue'
    import SeccionLista from './seccion_selector.vue'
    import SeccionIndice from './seccion_indice.vue'
    import SeccionFiltro from './seccion_filtro.vue'
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
    #panel_lateral_inicio {
        padding: 1em 2em;
    }
    @media (max-width: 768px) {
        #panel_lateral_inicio {
            display: none;
        }
    }
    #panel_lateral_inicio #botones_seleccion {
        padding: 1em;
        display: flex;
        gap: 0.5em;
        position: sticky;
        top: 2em;
        background-color: inherit;
        flex-wrap: wrap;
    }
    #botones_seleccion > * {
        flex-shrink: 0;
    }

    #panel_lateral_inicio #contenedor_secciones {
        position: sticky;
        top: 10em;
        max-height: calc(100vh - 12em); 
        overflow-y: auto; 
    }
</style>

