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
    import { computed, onMounted, ref } from 'vue'
    import { useSheets } from '../../composables/useSheets'
    import { buildEntity, uniqueByField } from '../../composables/useSheetData'
    import BotonLimpiarFiltro from '../botones/btn-limpiar_filtro.vue'

    const emit = defineEmits(['filtros-cambiados'])
    const { getTable } = useSheets()
    const etiquetas = ref([])
    const tipos = ref([])
    const errorMensaje = ref('')

    const hayFiltrosActivos = computed(() => {
        const etiquetasActivas = etiquetas.value.filter((item) => item.seleccionado).length
        const tiposActivos = tipos.value.filter((item) => item.seleccionado).length
        return etiquetasActivas > 0 || tiposActivos > 0
    })

    const emitirFiltros = () => {
        emit('filtros-cambiados', {
            etiquetas: etiquetas.value
                .filter((item) => item.seleccionado)
                .map((item) => String(item.id).trim()),
            tipos: tipos.value
                .filter((item) => item.seleccionado)
                .map((item) => String(item.tipo).trim())
        })
    }

    const limpiarFiltros = () => {
        etiquetas.value = etiquetas.value.map((item) => ({ ...item, seleccionado: false }))
        tipos.value = tipos.value.map((item) => ({ ...item, seleccionado: false }))
        emitirFiltros()
    }

    const cargarEtiquetas = async () => {
        try {
            const dataEtiquetas = await getTable('etiquetas')
            etiquetas.value = dataEtiquetas
                .map((item, index) => ({
                    ...buildEntity(item, {
                        id: ['id'],
                        nombre: ['nombre'],
                        color: ['color']
                    }, index),
                    seleccionado: false
                }))
                .filter((item) => item.nombre)

            errorMensaje.value = ''

            const dataTipos = await getTable('documentos')
            tipos.value = uniqueByField(
                dataTipos
                    .map((item) => ({
                        tipo: String(item.tipo ?? '').trim(),
                        seleccionado: false
                    }))
                    .filter((item) => item.tipo),
                'tipo'
            )
        } catch (error) {
            console.error('Error al cargar las etiquetas:', error)
            errorMensaje.value = 'No se pudieron cargar los documentos.'
        }
    }

    onMounted(() => {
        cargarEtiquetas()
    })
</script>

<script>
    import { Filter, Tag, Type } from 'lucide-vue-next'

    export default {
        name: 'SeccionFiltro',
        components: {
            Filter,
            Tag,
            Type
        }
    }
</script>

<style scoped>
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
