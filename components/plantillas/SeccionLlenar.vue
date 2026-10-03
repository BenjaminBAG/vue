<script setup>
    import { ref, watch } from 'vue'
    import { Pencil } from 'lucide-vue-next'
    import FormularioDinamico from '../otros/FormularioDinamico.vue'
    import BtnPrincipal from '../botones/BtnPrincipal.vue'
    import { useSheets } from '../../composables/useSheets.ts'
    import { buildEntity } from '../../composables/useSheetData.ts'
    import TituloSeccion from '../otros/TituloSeccion.vue'

    const props = defineProps({
        documentoParaEditar: {
            type: Object,
            default: () => ({})
        }
    })

    const { getTable } = useSheets()
    const claves = ref([])
    const valores = ref({})

    watch(
        () => props.documentoParaEditar?.id,
        async (idPlantilla) => {
            claves.value = []
            valores.value = {}
            if (!idPlantilla) return

            try {
                const filas = await getTable('claves_plantillas')
                claves.value = filas
                    .map((item, index) => buildEntity(item, {
                        id: ['id'],
                        nombre: ['nombre'],
                        tipo: ['tipo'],
                        placeholder: ['placeholder'],
                        esTabla: ['es_tabla', 'esTabla'],
                        nombreTabla: ['nombre_tabla', 'nombreTabla', 'nombre tabla'],
                        idPlantilla: ['id_plantilla', 'idPlantilla']
                    }, index))
                    .filter((item) => String(item.idPlantilla).trim() === String(idPlantilla).trim() && item.nombre)
                    .map((item) => ({ ...item, esTabla: ['true', '1', 'si', 'sí'].includes(String(item.esTabla).trim().toLowerCase()) }))
            } catch (error) {
                console.error('Error al cargar las claves de la plantilla:', error)
            }
        },
        { immediate: true }
    )

</script>

<template>
    <div id="seccion_editar">
        <TituloSeccion :icono="Pencil" titulo="Llenar la Plantilla"/>
        
        <form @submit.prevent>
        <FormularioDinamico v-if="claves.length" v-model="valores" :campos="claves" />
        <p v-else>Selecciona una plantilla con claves configuradas.</p>
        <BtnPrincipal texto="Guardar"/>
        </form>
    </div>
</template>
