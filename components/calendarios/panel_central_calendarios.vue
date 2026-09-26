<template>
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

                <!-- Celdas de los días -->
                <div 
                    class="dia-celda" 
                    v-for="(diaObj, index) in diasDelMes" 
                    :key="index"
                    :class="{ 'dia-vacio': !diaObj.dia, 'hoy': esHoy(diaObj.fecha) }"
                >
                    <div class="numero-dia" v-if="diaObj.dia">{{ diaObj.dia }}</div>
                    
                    <!-- Contenedor de Hitos (Eventos) -->
                    <div class="hitos-contenedor" v-if="diaObj.dia">
                        <div 
                            class="hito-item" 
                            v-for="hito in obtenerHitosPorFecha(diaObj.fecha)" 
                            :key="hito.id"
                            :title="hito.descripcion"
                        >
                            {{ hito.nombre }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';

export default {
    name: 'PanelCentralCalendarios',
    components: {
        ArrowLeft,
        ArrowRight
    },
    data() {
        return {
            fechaActual: new Date(),
            diasSemana: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            hitos: [
                // Datos de ejemplo - Formato YYYY-MM-DD
                { id: '1', nombre: 'Reunión de equipo', fecha: '2026-09-15', categoria: 'trabajo', descripcion: 'Revisión de sprint', id_calendario: '1' },
                { id: '2', nombre: 'Entrega de proyecto', fecha: '2026-09-20', categoria: 'entregas', descripcion: 'Subir a producción', id_calendario: '1' },
                { id: '3', nombre: 'Cita médica', fecha: '2026-09-20', categoria: 'personal', descripcion: 'Dentista', id_calendario: '1' },
                { id: '4', nombre: 'Cumpleaños', fecha: '2026-09-28', categoria: 'personal', descripcion: 'Comprar regalo', id_calendario: '1' }
            ]
        }
    },
    computed: {
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
        cambiarMes(incremento) {
            this.fechaActual = new Date(this.anioActual, this.mesActual + incremento, 1);
        },
        obtenerHitosPorFecha(fecha) {
            if (!fecha) return [];
            return this.hitos.filter(hito => hito.fecha === fecha);
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
        height: 100%;
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

    /* Cabecera */
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
        color: var(--blanco);
    }

    /* Grid del Calendario */
    .calendario-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background-color: var(--blanco); /* minimalista, cambiar a --beige para ver mejor */
        flex-grow: 1; /* Permite que el grid ocupe el resto del espacio disponible */
    }

    .dia-semana {
        background-color: var(--blanco);
        text-align: center;
        padding: 0.5em;
        font-weight: bold;
        color: #555;
    }

    .dia-celda {
        background-color: var(--blanco);
        min-height: 120px; /* Espacio mínimo para que quepan hitos */
        display: flex;
        flex-direction: column;
        padding: 0.5em;
        overflow: hidden;
        border-radius: 10px;
        transition: background-color 0.5s ease, transform 0.2s ease;
    }
    .dia-celda:not(.dia-vacio):hover {
        background-color: color-mix(var(--naranja), var(--blanco) 80%);
    }
    .dia-celda:active {
        transform: scale(1.05);
    }

    .dia-vacio {
        background-color: var(--blanco);
    }

    .hoy {
        background-color: color-mix(var(--azul), var(--blanco) 90%);
        border-radius: 10px;
    }

    .numero-dia {
        font-weight: bold;
        color: var(--gris);
        margin-bottom: 0.5em;
        text-align: right;
    }

    /* Contenedor de los eventos/hitos */
    .hitos-contenedor {
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow-y: auto; /* Scroll interno si hay muchos eventos en un solo día */
        flex-grow: 1;
    }

    /* Estilos de scrollbar para días muy llenos */
    .hitos-contenedor::-webkit-scrollbar {
        width: 4px;
    }
    .hitos-contenedor::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 4px;
    }

    .hito-item {
        background-color: var(--verde); /* Puedes cambiar esto basado en hito.categoria */
        color: white;
        font-size: 0.75em;
        padding: 4px 6px;
        border-radius: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    .hito-item:hover {
        opacity: 0.9;
    }

    /* Responsive */
    @media (max-width: 768px) {
        #panel_central_calendarios {
            grid-column: 1 / 3;
            padding: 0;
        }
        
        #panel_central_calendarios #contenedor_calendario {
            box-shadow: none;
            padding: 1em;
            border-radius: 0;
        }

        .dia-celda {
            min-height: 80px;
            padding: 0.25em;
        }
        
        .hito-item {
            font-size: 0.65em;
            padding: 2px 4px;
        }
    }
</style>