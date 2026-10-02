<script setup>
    defineProps({
        item: {
            type: Object,
            required: true
        },
        docSeleccionado: {
            type: Object,
            required: false,
            default: null
        },
        icono: {
            type: Object,
            required: false,
            default: () => ({})
        },
        acortar: {
            type: Boolean,
            required: false,
            default: false
        }
    })
</script>

<template>
    <button class="chip-unico"
        :activo="item === docSeleccionado"
        :class="{'documento_activo': docSeleccionado?.id === item.id , 'acortar': acortar}"
        >
        <component :is="icono" v-if="icono" />
        <p>{{ item.nombre }}</p>
    </button>
</template>

<style scoped>
    .chip-unico {
        position: relative;
        overflow: hidden;
        width: 100%;
        margin: 0.5em 0;
        padding: 0 0.5em 0 1em;
        font-size: 1em;
        text-align: left;
        border-radius: 10px;
        border: none;
        background-color: var(--blanco);
        transition: all 0.3s ease-in-out;
        display: flex;
        flex-direction: row;
        align-items: center;
        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%) translateX(-15px);
            opacity: 0;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 10px solid var(--naranja);
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }
        &:hover {
            cursor: pointer;
            padding-left: 1.5em;
            background-color: color-mix(var(--naranja), var(--blanco) 70%);
            &::before {
                opacity: 1;
                transform: translateY(-50%) translateX(5px);
            }
        }
        svg {
            width: auto;
            height: 1em;
            margin-right: 0.5em;
        }
    }
    .documento_activo {
        padding-left: 1.5em;
        background-color: color-mix(var(--naranja), var(--blanco) 70%);
    }
    @media (max-width: 768px) {
      .acortar {
          height: 2em;
          padding-left: 0.5em;
          p {
              display: none;
          }
        }
    }
</style>