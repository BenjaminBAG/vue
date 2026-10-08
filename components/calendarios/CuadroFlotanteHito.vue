<script setup>
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
    hito: {
        type: Object,
        required: true
    }
});

const modo = ref(null);
const botonHito = ref(null);
const botonCerrar = ref(null);
const panel = ref(null);
const posicion = ref({ top: '0px', left: '0px' });
const idTitulo = useId();
let temporizadorCierre;

const admiteHover = () => typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const fechaVisible = () => {
    const fecha = String(props.hito.fecha ?? '');
    return fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1');
};

const posicionarPanel = async () => {
    await nextTick();
    const boton = botonHito.value?.getBoundingClientRect();
    const cuadro = panel.value?.getBoundingClientRect();
    if (!boton || !cuadro) return;

    const margen = 8;
    const espacio = 10;
    const cabeALaDerecha = boton.right + espacio + cuadro.width <= window.innerWidth - margen;
    const left = cabeALaDerecha
        ? boton.right + espacio
        : Math.max(margen, boton.left - cuadro.width - espacio);
    const top = Math.min(
        Math.max(margen, boton.top),
        Math.max(margen, window.innerHeight - cuadro.height - margen)
    );

    posicion.value = { top: `${top}px`, left: `${left}px` };
};

const abrirPopover = () => {
    if (!admiteHover()) return;
    clearTimeout(temporizadorCierre);
    modo.value = 'popover';
    void posicionarPanel();
};

const abrirModal = () => {
    if (admiteHover()) return;
    clearTimeout(temporizadorCierre);
    modo.value = 'modal';
};

const cancelarCierre = () => clearTimeout(temporizadorCierre);

const programarCierre = () => {
    if (modo.value !== 'popover') return;
    clearTimeout(temporizadorCierre);
    temporizadorCierre = setTimeout(() => {
        modo.value = null;
    }, 180);
};

const cerrar = async () => {
    clearTimeout(temporizadorCierre);
    modo.value = null;
    await nextTick();
    botonHito.value?.focus();
};

watch(modo, async (nuevoModo) => {
    if (nuevoModo === 'modal') {
        await nextTick();
        botonCerrar.value?.focus();
    }
});

onBeforeUnmount(() => clearTimeout(temporizadorCierre));
</script>

<template>
    <button
        ref="botonHito"
        class="hito-item"
        type="button"
        :style="{ backgroundColor: hito.colorCalendario || 'var(--verde)' }"
        :aria-label="`Ver detalles de ${hito.nombre}`"
        aria-haspopup="dialog"
        :aria-expanded="Boolean(modo)"
        :aria-controls="modo ? idTitulo : undefined"
        @pointerenter="abrirPopover"
        @pointerleave="programarCierre"
        @focus="abrirPopover"
        @blur="programarCierre"
        @click="abrirModal"
        @keydown.esc.prevent="cerrar"
    >
        {{ hito.nombre }}
    </button>

    <Teleport to="body">
        <div
            v-if="modo"
            class="hito-overlay"
            :class="{ 'hito-overlay--popover': modo === 'popover' }"
            @click.self="cerrar"
        >
            <section
                ref="panel"
                class="hito-dialogo"
                :class="{ 'hito-dialogo--popover': modo === 'popover' }"
                :style="modo === 'popover' ? posicion : undefined"
                role="dialog"
                :aria-modal="modo === 'modal' ? 'true' : undefined"
                :aria-labelledby="idTitulo"
                @pointerenter="cancelarCierre"
                @pointerleave="programarCierre"
                @keydown.esc="cerrar"
            >
                <button
                    v-if="modo === 'modal'"
                    ref="botonCerrar"
                    class="boton-cerrar"
                    type="button"
                    aria-label="Cerrar detalles del hito"
                    @click="cerrar"
                >
                    <X :size="20" />
                </button>
                <h2 :id="idTitulo">{{ hito.nombre }}</h2>
                <dl class="detalle-hito">
                    <div>
                        <dt>Calendario</dt>
                        <dd>{{ hito.nombreCalendario || 'Sin calendario' }}</dd>
                    </div>
                    <div>
                        <dt>Fecha</dt>
                        <dd>{{ fechaVisible() || 'Sin fecha' }}</dd>
                    </div>
                    <div>
                        <dt>Responsable</dt>
                        <dd>{{ hito.responsable || 'Sin responsable' }}</dd>
                    </div>
                    <div>
                        <dt>Descripción</dt>
                        <dd class="descripcion">{{ hito.descripcion || 'Sin descripción.' }}</dd>
                    </div>
                </dl>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
.hito-item {
    display: block;
    width: 100%;
    overflow: hidden;
    padding: 4px 6px;
    border: 0;
    color: white;
    font: inherit;
    font-size: 0.75em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.hito-item:hover,
.hito-item:focus-visible {
    transform: scale(1.05);
}

.hito-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgb(0 0 0 / 45%);
}

.hito-overlay--popover {
    display: block;
    padding: 0;
    background: transparent;
    pointer-events: none;
}

.hito-dialogo {
    position: relative;
    box-sizing: border-box;
    width: min(100%, 32rem);
    max-height: min(85vh, 40rem);
    overflow-y: auto;
    padding: 1.5rem;
    border-top: 5px solid v-bind('hito.colorCalendario || "var(--verde)"');
    background: var(--blanco);
    color: var(--negro);
    box-shadow: 0 1rem 3rem rgb(0 0 0 / 25%);
    background-color: color-mix(var(--beige), var(--blanco) 80%);
}

.hito-dialogo--popover {
    position: fixed;
    width: min(20rem, calc(100vw - 2rem));
    max-height: min(80vh, 32rem);
    padding: 1rem;
    pointer-events: auto;
}

.hito-dialogo h2 {
    padding-right: 2rem;
    margin: 0 0 1.25rem;
    font-size: 1.25rem;
    overflow-wrap: anywhere;
}

.boton-cerrar {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: grid;
    width: 2.25rem;
    height: 2.25rem;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;
}

.boton-cerrar:hover,
.boton-cerrar:focus-visible {
    background: color-mix(in srgb, var(--negro) 10%, transparent);
}

.detalle-hito {
    display: grid;
    gap: 1rem;
    margin: 0;
}

.detalle-hito dt {
    margin-bottom: 0.25rem;
    color: var(--gris);
    font-size: 0.8rem;
    font-weight: 700;
}

.detalle-hito dd {
    margin: 0;
    overflow-wrap: anywhere;
}

.descripcion {
    white-space: pre-wrap;
}

@media (max-width: 768px) {
    .hito-item {
        padding: 2px 4px;
        font-size: 0.65em;
    }

    .hito-dialogo {
        padding: 1.25rem;
    }
}
</style>