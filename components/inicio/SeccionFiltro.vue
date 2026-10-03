<script setup>
    import { onMounted } from 'vue'
    import { Tag, Type } from 'lucide-vue-next'
    import { useSheetFilterOptions } from '../../composables/useSheetFilterOptions'
    import BotonLimpiarFiltro from '../botones/BtnLimpiarFiltro.vue'
    import ChipReactivo from '../otros/ChipReactivo.vue'

    const emit = defineEmits(['filtros-cambiados'])
    const {
        etiquetas,
        tipos,
        hasActiveFilters: hayFiltrosActivos,
        emitFilters: emitirFiltros,
        clearFilters: limpiarFiltros,
        load: cargarEtiquetas
    } = useSheetFilterOptions('documentos', (filtros) => emit('filtros-cambiados', filtros))

    onMounted(cargarEtiquetas)
</script>

<template>
    <div id="seccion_filtro">
        <ul class="lista-en-linea">
            <ChipReactivo v-for="item in etiquetas" :key="item.id"
            :valor="item"
            :icono="Tag"
            @emitir-filtros="emitirFiltros"
            />
        </ul>
        <ul>
            <ChipReactivo v-for="item in tipos" :key="item.tipo"
            :valor="item"
            :icono="Type"
            @emitir-filtros="emitirFiltros"
            />
        </ul>
        <BotonLimpiarFiltro
        :disabled="!hayFiltrosActivos"
        @limpiar-filtro="limpiarFiltros"
        />
    </div>
</template>

<style scoped>
    #seccion_filtro {
        padding-right: 1em;
        min-height: 150px;
        margin-bottom: 3em;
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 1.5em;
        }
    }
</style>