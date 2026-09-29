<template>
    <div class="area_desplazamiento" :style="estiloArea">
        <slot />
    </div>
</template>

<script>
    export default {
      name: 'AreaDesplazamiento',
      props: {
        alturaMax: {
          type: String,
          default: '100%'
        },
        altura_max: {
          type: String,
          default: null
        }
      },
      computed: {
        estiloArea() {
          const valor = this.alturaMax || this.altura_max || '100%';
          return {
            '--altura-max': valor
          };
        }
      }
    }
</script>

<style scoped>
    .area_desplazamiento {
        display: block;
        width: 100%;
        padding-right: 5px;
        max-height: var(--altura-max, 100%);
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
    }
    .area_desplazamiento::-webkit-scrollbar {
        width: 0px;
    }
    /* Ancho de la barra vertical y alto de la horizontal */
    .area_desplazamiento:hover::-webkit-scrollbar {
        width: 6px;
    }
    /* El fondo o carril por donde se desplaza la barra */
    .area_desplazamiento::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 5px;
    }
    /* La barra o manija que se arrastra */
    .area_desplazamiento::-webkit-scrollbar-thumb {
        background-color: var(--naranja);
    }
    /* Color de la barra al pasar el cursor por encima */
    .area_desplazamiento::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(var(--naranja), var(--blanco) 50%);
    }
</style>