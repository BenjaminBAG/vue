<template>
    <div class="dia-celda" :class="{ 'dia-vacio': !dia?.dia, hoy: esHoy }">
        <div v-if="dia?.dia" class="numero-dia">{{ dia.dia }}</div>
        <div v-if="dia?.dia" class="hitos-contenedor">
            <HitoCalendario
                v-for="hito in hitos"
                :key="hito.id"
                :hito="hito"
            />
        </div>
    </div>
</template>

<script>
import HitoCalendario from './hito_calendario.vue';

export default {
    name: 'DiaCalendario',
    components: {
        HitoCalendario
    },
    props: {
        dia: {
            type: Object,
            default: null
        },
        hitos: {
            type: Array,
            default: () => []
        },
        esHoy: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
.dia-celda {
    min-width: 0;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0.5em;
    border-radius: 10px;
    background-color: var(--blanco);
    transition: background-color 0.5s ease, transform 0.2s ease;
}

.dia-celda:not(.dia-vacio):hover {
    background-color: color-mix(var(--naranja), var(--blanco) 80%);
}

.dia-celda:active {
    transform: scale(1.05);
}

.hoy {
    border-radius: 10px;
    background-color: color-mix(var(--azul), var(--blanco) 90%);
}

.numero-dia {
    margin-bottom: 0.5em;
    color: var(--gris);
    font-weight: bold;
    text-align: right;
}

.hitos-contenedor {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
}

.hitos-contenedor::-webkit-scrollbar {
    width: 4px;
}

.hitos-contenedor::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #ccc;
}

@media (max-width: 768px) {
    .dia-celda {
        min-height: 80px;
        padding: 0.25em;
    }
}
</style>