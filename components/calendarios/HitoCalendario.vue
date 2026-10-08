<template>
    <CuadroFlotanteHito :hito="hito" />
</template>

<script>
import CuadroFlotanteHito from './CuadroFlotanteHito.vue';

export default {
    name: 'HitoCalendario',
    components: {
        CuadroFlotanteHito
    },
    props: {
        hito: {
            type: Object,
            required: true
        }
    }
};
</script>
