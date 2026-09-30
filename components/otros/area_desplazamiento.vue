<template>
    <div class="area_desplazamiento" :class="`area_desplazamiento--${eje}`" :style="estiloArea">
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
        },
        eje: {
          type: String,
          default: 'vertical'
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
        scrollbar-gutter: stable;
    }
      .area_desplazamiento--horizontal {
        max-height: none;
        padding-right: 0;
        padding-bottom: 5px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-gutter: auto;
      }
      .area_desplazamiento--both {
        overflow: auto;
    }
</style>