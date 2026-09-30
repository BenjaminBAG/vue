<script setup>
    import Perfil from './perfil.vue'
    import Administrador from './administrador.vue'
    import Historial from './historial.vue'
    import AcercaDe from './acerda__de.vue'

    defineProps ({
        vista: {
            type: String,
            required: true,
            default: 'perfil'
        }
    })
</script>

<template>
    <div class="seccion-vista-modal">
        <Perfil v-if="vista === 'perfil'" />
        <Administrador v-if="vista === 'administrador'" />
        <Historial v-if="vista === 'historial'"/>
        <AcercaDe v-if="vista === 'acerca_de'"/>
    </div>
</template>

<style scoped>
    .seccion-vista-modal {
        grid-column: 2;
    }
</style>