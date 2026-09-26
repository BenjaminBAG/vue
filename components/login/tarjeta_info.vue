<script setup>
    import { File, Box } from 'lucide-vue-next'

    defineProps ({
      icono: String,
      titulo: String,
      descripcion: String
    })

    const iconos = { File, Box }
</script>

<template>
    <div class="tarjeta_info">
      <div class= "tarjeta_titulo">
        <component 
        :is="iconos[icono]" 
        v-if="iconos[icono]" 
        class="icono_tarjeta" 
        />
        <strong> {{ titulo }} </strong>
      </div>
        <p> {{ descripcion }} </p>
    </div>
</template>

<style scoped>
  .tarjeta_info {
    background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
    padding: 20px;
    border-radius: 10px;
    border: none;
    color: var(--gris);
  }
  .tarjeta_info .tarjeta_titulo {
    display: flex;
    align-items: center;
  }
  .tarjeta_info .tarjeta_titulo .icono_tarjeta {
    padding-right: 1em;
  }
</style>