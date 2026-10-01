<template>
    <AreaDesplazamiento id="contenedor_panel_central_calendarios">
        <div id="panel_central_calendarios">
            <div id="contenedor_calendario">
                <!-- Cabecera del calendario (Controles) -->
                <div class="calendario-header">
                    <button @click="cambiarMes(-1)" class="btn-mes">
                        <ArrowLeft />
                    </button>
                    <h2 class="mes-titulo">{{ nombreMesActual }} {{ anioActual }}</h2>
                    <button @click="cambiarMes(1)" class="btn-mes">
                        <ArrowRight />
                    </button>
                </div>

                <!-- Días de la semana -->
                <div class="calendario-grid">
                    <div class="dia-semana" v-for="dia in diasSemana" :key="dia">
                        {{ dia }}
                    </div>

                    <DiaCalendario
                        v-for="(dia, index) in diasDelMes"
                        :key="index"
                        :dia="dia"
                        :hitos="obtenerHitosPorFecha(dia.fecha)"
                        :es-hoy="esHoy(dia.fecha)"
                    />
                </div>
            </div>
        </div>
    </AreaDesplazamiento>
</template>

<script>
import AreaDesplazamiento from '../otros/area_desplazamiento.vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { useSheets } from '../../composables/useSheets';
import { buildEntity } from '../../composables/useSheetData';
import DiaCalendario from './dia_calendario.vue';

export default {
    name: 'PanelCentralCalendarios',
    components: {
        AreaDesplazamiento,
        ArrowLeft,
        ArrowRight,
        DiaCalendario
    },
    props: {
        calendariosSeleccionados: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            fechaActual: new Date(),
            diasSemana: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            hitos: []
        }
    },
    async mounted() {
        try {
            const { getTable } = useSheets();
            const [datosHitos, datosCalendarios] = await Promise.all([
                getTable('hitos'),
                getTable('calendarios')
            ]);

            const coloresPorCalendario = new Map(datosCalendarios
                .map((item, index) => buildEntity(item, {
                    id: ['id'],
                    color: ['color']
                }, index))
                .map((calendario) => [String(calendario.id).trim(), calendario.color]));
            const idsCalendariosPermitidos = new Set(coloresPorCalendario.keys());

            this.hitos = datosHitos
                .map((item, index) => buildEntity(item, {
                    id: ['id'],
                    nombre: ['nombre', 'titulo'],
                    fecha: ['fecha'],
                    descripcion: ['descripcion', 'detalle'],
                    responsable: ['responsable'],
                    id_calendario: ['id_calendario', 'idcalendario']
                }, index))
                .map((hito) => ({
                    ...hito,
                    fecha: this.normalizarFecha(hito.fecha),
                    colorCalendario: coloresPorCalendario.get(String(hito.id_calendario).trim()) || ''
                }))
                .filter((hito) =>
                    hito.nombre &&
                    hito.fecha &&
                    idsCalendariosPermitidos.has(String(hito.id_calendario).trim())
                );
        } catch (error) {
            console.error('Error al cargar los hitos:', error);
            this.hitos = [];
        }
    },
    computed: {
        hitosVisibles() {
            const idsCalendarios = new Set(this.calendariosSeleccionados
                .map((calendario) => String(calendario.id).trim()));
            if (!idsCalendarios.size) return this.hitos;

            return this.hitos.filter((hito) => idsCalendarios.has(String(hito.id_calendario).trim()));
        },
        anioActual() {
            return this.fechaActual.getFullYear();
        },
        mesActual() {
            return this.fechaActual.getMonth();
        },
        nombreMesActual() {
            return new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.fechaActual);
        },
        diasDelMes() {
            const dias = [];
            const primerDiaDelMes = new Date(this.anioActual, this.mesActual, 1);
            const ultimoDiaDelMes = new Date(this.anioActual, this.mesActual + 1, 0);
            
            // Ajustar para que la semana empiece en Lunes (0 = Domingo, 1 = Lunes...)
            let diaSemanaInicio = primerDiaDelMes.getDay() === 0 ? 6 : primerDiaDelMes.getDay() - 1;

            // Rellenar los días vacíos al principio del mes
            for (let i = 0; i < diaSemanaInicio; i++) {
                dias.push({ dia: null, fecha: null });
            }

            // Rellenar los días reales del mes
            for (let i = 1; i <= ultimoDiaDelMes.getDate(); i++) {
                // Formatear fecha a YYYY-MM-DD para facilitar la comparación
                const mesStr = String(this.mesActual + 1).padStart(2, '0');
                const diaStr = String(i).padStart(2, '0');
                const fechaStr = `${this.anioActual}-${mesStr}-${diaStr}`;
                
                dias.push({ dia: i, fecha: fechaStr });
            }

            return dias;
        }
    },
    methods: {
        normalizarFecha(fecha) {
            const valor = String(fecha ?? '').trim();
            const coincidencia = valor.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
            if (!coincidencia) return valor;

            const [, dia, mes, anio] = coincidencia;
            const anioCompleto = anio.length === 2 ? `20${anio}` : anio;
            return `${anioCompleto}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        },
        cambiarMes(incremento) {
            this.fechaActual = new Date(this.anioActual, this.mesActual + incremento, 1);
        },
        obtenerHitosPorFecha(fecha) {
            if (!fecha) return [];
            return this.hitosVisibles.filter(hito => hito.fecha === fecha);
        },
        esHoy(fechaStr) {
            if (!fechaStr) return false;
            const hoy = new Date();
            const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
            return fechaStr === hoyStr;
        }
    }
}
</script>

<style scoped>
    #panel_central_calendarios {
        grid-column: 2;
        grid-row: 2;
        padding: 2em;
        height: auto;
        box-sizing: border-box;
    }

    #panel_central_calendarios #contenedor_calendario {
        min-height: 80%;
        height: 100%;
        box-shadow: 0 0 0.5em 0.2em var(--beige);
        background-color: var(--blanco);
        display: flex;
        flex-direction: column;
        padding: 1.5em;
        box-sizing: border-box;
    }

    .calendario-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5em;
    }

    .mes-titulo {
        text-transform: capitalize;
        margin: 0;
        color: var(--negro);
    }

    .btn-mes {
        width: 3em;
        height: 3em;
        background-color: transparent;
        border: none;
        border-radius: 50%;
        padding: 0;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
        align-items: center;
        display: flex;
        justify-content: center;
        font-size: 1em;
    }

    .btn-mes:hover {
        background-color: var(--negro);
        svg {
            color: var(--blanco);
        }
    }

    .calendario-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background-color: var(--blanco);
        flex-grow: 1;
    }

    .dia-semana {
        background-color: var(--blanco);
        text-align: center;
        padding: 0.5em;
        font-weight: bold;
        color: #555;
    }

    @media (max-width: 768px) {
        #contenedor_panel_central_calendarios {
            grid-column: 1 / 3;
            #panel_central_calendarios {
                padding: 0;
                #contenedor_calendario {
                    box-shadow: none;
                    padding: 1em;
                }
            }
        }
    }
</style>