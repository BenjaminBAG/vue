<template>
    <div id="seccion_filtro">
        <div class="titulo_h2">
            <Filter class="icono"/>
            <h2>Filtrar documentos</h2>
        </div>
        <h3>Etiquetas</h3>
        <ul>
            <li v-for="item in etiquetas">
                <div>
                    <input type="checkbox">
                    <Tag class="icono_tag" :style="{color: item.color}" />
                    <p>{{ item.nombre }}</p>
                </div>
            </li>
        </ul>
        <h3>Tipos de documento</h3>
        <ul>
            <li v-for="item in tipos">
                <div>
                    <input type="checkbox">
                    <Type class="icono_tag" />
                    <p>{{ item.tipo }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { useSheets } from '../../composables/useSheets'

    const { fetchSheetRange } = useSheets()
    const etiquetas = ref([])
    const tipos = ref([])
    const errorMensaje = ref('')

    const cargarEtiquetas = async () => {
        try {
            const dataEtiquetas = await fetchSheetRange('etiquetas!A:C')

            etiquetas.value = dataEtiquetas
            .map((item, index) => ({
                id: String(item.id ?? index + 1),
                nombre: item.nombre ?? item[0] ?? '',
                color: item.color ?? item[1] ?? ''
            }))
            .filter((item) => item.nombre)

            errorMensaje.value = ''

            const dataTipos = await fetchSheetRange('documentos!C:C')

            tipos.value = dataTipos
            .map((item, index) => ({
                tipo: item.tipo ?? item[0] ?? ''
            }))
            .filter((item) => item.tipo)
            
        } catch (error) {
            console.error('Error al cargar las etiquetas:', error)
            errorMensaje.value = 'No se pudieron cargar los documentos.'
            chips.value = []
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
        padding: 1em;
    }
    #seccion_filtro .titulo_h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
    }
    #seccion_filtro .titulo_h2 .icono {
        width: 2em;
        height: 2em;
        flex-shrink: 0;
        stroke-width: 0.2em;
    }
    #seccion_filtro ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    #seccion_filtro ul li div {
        display: flex;
        align-items: center;
        padding-left: 0.5em;
        height: 2em;
    }
    #seccion_filtro ul li div input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 1.5em;
        height: 1.5em;
        background-color: #ffffff;
        border: none;
        border-radius: 0;
        outline: none;
        cursor: pointer;
        border: 2px solid var(--beige);
        border-radius: 50%;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    #seccion_filtro ul li div input[type="checkbox"]:hover {
        background-color: var(--verde);
        border: 2px solid var(--verde);
    }
    #seccion_filtro ul li div input[type="checkbox"]:checked {
        background-color: var(--negro);
        border: 2px solid var(--negro);
    }
    .icono_tag {
        width: auto;
        height: 1em;
        padding: 0 0.5em;
        stroke-width: 3px;
    }
</style>