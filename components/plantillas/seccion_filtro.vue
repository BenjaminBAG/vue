<template>
    <div id="seccion_filtro">

        <ul class="lista-en-linea">
            <li v-for="item in etiquetas" :key="item.id">
                <label class="item-filtro" :class="{ 'item-activo': item.seleccionado }">
                    <input type="checkbox" v-model="item.seleccionado" class="checkbox-oculto" @change="emitirFiltros">
                    <Tag class="icono_tag" />
                    <p>{{ item.nombre }}</p>
                </label>
            </li>
        </ul>

        <ul>
            <li v-for="item in tipos" :key="item.tipo">
                <label class="item-filtro" :class="{ 'item-activo': item.seleccionado }">
                    <input type="checkbox" v-model="item.seleccionado" class="checkbox-oculto" @change="emitirFiltros">
                    <Type class="icono_tag" />
                    <p>{{ item.tipo }}</p>
                </label>
            </li>
        </ul>

        <BotonLimpiarFiltro
            :disabled="!hayFiltrosActivos"
            @limpiar-filtro="limpiarFiltros"
        />
    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { Tag, Type } from 'lucide-vue-next'
    import { useSheetFilterOptions } from '../../composables/useSheetFilterOptions'
    import BotonLimpiarFiltro from '../botones/btn-limpiar_filtro.vue'

    const emit = defineEmits(['filtros-cambiados'])
    const {
        etiquetas,
        tipos,
        hasActiveFilters: hayFiltrosActivos,
        emitFilters: emitirFiltros,
        clearFilters: limpiarFiltros,
        load: cargarEtiquetas
    } = useSheetFilterOptions('plantillas', (filtros) => emit('filtros-cambiados', filtros))

    onMounted(cargarEtiquetas)
</script>

<style>
    #seccion_filtro {
        padding-right: 1em;
        min-height: 150px;
        margin-bottom: 3em;
    }
    #seccion_filtro ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1.5em;
    }

    #seccion_filtro ul li {
        display: inline-block;
        margin: 0.2em;
    }

    #seccion_filtro ul li .item-filtro {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0.5em 1.5em 0.5em 0.5em;
        height: 1.5em;
        background-color: var(--blanco);
        border: none;
        border-radius: 10px;
        color: var(--negro);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }
    #seccion_filtro ul li .item-filtro::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: 0.7em;
        height: 0.7em;
        transform: translateY(-50%) translateX(-15px);
        border-radius: 50%;
        background-color: var(--verde);
        opacity: 0;
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }
    #seccion_filtro ul li .item-filtro:hover,
    #seccion_filtro ul li .item-activo {
        padding: 0.5em 0.5em 0.5em 1.5em;
        background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%);
    }
    #seccion_filtro ul li .item-filtro:hover::before {
        opacity: 1;
        transform: translateY(-50%) translateX(5px);
    }
    #seccion_filtro ul li .item-activo::before {
        opacity: 1;
    }
    .checkbox-oculto {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    #seccion_filtro ul li .item-activo {
        color: var(--negro);
    }
    .icono_tag {
        width: auto;
        height: 1em;
        padding: 0 0.2em 0 0;
        stroke-width: 3px;
        transition: transform 0.3s ease;
    }
</style>
