<template>
    <div id="panel_lateral_inicio">
        <header id="botones_seleccion">
            <!-- Pasamos true o false si la vista coincide -->
            <BtnCircularSelector 
                :activo="vistaActiva === 'selector'" 
                @click="cambiarVista('selector')"
            />
            <BtnCircularLista 
                :activo="vistaActiva === 'indice'" 
                @click="cambiarVista('indice')"
            />
            <BtnCircularFiltrar 
                :activo="vistaActiva === 'filtro'" 
                @click="cambiarVista('filtro')"
            />
            <BtnCircularEditar 
                :activo="vistaActiva === 'editar'" 
                @click="cambiarVista('editar')"
            />
            <BtnCircularNuevo 
                :activo="vistaActiva === 'nuevo'" 
                @click="cambiarVista('nuevo')"
            />
        </header>
        <SeccionLista v-if="vistaActiva === 'selector'" />
        <SeccionIndice v-if="vistaActiva === 'indice'" />
        <SeccionFiltro v-if="vistaActiva === 'filtro'" />
        <SeccionEditar v-if="vistaActiva === 'editar'" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import BtnCircularSelector from '../botones/btn-circular-selector.vue'
    import BtnCircularLista from '../botones/btn-circular-indice.vue'
    import BtnCircularFiltrar from '../botones/btn-circular-filtrar.vue'
    import BtnCircularEditar from '../botones/btn-circular-editar.vue'
    import BtnCircularNuevo from '../botones/btn-circular-nuevo.vue'
    import SeccionLista from './seccion_selector.vue'
    import SeccionIndice from './seccion_indice.vue'
    import SeccionFiltro from './seccion_filtro.vue'
    import SeccionEditar from './seccion_editar.vue'


    const vistaActiva = ref('selector')

    const cambiarVista = (nuevaVista) => {
        vistaActiva.value = nuevaVista
    }
</script>

<style scoped>
    #panel_lateral_inicio {
        padding: 1em 4em;
    }
   #panel_lateral_inicio #botones_seleccion {
        grid-column: 1;
        grid-row: 2;
        padding: 1em;
        display: flex;
        gap: 0.5em;
    }
</style>
