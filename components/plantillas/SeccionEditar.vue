<script setup>
    import { onMounted, ref, watch } from 'vue'
    import { Pencil } from 'lucide-vue-next'
    import FormularioDinamico from '../otros/FormularioDinamico.vue'
    import BtnPrincipal from '../botones/BtnPrincipal.vue'
    import TituloSeccion from '../otros/TituloSeccion.vue'
    import { useSheets } from '../../composables/useSheets.ts'
    import { buildEntity } from '../../composables/useSheetData.ts'

    const props = defineProps({
        documentoParaEditar: {
            type: Object,
            default: () => ({})
        }
    })

    const emit = defineEmits(['plantilla-actualizada'])
    const { getTable, updateRow } = useSheets()
    const etiquetas = ref([])
    const datos = ref({})
    const guardando = ref(false)
    const mensaje = ref('')
    const error = ref(false)
    const campos = ref([
        { id: 'nombre', nombre: 'Nombre de la plantilla', tipo: 'text', requerido: true },
        { id: 'tipo', nombre: 'Tipo', tipo: 'text', placeholder: 'Ej. contrato, informe' },
        { id: 'urlDocumento', nombre: 'URL del documento', tipo: 'url', requerido: true },
        { id: 'idEtiqueta', nombre: 'Etiqueta', tipo: 'select', opciones: [] }
    ])

    watch(
        () => props.documentoParaEditar,
        (plantilla) => {
            datos.value = {
                nombre: plantilla?.nombre ?? '',
                tipo: plantilla?.tipo ?? '',
                urlDocumento: plantilla?.urlDocumento ?? plantilla?.url_documento ?? '',
                idEtiqueta: String(plantilla?.idEtiqueta ?? plantilla?.id_etiqueta ?? '')
            }
            mensaje.value = ''
            error.value = false
        },
        { immediate: true, deep: true }
    )

    onMounted(async () => {
        try {
            const filas = await getTable('etiquetas')
            etiquetas.value = filas
                .map((item, index) => buildEntity(item, { id: ['id'], nombre: ['nombre'] }, index))
                .filter((item) => item.nombre)
            campos.value[3].opciones = etiquetas.value.map((item) => ({ value: item.id, label: item.nombre }))
        } catch (loadError) {
            console.error('Error al cargar las etiquetas para editar la plantilla:', loadError)
        }
    })

    const guardarCambios = async () => {
        const id = props.documentoParaEditar?.id
        if (!id) return

        guardando.value = true
        mensaje.value = ''
        error.value = false

        try {
            await updateRow('plantillas', {
                id,
                nombre: datos.value.nombre,
                tipo: datos.value.tipo,
                url_documento: datos.value.urlDocumento,
                id_etiqueta: datos.value.idEtiqueta
            })

            const plantillaActualizada = {
                ...props.documentoParaEditar,
                nombre: datos.value.nombre,
                tipo: datos.value.tipo,
                urlDocumento: datos.value.urlDocumento,
                idEtiqueta: datos.value.idEtiqueta
            }
            emit('plantilla-actualizada', plantillaActualizada)
            mensaje.value = 'Plantilla actualizada correctamente.'
        } catch (saveError) {
            console.error('Error al actualizar la plantilla:', saveError)
            error.value = true
            mensaje.value = 'No se pudo actualizar la plantilla.'
        } finally {
            guardando.value = false
        }
    }
</script>

<template>
    <section class="seccion-editar">
        <TituloSeccion :icono="Pencil" titulo="Editar plantilla" />
        <form v-if="documentoParaEditar?.id" @submit.prevent="guardarCambios">
            <FormularioDinamico v-model="datos" :campos="campos" />
            <BtnPrincipal :texto="guardando ? 'Guardando...' : 'Guardar cambios'" />
            <p v-if="mensaje" :class="{ error }" role="status">{{ mensaje }}</p>
        </form>
        <p v-else>Selecciona una plantilla para editar sus datos.</p>
    </section>
</template>

<style scoped>
    .seccion-editar {
        padding: 2em 0;
    }

    .seccion-editar form {
        display: grid;
        gap: 1em;
    }

    .error {
        color: #a12622;
    }
</style>
