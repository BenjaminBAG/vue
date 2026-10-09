<script setup>
import { useTamannoContenido } from '../composables/useTamannoContenido'

useTamannoContenido()
useTamannoContenido({
    almacenamiento: 'portal-tamanno-markdown',
    cssVariable: '--tamanno-markdown'
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
    html {
        font-size: var(--tamanno-regular);
    }

    * {
        font-family: var(--fuente-regular);
    }
</style>