<template>
    <div id="panel_central_plantilla">
        <iframe
            v-if="idPlantilla"
            id="contenedor_documento" 
            :src="'https://docs.google.com/document/d/' + idPlantilla + '/preview'"
            frameborder="0"
            >
        </iframe>
        <p v-else id="mensaje_sin_documento">Selecciona una plantilla para ver el documento.</p>
    </div>
</template>

<script>
    import { getGoogleDriveId } from '../../utils/googleDrive'

    export default {
        name: 'PanelCentralPlantillas',
        props: {
            documento: {
                type: Object,
                default: () => ({})
            },
            documentoEnEdicion: {
                type: String,
                default: ''
            },
            vistaActiva: {
                type: String,
                default: 'selector'
            }
        },
        computed: {
            idPlantilla() {
                const value = this.vistaActiva === 'nuevo'
                    ? this.documentoEnEdicion
                    : this.documento?.idDriveDocumento || this.documento?.urlDocumento || this.documentoEnEdicion
                return getGoogleDriveId(value)
            },
        }
    }
</script>

<style scoped>
    #panel_central_plantilla {
        grid-column: 2;
        grid-row: 2;
        padding: 2em;
        #contenedor_documento {
            width: 100%;
            max-width: 100%;
            min-height: calc(100vh - 10em);
            padding: 0;
            box-shadow: 0 0 0.5em 0.2em var(--beige);
            background-color: var(--blanco);
            overflow: auto;
        }
        #mensaje_sin_documento {
            grid-column: 2;
            grid-row: 2;
            align-self: center;
            justify-self: center;
        }
    }
    @media (max-width: 768px) {
        #panel_central_plantilla {
            grid-column: 1 / 3;
            padding: 0;
            #contenedor_documento {
                box-shadow: none;
            }
        }
    }
</style>
