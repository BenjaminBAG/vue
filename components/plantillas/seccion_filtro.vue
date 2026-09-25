<template>
    <div id="seccion_filtro">

        <ul class="lista-en-linea">
            <li v-for="item in etiquetas" :key="item.id">
                <label class="item-filtro" :class="{ 'item-activo': item.seleccionado }">
                    <input type="checkbox" v-model="item.seleccionado" class="checkbox-oculto" @change="emitirFiltros">
                    <Tag class="icono_tag" :style="{ color: item.color }" />
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
    import BotonLimpiarFiltro from '../botones/btn-limpiar_filtro.vue'

    const emit = defineEmits(['filtros-cambiados'])
    const { fetchSheetRange } = useSheets()
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
            const dataEtiquetas = await fetchSheetRange('etiquetas!A:C')

            etiquetas.value = dataEtiquetas
                .map((item, index) => ({
                    id: String(item.id ?? item[0] ?? index + 1),
                    nombre: item.nombre ?? item[1] ?? item[0] ?? '',
                    color: item.color ?? item[2] ?? '',
                    seleccionado: false
                }))
                .filter((item) => item.nombre)

            errorMensaje.value = ''

            const dataTipos = await fetchSheetRange('plantillas!C:C')

            tipos.value = dataTipos
                .map((item, index) => ({
                    tipo: String(item.tipo ?? item[0] ?? '').trim(),
                    seleccionado: false
                }))
                .filter((item) => item.tipo)

            const tiposUnicos = new Map()
            tipos.value.forEach((item) => {
                if (!tiposUnicos.has(item.tipo)) {
                    tiposUnicos.set(item.tipo, item)
                }
            })

            tipos.value = [...tiposUnicos.values()]
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
        display: flex;
        align-items: center;
        padding: 0.3em 0.3em;
        height: 1.5em;
        background-color: var(--blanco);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }
    #seccion_filtro ul li .item-filtro:hover {
        transform: translateY(-2px);
    }
    .checkbox-oculto {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    #seccion_filtro ul li .item-activo {
        background-color: var(--negro);
        border-color: var(--negro);
        color: var(--blanco);
    }

    .icono_tag {
        width: auto;
        height: 1em;
        padding: 0 0.2em 0 0;
        stroke-width: 3px;
        transition: transform 0.3s ease;
    }
    .icono_tag:hover {
        transform: rotate(7deg) scale(1.1);
    }
</style>
