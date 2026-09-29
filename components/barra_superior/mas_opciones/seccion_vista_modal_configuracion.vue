<script setup>
    import OpcionesPerfil from './opciones_perfil.vue'
    import OpcionesAdministrador from './opciones_administrador.vue'

    const vistaActiva = 'perfil'
</script>

<template>
    <div class="seccion-vista-modal">
        <OpcionesPerfil v-if="vistaActiva === 'perfil'" />
        <OpcionesAdministrador v-if="vistaActiva === 'administrador'" />
    </div>
</template>

<style scoped>
    .seccion-vista-modal {
        grid-column: 2;
    }
</style>