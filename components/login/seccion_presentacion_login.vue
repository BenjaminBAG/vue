<template>
    <div id="seccion_presentacion_login">
        <h2>Portal Empresarial</h2>
        <p>Tu espacio para aprender de BAG Group</p>
        <div class="contenedor_tarjetas">
            <div v-for="item in tarjetas">
                <TarjetaInfo :icono="item.icono" :titulo="item.titulo" :descripcion="item.descripcion" />
            </div>
        </div>
    </div>
</template>

<script>
    import TarjetaInfo from './tarjeta_info.vue'

    export default {
      name: 'SeccionPresentacionLogin',
      components: {
        TarjetaInfo
      },
      data() {
        return {
          tarjetas: [
            {icono: 'File', titulo: 'Documentos', descripcion: 'Accede a documentación oficial como manuales e instructivos.'},
            {icono: 'Box', titulo: 'Plantillas', descripcion: 'Genera documentos a partir de plantillas aprobadas.'},
            {icono: 'File', titulo: 'Calendarios', descripcion: 'Consulta eventos del calendario empresarial y planifica tu día a día.'}
          ]
        }
      }
    }
</script>

<style scoped>
    #seccion_presentacion_login {
        grid-column: 2;
        grid-row: 2;
        width: calc(100% - padding);
        height: calc(100% - padding);
        padding: 2em;
        background-color: var(--blanco);
        background-image: url('../../assets/imagenes/BAG-G_Textura.png');
        background-position: bottom left;
        background-repeat: no-repeat;
        background-size: 50% auto;
      }
      @media (max-width: 768px) {
        #seccion_presentacion_login {
          display: none;
        }
      }
      .contenedor_tarjetas {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
        gap: 20px;
    }
    h2, p {
      color: var(--gris);
    }
</style>
