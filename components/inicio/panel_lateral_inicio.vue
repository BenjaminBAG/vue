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
            <BtnCircularEditar 
                :activo="vistaActiva === 'editar'" 
                @click="cambiarVista('editar')"
            />
            <BtnCircularNuevo 
                :activo="vistaActiva === 'nuevo'" 
                @click="cambiarVista('nuevo')"
            />
        </header>
        <KeepAlive>
            <AreaDesplazamiento
                v-if="vistaActiva === 'selector'"
                id="contenedor_secciones"
                key="selector"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionSelector @documento-seleccionado="emitirDocumentoSeleccionado" />
            </AreaDesplazamiento>
            <AreaDesplazamiento
                v-else-if="vistaActiva === 'indice'"
                id="contenedor_secciones"
                key="indice"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionIndice :titulos="titulos" />
            </AreaDesplazamiento>
            <AreaDesplazamiento
                v-else-if="vistaActiva === 'editar'"
                id="contenedor_secciones"
                key="editar"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionEditar
                    :documento-para-editar="documentoSeleccionado"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                />
            </AreaDesplazamiento>
            <AreaDesplazamiento
                v-else-if="vistaActiva === 'nuevo'"
                id="contenedor_secciones"
                key="nuevo"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionEditar
                    :documento-para-editar="documentoSeleccionado || { nombre: '', contenidoMarkdown: '' }"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                />
            </AreaDesplazamiento>
        </KeepAlive>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/btn-circular-selector.vue'
    import BtnCircularLista from '../botones/btn-circular-indice.vue'
    import BtnCircularEditar from '../botones/btn-circular-editar.vue'
    import BtnCircularNuevo from '../botones/btn-circular-nuevo.vue'
    import SeccionSelector from './seccion_selector.vue'
    import SeccionIndice from './seccion_indice.vue'
    import SeccionEditar from './seccion_editar.vue'
    import AreaDesplazamiento from '../otros/area_desplazamiento.vue'

    const emit = defineEmits(['documento-seleccionado', 'vista-cambiada', 'contenido-editor-cambiado'])

    const vistaActiva = ref('selector')
    const contenidoEditor = ref('')

    const cambiarVista = (nuevaVista) => {
        vistaActiva.value = nuevaVista

        if (nuevaVista === 'nuevo') {
            documentoSeleccionado.value = null
            contenidoEditor.value = ''
        }

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
        display: flex;
        flex-direction: column;
        min-height: 0;
        box-sizing: border-box;
    }
    #panel_lateral_inicio #botones_seleccion {
        padding: 1em;
        display: flex;
        gap: 0.5em;
        flex-shrink: 0;
        background-color: inherit;
        flex-wrap: wrap;
    }
    #botones_seleccion > * {
        flex-shrink: 0;
    }

    #panel_lateral_inicio #contenedor_secciones {
        flex: 1 1 auto;
        min-height: 0;
    }
</style>

