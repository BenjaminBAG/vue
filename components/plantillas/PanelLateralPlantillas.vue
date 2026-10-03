<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/BtnCircularSelector.vue'
    import BtnCircularEditar from '../botones/BtnCircularEditar.vue'
    import BtnCircularLlenar from '../botones/BtnCircularLlenar.vue'
    import BtnCircularNuevo from '../botones/BtnCircularNuevo.vue'
    import BtnCircularExternalLink from '../botones/BtnCircularLink.vue'
    import BtnCopiar from '../botones/BtnCopiar.vue'
    import SeccionSelector from './SeccionSelector.vue'
    import SeccionEditar from './SeccionEditar.vue'
    import SeccionLlenar from './SeccionLlenar.vue'
    import SeccionNuevo from './SeccionNuevo.vue'
    import AreaDesplazamiento from '../otros/AreaDesplazamiento.vue'

    const emit = defineEmits(['documento-seleccionado', 'vista-cambiada', 'contenido-editor-cambiado'])

    const vistaActiva = ref('selector')
    const contenidoEditor = ref('')
    const selectorVersion = ref(0)

    const actualizarListaPlantillas = () => {
        selectorVersion.value += 1
    }

    const actualizarPlantillaSeleccionada = (plantilla) => {
        documentoSeleccionado.value = plantilla
        contenidoEditor.value = plantilla?.urlDocumento || ''
        selectorVersion.value += 1
        emit('documento-seleccionado', plantilla)
    }

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

<template>
    <div id="panel_lateral_plantillas">
        <header class="botones_seleccion">
            <!-- Pasamos true o false si la vista coincide -->
            <BtnCircularSelector :activo="vistaActiva === 'selector'" @click="cambiarVista('selector')" />
            <BtnCircularEditar :activo="vistaActiva === 'editar'" @click="cambiarVista('editar')" />
            <BtnCircularLlenar :activo="vistaActiva === 'llenar'" @click="cambiarVista('llenar')" />
            <BtnCircularNuevo  :activo="vistaActiva === 'nuevo'"  @click="cambiarVista('nuevo')" />
            <BtnCircularExternalLink :ruta="documentoSeleccionado?.urlDocumento || ''" />
            <BtnCopiar :ruta="documentoSeleccionado?.urlDocumento || ''" />
        </header>
        <KeepAlive>
            <AreaDesplazamiento v-if="vistaActiva === 'selector'"
                class="contenedor_secciones"
                :key="`selector-${selectorVersion}`"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionSelector @documento-seleccionado="emitirDocumentoSeleccionado" />
            </AreaDesplazamiento>
            <AreaDesplazamiento v-else-if="vistaActiva === 'editar'"
                class="contenedor_secciones"
                key="editar"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionEditar
                    :documento-para-editar="documentoSeleccionado"
                    @plantilla-actualizada="actualizarPlantillaSeleccionada"
                />
            </AreaDesplazamiento>
            <AreaDesplazamiento v-else-if="vistaActiva === 'llenar'"
                class="contenedor_secciones"
                key="llenar"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionLlenar
                    :documento-para-editar="documentoSeleccionado"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                />
            </AreaDesplazamiento>
            <AreaDesplazamiento v-else-if="vistaActiva === 'nuevo'"
                class="contenedor_secciones"
                key="nuevo"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionNuevo
                    @plantilla-guardada="actualizarListaPlantillas"
                    @url-documento-cambiada="actualizarContenidoEditor"
                />
            </AreaDesplazamiento>
        </KeepAlive>
    </div>
</template>

<style scoped>
    #panel_lateral_plantillas {
        padding: 1em 2em;
        display: flex;
        flex-direction: column;
        min-height: 0;
        box-sizing: border-box;
        .botones_seleccion {
            padding: 1em;
            display: flex;
            gap: 0.5em;
            flex-shrink: 0;
            background-color: inherit;
            flex-wrap: wrap;
            & > * {
                flex-shrink: 0;
            }
        }
        .contenedor_secciones {
            flex: 1 1 auto;
            min-height: 0;
        }
    }
</style>