<template>
    <span
        class="hito-item"
        :style="{ backgroundColor: hito.colorCalendario || 'var(--verde)' }"
        :title="detalleCompleto"
        :aria-label="detalleCompleto"
        tabindex="0"
    >
        {{ hito.nombre }}
    </span>
</template>

<script>
export default {
    name: 'HitoCalendario',
    props: {
        hito: {
            type: Object,
            required: true
        }
    },
    computed: {
        detalleCompleto() {
            const fecha = String(this.hito.fecha ?? '');
            const fechaVisible = fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1');

            return [
                this.hito.nombre,
                fechaVisible && `Fecha: ${fechaVisible}`,
                this.hito.descripcion && `Descripción: ${this.hito.descripcion}`,
                this.hito.responsable && `Responsable: ${this.hito.responsable}`
            ].filter(Boolean).join('\n');
        }
    }
};
</script>

<style scoped>
.hito-item {
    display: block;
    overflow: hidden;
    padding: 4px 6px;
    border-radius: 4px;
    background-color: var(--verde);
    color: white;
    font-size: 0.75em;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
}

.hito-item:hover,
.hito-item:focus-visible {
    opacity: 0.9;
}

@media (max-width: 768px) {
    .hito-item {
        padding: 2px 4px;
        font-size: 0.65em;
    }
}
</style>