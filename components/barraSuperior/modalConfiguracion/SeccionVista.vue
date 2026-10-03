<script setup>
    import Perfil from './Perfil.vue'
    import Usuarios from './Usuarios.vue'
    import Historial from './Historial.vue'
    import AcercaDe from './AcercaDe.vue'

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
            <Usuarios v-if="vista === 'usuarios'" />
            <Historial v-if="vista === 'historial'"/>
            <AcercaDe v-if="vista === 'acerca_de'"/>
    </div>
</template>

<style scoped>
    .seccion-vista-modal {
        grid-column: 2;
    }
</style>