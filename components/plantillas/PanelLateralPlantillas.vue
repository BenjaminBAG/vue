<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/BtnCircularSelector.vue'
    import BtnCircularEditar from '../botones/BtnCircularEditar.vue'
    import BtnCircularLlenar from '../botones/BtnCircularLlenar.vue'
    import BtnCircularNuevo from '../botones/BtnCircularNuevo.vue'
    import BtnCircularBorrar from '../botones/BtnCircularBorrar.vue'
    import BtnCircularExternalLink from '../botones/BtnCircularLink.vue'
    import BtnCopiar from '../botones/BtnCopiar.vue'
    import SeccionSelector from './SeccionSelector.vue'
    import SeccionEditar from './SeccionEditar.vue'
    import SeccionLlenar from './SeccionLlenar.vue'
    import SeccionNuevo from './SeccionNuevo.vue'
    import AreaDesplazamiento from '../otros/AreaDesplazamiento.vue'
    import { useSheets } from '../../composables/useSheets.ts'
    import { getGoogleDocUrl } from '../../utils/googleDrive'

    const emit = defineEmits(['documento-seleccionado', 'vista-cambiada', 'contenido-editor-cambiado'])

    const vistaActiva = ref('selector')
    const contenidoEditor = ref('')
    const selectorVersion = ref(0)
    const borrando = ref(false)
    const { deleteRow } = useSheets()

    const actualizarListaPlantillas = () => {
        selectorVersion.value += 1
    }

    const actualizarPlantillaSeleccionada = (plantilla) => {
        documentoSeleccionado.value = plantilla
        contenidoEditor.value = plantilla?.idDriveDocumento || ''
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

    const borrarPlantillaSeleccionada = async () => {
        const plantilla = documentoSeleccionado.value
        if (!plantilla?.id || borrando.value) return

        if (!window.confirm(`¿Borrar la plantilla "${plantilla.nombre}"?`)) return

        borrando.value = true
        try {
            await deleteRow('plantillas', plantilla.id)
            documentoSeleccionado.value = null
            contenidoEditor.value = ''
            selectorVersion.value += 1
            emit('documento-seleccionado', null)
            emit('contenido-editor-cambiado', '')
        } catch (error) {
            console.error('Error al borrar la plantilla:', error)
            window.alert('No se pudo borrar la plantilla. Comprueba la conexión con Google Sheets.')
        } finally {
            borrando.value = false
        }
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
            <BtnCircularNuevo  :activo="vistaActiva === 'nuevo'"  @click="cambiarVista('nuevo')" />
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularEditar
                    v-if="documentoSeleccionado?.id"
                    :activo="vistaActiva === 'editar'"
                    @click="cambiarVista('editar')"
                />
            </Transition>
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularLlenar
                    v-if="documentoSeleccionado?.id"
                    :activo="vistaActiva === 'llenar'"
                    @click="cambiarVista('llenar')"
                />
            </Transition>
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularBorrar
                    v-if="documentoSeleccionado?.id"
                    :deshabilitado="borrando"
                    @borrar="borrarPlantillaSeleccionada"
                />
            </Transition>
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularExternalLink
                    v-if="documentoSeleccionado?.idDriveDocumento || documentoSeleccionado?.urlDocumento"
                    :ruta="getGoogleDocUrl(documentoSeleccionado.idDriveDocumento || documentoSeleccionado.urlDocumento)"
                />
            </Transition>
            <Transition name="boton-disponible" mode="out-in">
                <BtnCopiar
                    v-if="documentoSeleccionado?.idDriveDocumento || documentoSeleccionado?.urlDocumento"
                    :ruta="getGoogleDocUrl(documentoSeleccionado.idDriveDocumento || documentoSeleccionado.urlDocumento)"
                />
            </Transition>
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
        .boton-disponible-enter-active,
        .boton-disponible-leave-active {
            transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .boton-disponible-enter-from,
        .boton-disponible-leave-to {
            opacity: 0;
            transform: scale(0.75);
        }
        .boton-disponible-enter-to,
        .boton-disponible-leave-from {
            opacity: 1;
            transform: scale(1);
        }
        .contenedor_secciones {
            flex: 1 1 auto;
            min-height: 0;
        }
    }
</style>