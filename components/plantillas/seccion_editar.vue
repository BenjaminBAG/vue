<script setup>
    import { onMounted, ref, watch } from 'vue'
    import { Pencil } from 'lucide-vue-next'
    import InputRegular from '../otros/InputRegular.vue'
    import BtnPrincipal from '../botones/btn-principal.vue'
    import Selector from '../otros/Selector.vue'
    import { useSheets } from '../../composables/useSheets'
    import { buildEntity } from '../../composables/useSheetData'
    import TituloSeccion from '../otros/TituloSeccion.vue'

    const props = defineProps({
        documentoParaEditar: {
            type: Object,
            default: () => ({})
        }
    })

    const { getTable } = useSheets()
    const etiquetas = ref([])
    const etiquetaSeleccionada = ref('')

    watch(
        () => props.documentoParaEditar?.idEtiqueta,
        (idEtiqueta) => {
            etiquetaSeleccionada.value = String(idEtiqueta ?? '').trim()
        },
        { immediate: true }
    )

    onMounted(async () => {
        try {
            const datos = await getTable('etiquetas')
            etiquetas.value = datos
            .map((item, index) => buildEntity(item, { id: ['id'], nombre: ['nombre'] }, index))
            .filter((item) => item.nombre)
        } catch (error) {
            console.error('Error al cargar las etiquetas de plantillas:', error)
        }
    })

    const claves = [
        {id: '1', nombre: 'clave 1', tipo: 'url', placeholder: 'ejemplo', requerido: true, valor_predeterminado: ''},
        {id: '2', nombre: 'clave 2', tipo: 'date', placeholder: '2026-01-01', requerido: false, valor_predeterminado: ''},
        {id: '3', nombre: 'clave 3', tipo: 'number', placeholder: 'ejemplo', requerido: false, valor_predeterminado: ''}
    ]
</script>

<template>
    <div id="seccion_editar">
        <TituloSeccion :icono="Pencil" titulo="Llenar la Plantilla"/>
        
        <form @submit.prevent>
        <div v-for="item in claves" :key="item.id">
            <div :class="item.tipo">
            <InputRegular
                :label="item.nombre"
                :type="item.tipo"
                :placeholder="item.placeholder"
                :value="item.valor_predeterminado"
            />
            </div>
        </div>

        <label>Etiqueta</label>
        <Selector v-model="etiquetaSeleccionada">
            <option value="">Selecciona una etiqueta</option>
            <option v-for="etiqueta in etiquetas" :key="etiqueta.id" :value="etiqueta.id">
            {{ etiqueta.nombre }}
            </option>
        </Selector>
        
        <BtnPrincipal texto="Guardar"/>
        </form>
    </div>
</template>
