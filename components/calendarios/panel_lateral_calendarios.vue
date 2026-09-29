<template>
    <div id="panel_lateral_calendarios">
        <header id="botones_seleccion">

        </header>

        <SeccionFiltro @filtros-cambiados="actualizarFiltros" />

        <div id="seccion_selector_calendarios">
            <div class="titulo_h2">
                <Calendar class="icono"/>
                <h2>Calendarios</h2>
            </div>
    
            <ul v-if="calendariosFiltrados.length">
              <li v-for="item in calendariosFiltrados" :key="item.id || item.nombre">
                    <button
                        type="button"
                        :class="{ 'documento_activo': estaSeleccionado(item) }"
                        :aria-pressed="estaSeleccionado(item)"
                        @click="alternarCalendario(item)"
                    >
                        <i
                            class="icono-calendario"
                            :data-lucide="normalizarIcono(item.icono)"
                            aria-hidden="true"
                        ></i>
                        <span>{{ item.nombre }}</span>
                    </button>
                </li>
            </ul>
            <p v-else-if="errorMensaje" class="mensaje-vacio">{{ errorMensaje }}</p>
            <p v-else-if="filtros.etiquetas.length" class="mensaje-vacio">No hay calendarios con esas etiquetas.</p>
            <p v-else class="mensaje-vacio">No hay calendarios disponibles.</p>
            <BotonLimpiarFiltro
                :disabled="calendariosSeleccionados.length === 0"
                @limpiar-filtro="limpiarFiltros"
            />
        </div>
    </div>
</template>

<script setup>
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
    import { Calendar } from 'lucide-vue-next'
    import { useSheets } from '../../composables/useSheets.ts'
  import { buildEntity, filterBySelection } from '../../composables/useSheetData.ts'
    import BotonLimpiarFiltro from '../botones/btn-limpiar_filtro.vue'
    import SeccionFiltro from './seccion_filtro.vue'

    const calendariosSeleccionados = ref([])
    const emit = defineEmits(['calendarios-seleccionados'])
    const { getTable } = useSheets()
  const calendarios = ref([])
    const errorMensaje = ref('')
    const filtros = ref({ etiquetas: [], tipos: [] })

    const calendariosFiltrados = computed(() =>
      filterBySelection(calendarios.value, filtros.value.etiquetas, [])
    )
    let cargaLucide = null

    const estaSeleccionado = (calendario) => calendariosSeleccionados.value.some(
      (seleccionado) => String(seleccionado.id) === String(calendario.id)
    )

  const normalizarIcono = (valor) => String(valor ?? 'calendar-days')
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase() || 'calendar-days'

  const inicializarLucide = async () => {
    if (!window.lucide?.createIcons) {
      cargaLucide ||= new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/lucide@latest'
          script.async = true
          script.onload = resolve
          script.onerror = () => {
            cargaLucide = null
            resolve()
          }
          document.head.appendChild(script)
        })
      await cargaLucide
    }

    await nextTick()
    window.lucide?.createIcons()
  }

    const cargarChips = async () => {
        try {
            const data = await getTable('calendarios')

      calendarios.value = data
        .map((item, index) => buildEntity(item, {
          id: ['id'],
          nombre: ['nombre', 'titulo', 'documento', 'title'],
          color: ['color'],
          icono: ['icono', 'icon'],
          idEtiqueta: ['id_etiqueta', 'idetiqueta', 'etiqueta', 'tag']
        }, index))
        .filter((item) => item.nombre)

            errorMensaje.value = ''
      await inicializarLucide()
        } catch (error) {
      console.error('Error al cargar los calendarios:', error)
      errorMensaje.value = 'No se pudieron cargar los calendarios.'
      calendarios.value = []
    }
    }

    const alternarCalendario = (calendario) => {
      calendariosSeleccionados.value = estaSeleccionado(calendario)
        ? calendariosSeleccionados.value.filter((item) => String(item.id) !== String(calendario.id))
        : [...calendariosSeleccionados.value, calendario]

      emit('calendarios-seleccionados', [...calendariosSeleccionados.value])
    }

    const actualizarFiltros = (nuevosFiltros) => {
      filtros.value = nuevosFiltros || { etiquetas: [], tipos: [] }
    }

    const limpiarFiltros = () => {
      calendariosSeleccionados.value = []
      emit('calendarios-seleccionados', [])
    }

    watch(calendariosFiltrados, () => {
      void inicializarLucide()
    }, { flush: 'post' })

    onMounted(cargarChips)
</script>

<style scoped> 
#panel_lateral_calendarios { 
  padding: 2em; 
} 
@media (max-width: 768px) { 
  #panel_lateral_calendarios {
      display: none;
  } 
} 

.titulo_h2 { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding-bottom: 1em; 
} 

.titulo_h2 .icono { 
  width: 2em; 
  height: 2em; 
  flex-shrink: 0; 
  stroke-width: 0.2em; 
} 

.titulo_h2 h2 { margin: 0; } 

/* MODIFICADO: Convierte la lista en un contenedor horizontal flexible con espacio entre elementos */
#seccion_selector_calendarios ul { 
  list-style-type: none; 
  padding: 0; 
  margin: 0; 
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Permite que bajen si no caben en pantallas pequeñas */
  gap: 10px;       /* Separación horizontal y vertical entre los elementos */
} 

/* MODIFICADO: Removido width 100% para que se posicionen uno al lado del otro */
#seccion_selector_calendarios ul li { 
  display: flex; 
  flex-direction: row; 
} 

/* MODIFICADO: Cambiado display a inline-block o flex para que no ocupe todo el ancho */
#seccion_selector_calendarios ul li button { 
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  position: relative; 
  overflow: hidden; 
  margin: 0; 
  padding: 0.5em 1.5em 0.5em 0.5em; 
  font-size: 1em; 
  text-align: left; 
  border-radius: 10px; 
  border: none; 
  background-color: var(--blanco); 
  transition: all 0.3s ease-in-out; 
} 

#seccion_selector_calendarios ul li button::before { 
  content: ""; 
  position: absolute; 
  top: 50%; 
  left: 0; 
  transform: translateY(-50%) translateX(-15px); 
  opacity: 0; 
  width: 0.7em; 
  height: 0.7em; 
  background-color: var(--verde); 
  border-radius: 50%; 
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out; 
} 

#seccion_selector_calendarios ul li button:hover { 
  cursor: pointer; 
  padding: 0.5em 0.5em 0.5em 1.5em; 
  background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%); 
} 

#seccion_selector_calendarios ul li button .icono-calendario {
  width: 1.1em;
  height: 1.1em;
  flex: 0 0 auto;
  stroke-width: 2;
}

#seccion_selector_calendarios ul li button:hover::before { 
  opacity: 1; 
  transform: translateY(-50%) translateX(5px); 
} 

#seccion_selector_calendarios ul li .documento_activo { 
  padding: 0.5em 0.5em 0.5em 1.5em; 
  background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%); 
} 

#seccion_selector_calendarios .boton-limpiar-filtro {
  margin-top: 1em;
}

.mensaje-vacio { 
  margin: 1em 0 0; 
  color: var(--gris); 
  font-style: italic; 
} 
</style>
