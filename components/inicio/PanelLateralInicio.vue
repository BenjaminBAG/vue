<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/BtnCircularSelector.vue'
    import BtnCircularLista from '../botones/BtnCircularIndice.vue'
    import BtnCircularEditar from '../botones/BtnCircularEditar.vue'
    import BtnCircularNuevo from '../botones/BtnCircularNuevo.vue'
    import BtnCircularBorrar from '../botones/BtnCircularBorrar.vue'
    import SeccionSelector from './SeccionSelector.vue'
    import SeccionIndice from './SeccionIndice.vue'
    import SeccionEditar from './SeccionEditar.vue'
    import AreaDesplazamiento from '../otros/AreaDesplazamiento.vue'
    import { useSheets } from '../../composables/useSheets.ts'

    const emit = defineEmits(['documento-seleccionado', 'vista-cambiada', 'contenido-editor-cambiado'])

    const vistaActiva = ref('selector')
    const contenidoEditor = ref('')
    const selectorVersion = ref(0)
    const borrando = ref(false)
    const indiceDisponible = ref(false)
    const selectorRef = ref(null)
    const { deleteRow } = useSheets()

    const cambiarVista = (nuevaVista) => {
        vistaActiva.value = nuevaVista

        if (nuevaVista === 'nuevo') {
            documentoSeleccionado.value = null
            contenidoEditor.value = ''
            indiceDisponible.value = false
            emit('documento-seleccionado', null)
            emit('contenido-editor-cambiado', '')
        }

        emit('vista-cambiada', nuevaVista)
    }
    const documentoSeleccionado = ref(null)

    const actualizarContenidoEditor = (nuevoTexto) => {
        contenidoEditor.value = nuevoTexto
        indiceDisponible.value = nuevoTexto.trim().length > 0
        emit('contenido-editor-cambiado', nuevoTexto)
    }

    const actualizarDocumentoGuardado = async (documento, modo) => {
        documentoSeleccionado.value = documento
        contenidoEditor.value = documento.contenidoMarkdown || ''
        selectorVersion.value += 1
        emit('documento-seleccionado', documento)

        if (selectorRef.value) await selectorRef.value.cargarDocumentos()

        if (modo === 'nuevo') {
            vistaActiva.value = 'editar'
            emit('vista-cambiada', 'editar')
        }
    }

    const emitirDocumentoSeleccionado = (documento) => {
        if (!documento) {
            console.log('no hay doc')
            return
        }
        documentoSeleccionado.value = documento
        contenidoEditor.value = documento?.contenidoMarkdown || documento?.contenido || ''
        indiceDisponible.value = contenidoEditor.value.trim().length > 0
        emit('documento-seleccionado', documento)
    }

    const borrarDocumentoSeleccionado = async () => {
        const documento = documentoSeleccionado.value
        if (!documento?.id || borrando.value) return

        if (!window.confirm(`¿Borrar el documento "${documento.nombre}"?`)) return

        borrando.value = true
        try {
            await deleteRow('documentos', documento.id)
            documentoSeleccionado.value = null
            contenidoEditor.value = ''
            selectorVersion.value += 1
            if (selectorRef.value) await selectorRef.value.cargarDocumentos()
            emit('documento-seleccionado', null)
            emit('contenido-editor-cambiado', '')
        } catch (error) {
            console.error('Error al borrar el documento:', error)
            window.alert('No se pudo borrar el documento. Comprueba la conexión con Google Sheets.')
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
    <div id="panel_lateral_inicio">
        <header id="botones_seleccion">
            <BtnCircularSelector :activo="vistaActiva === 'selector'" @click="cambiarVista('selector')" />
            <BtnCircularNuevo :activo="vistaActiva === 'nuevo'" @click="cambiarVista('nuevo')" />
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularLista
                    v-if="indiceDisponible"
                    :activo="vistaActiva === 'indice'"
                    @click="cambiarVista('indice')"
                />
            </Transition>
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularEditar
                    v-if="documentoSeleccionado?.id"
                    :activo="vistaActiva === 'editar'"
                    @click="cambiarVista('editar')"
                />
            </Transition>
            <Transition name="boton-disponible" mode="out-in">
                <BtnCircularBorrar
                    v-if="documentoSeleccionado?.id"
                    :deshabilitado="borrando"
                    @borrar="borrarDocumentoSeleccionado"
                />
            </Transition>
        </header>
        <KeepAlive>
            <AreaDesplazamiento v-if="vistaActiva === 'selector'"
                id="contenedor_secciones"
                :key="`selector-${selectorVersion}`"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionSelector
                    ref="selectorRef"
                    @documento-seleccionado="emitirDocumentoSeleccionado"
                />
            </AreaDesplazamiento>
            <AreaDesplazamiento v-else-if="vistaActiva === 'indice'"
                id="contenedor_secciones"
                key="indice"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionIndice
                    :key="`${documentoSeleccionado?.id ?? 'nuevo'}-${vistaActiva}`"
                    :titulos="titulos"
                />
            </AreaDesplazamiento>
            <AreaDesplazamiento v-else-if="vistaActiva === 'editar'"
                id="contenedor_secciones"
                key="editar"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionEditar
                    :documento-para-editar="documentoSeleccionado"
                    modo="editar"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                    @documento-guardado="actualizarDocumentoGuardado($event, 'editar')"
                />
            </AreaDesplazamiento>
            <AreaDesplazamiento v-else-if="vistaActiva === 'nuevo'"
                id="contenedor_secciones"
                key="nuevo"
                :altura-max="'calc(100vh - 12em)'"
            >
                <SeccionEditar
                    :documento-para-editar="documentoSeleccionado || { nombre: '', contenidoMarkdown: '' }"
                    modo="nuevo"
                    :model-value="contenidoEditor"
                    @update:modelValue="actualizarContenidoEditor"
                    @documento-guardado="actualizarDocumentoGuardado($event, 'nuevo')"
                />
            </AreaDesplazamiento>
        </KeepAlive>
    </div>
</template>

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
    #panel_lateral_inicio #contenedor_secciones {
        flex: 1 1 auto;
        min-height: 0;
    }
</style>