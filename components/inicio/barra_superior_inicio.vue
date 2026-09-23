<script setup>
    import { ref } from 'vue'
    import CuadroFlotanteInicio from './cuadro_flotante_inicio.vue'

    const cuadroFlotanteInicio = ref(null)

    const llamarCuadroFlotante = () => {
        if (cuadroFlotanteInicio.value) {
            cuadroFlotanteInicio.value.mostrarCuadroFlotante()
        }
    }
</script>

<template>
    <header id="barra_superior">
        <section id="seccion_titulo">
            <img src="../../assets/logos/logo_blanco/MG_BAG_Principal_SinTagline/MG_BAG_Principal_SinTagline.png" alt="Logo BAG Group" width="auto" height="50px" />
            <h1>Portal</h1>
        </section>
    
    <div id="seccion_botones">
        <section id="paginas">
            <BtnMenu texto="Documentos" @click="cambiarDePagina('documentos')" />
            <BtnMenu texto="Plantillas" @click="cambiarDePagina('plantillas')" />
            <BtnMenu texto="Calendarios" @click="cambiarDePagina('calendarios')" />
        </section>
      
        <section>
            <!-- Contenedor relativo para posicionar el cuadro flotante -->
            <div class="contenedor-menu">
                <BtnCircularMenu @click="llamarCuadroFlotante" />
                
                <CuadroFlotanteInicio ref="cuadroFlotanteInicio" />
            </div>
        </section>
    </div>
  </header>
</template>


<script>
  import BtnMenu from '../botones/btn-menu.vue'
  import BtnCircularMenu from '../botones/btn-circular-menu.vue'

  const cambiarDePagina = (pagina) => {
      switch (pagina) {
          case 'documentos': return navigateTo('/portal/inicio');
          case 'plantillas': return navigateTo('/portal/plantillas');
          case 'calendarios': return navigateTo('/portal/calendarios');
      }
  }

  export default {
    name: 'BarraSuperiorInicio',
    components: { 
      BtnMenu, 
      BtnCircularMenu,
      CuadroFlotanteInicio
    }
  }
</script>

<style scoped>
    #barra_superior {
        background-color: var(--negro);
        display: flex;
        flex-direction: row;
        grid-column: 1 / 3;
        grid-row: 1;
        justify-content: space-between;
        align-items: center;
        color: var(--blanco);
    }

    #barra_superior #seccion_titulo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    @media (max-width: 768px) {
        #barra_superior #seccion_titulo h1 {
            display: none;
        }
    }


    #barra_superior #seccion_botones {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 1em;
        min-width: 0;
    }

    #barra_superior #seccion_botones #paginas {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        align-items: center;
        /* 1. Oculta la barra en Chrome, Safari, Edge y Opera */
        &::-webkit-scrollbar {
            display: none;
        }
        /* 2. Oculta la barra en Firefox */
        scrollbar-width: none;
        /* 3. Oculta la barra en Internet Explorer y Edge antiguo */
        -ms-overflow-style: none; 
    }


    .contenedor-menu {
        position: relative; /* Eje de referencia para el cuadro flotante */
        display: inline-block;
    }
</style>
