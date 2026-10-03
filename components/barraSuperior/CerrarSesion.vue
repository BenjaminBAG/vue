<script setup>
    import { SquareArrowRightExit } from 'lucide-vue-next'
    import { useAuth } from '~~/composables/useAuth'

    const auth = useAuth()

    const cerrarSesion = () => {
        auth.cerrarSesion() 
        navigateTo('/login')
    }
</script>

<template>
      <button class="rojo" @click="cerrarSesion">
        <SquareArrowRightExit class="icono" />
        <p>Cerrar Sesión</p>
      </button>
</template>