<template>
    <section id="seccion_filtro">
        <div class="titulo-filtro">
            <Filter class="icono-filtro" />
            <h2>Filtrar calendarios</h2>
        </div>

        <ul v-if="etiquetas.length">
            <li v-for="item in etiquetas" :key="item.id">
                <label class="item-filtro" :class="{ 'item-activo': item.seleccionado }">
                    <input
                        v-model="item.seleccionado"
                        type="checkbox"
                        class="checkbox-oculto"
                        @change="emitirFiltros"
                    >
                    <Tag class="icono-tag" />
                    <span>{{ item.nombre }}</span>
                </label>
            </li>
        </ul>
        <p v-else-if="errorMensaje" class="mensaje-filtro">{{ errorMensaje }}</p>
        <p v-else class="mensaje-filtro">No hay etiquetas disponibles.</p>

        <BotonLimpiarFiltro
            :disabled="!hayFiltrosActivos"
            @limpiar-filtro="limpiarFiltros"
        />
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Filter, Tag } from 'lucide-vue-next'
import { useSheets } from '../../composables/useSheets'
import { buildEntity } from '../../composables/useSheetData'
import BotonLimpiarFiltro from '../botones/btn-limpiar_filtro.vue'

const emit = defineEmits(['filtros-cambiados'])
const { getTable } = useSheets()
const etiquetas = ref([])
const errorMensaje = ref('')

const hayFiltrosActivos = computed(() => etiquetas.value.some((item) => item.seleccionado))

const emitirFiltros = () => {
    emit('filtros-cambiados', {
        etiquetas: etiquetas.value
            .filter((item) => item.seleccionado)
            .map((item) => String(item.id).trim())
    })
}

const limpiarFiltros = () => {
    etiquetas.value = etiquetas.value.map((item) => ({ ...item, seleccionado: false }))
    emitirFiltros()
}

const cargarEtiquetas = async () => {
    try {
        const data = await getTable('etiquetas')
        etiquetas.value = data
            .map((item, index) => ({
                ...buildEntity(item, {
                    id: ['id'],
                    nombre: ['nombre']
                }, index),
                seleccionado: false
            }))
            .filter((item) => item.nombre)
        errorMensaje.value = ''
    } catch (error) {
        console.error('Error al cargar las etiquetas de calendarios:', error)
        errorMensaje.value = 'No se pudieron cargar las etiquetas.'
    }
}

onMounted(cargarEtiquetas)
</script>

<style scoped>
#seccion_filtro {
    padding-right: 1em;
    margin-bottom: 1.5em;
}

.titulo-filtro {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.75em;
}

.titulo-filtro h2 {
    margin: 0;
    font-size: 1.1em;
}

#seccion_filtro ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0;
    padding: 0;
    list-style: none;
}

#seccion_filtro li {
    display: inline-block;
}

.item-filtro {
    position: relative;
    overflow: hidden;
    display: flex;
    padding: 0.5em 1.5em 0.5em 0.5em;
    align-items: center;
    gap: 0.3em;
    min-height: 1.5em;
    padding: 0.3em 0.5em;
    border-radius: 8px;
    background-color: var(--blanco);
    color: var(--negro);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.item-filtro::before {
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

.item-filtro:hover,
.item-activo {
    padding: 0.5em 0.5em 0.5em 1.5em;
    background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%);
}

.item-filtro:hover::before,
.item-activo::before {
    opacity: 1;
    transform: translateY(-50%) translateX(5px);
}

.checkbox-oculto {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
}

.checkbox-oculto:focus-visible + .icono-tag {
    outline: 2px solid var(--negro);
    outline-offset: 2px;
}

.icono-filtro,
.icono-tag {
    width: 1em;
    height: 1em;
    flex: 0 0 auto;
    stroke-width: 3px;
}

.mensaje-filtro {
    margin: 0.5em 0;
    color: var(--gris);
    font-style: italic;
}

#seccion_filtro :deep(.boton-limpiar-filtro) {
    margin-top: 0.75em;
}
</style>
