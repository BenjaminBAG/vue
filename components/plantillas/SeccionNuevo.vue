<script setup>
    import { onMounted, ref, watch } from 'vue'
    import { Plus, Trash2, ClipboardPlus } from 'lucide-vue-next'
    import FormularioDinamico from '../otros/FormularioDinamico.vue'
    import BtnPrincipal from '../botones/BtnPrincipal.vue'
    import TituloSeccion from '../otros/TituloSeccion.vue'
    import { useSheets } from '../../composables/useSheets.ts'
    import { buildEntity } from '../../composables/useSheetData.ts'

    const emit = defineEmits(['plantilla-guardada', 'url-documento-cambiada'])
    const { getTable, saveRow, saveRows } = useSheets()
    const etiquetas = ref([])
    const datosPlantilla = ref({})
    const claves = ref([])
    const guardando = ref(false)
    const mensaje = ref('')
    const error = ref(false)
    const idPlantillaPendiente = ref('')

    watch(
        () => datosPlantilla.value.urlDocumento,
        (urlDocumento) => emit('url-documento-cambiada', String(urlDocumento ?? '')),
        { immediate: true }
    )

    const camposPlantilla = [
        { id: 'nombre', nombre: 'Nombre de la plantilla', tipo: 'text', requerido: true },
        { id: 'tipo', nombre: 'Tipo', tipo: 'text', placeholder: 'Ej. contrato, informe' },
        { id: 'urlDocumento', nombre: 'URL del documento', tipo: 'url', requerido: true },
        { id: 'idEtiqueta', nombre: 'Etiqueta', tipo: 'select', opciones: [] }
    ]

    const tiposClave = [
        { value: 'texto', label: 'Texto' },
        { value: 'numero', label: 'Número' },
        { value: 'moneda', label: 'Moneda' },
        { value: 'fecha', label: 'Fecha' },
        { value: 'imagen', label: 'Imagen (URL)' },
        { value: 'documento', label: 'Documento (URL)' },
        { value: 'texto_largo', label: 'Texto largo' }
    ]

    const nuevaClave = () => ({
        key: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        valores: { nombre: '', tipo: 'texto', placeholder: '', esTabla: false, nombreTabla: '' }
    })

    const camposClave = (key) => [
        { id: `${key}-nombre`, clave: 'nombre', nombre: 'Nombre de la clave', tipo: 'text', requerido: true },
        { id: `${key}-tipo`, clave: 'tipo', nombre: 'Tipo de campo', tipo: 'select', requerido: true, opciones: tiposClave },
        { id: `${key}-placeholder`, clave: 'placeholder', nombre: 'Texto de ayuda', tipo: 'text' },
        { id: `${key}-esTabla`, clave: 'esTabla', nombre: 'Columna repetible en tabla', tipo: 'checkbox' },
        {
            id: `${key}-nombreTabla`,
            clave: 'nombreTabla',
            nombre: 'Nombre de la tabla',
            tipo: 'text',
            placeholder: 'Ej. Productos',
            requerido: true,
            visibleSi: { clave: 'esTabla', valor: true }
        }
    ]

    const agregarClave = () => claves.value.push(nuevaClave())
    const quitarClave = (key) => {
        claves.value = claves.value.filter((clave) => clave.key !== key)
    }

    onMounted(async () => {
        try {
            const filas = await getTable('etiquetas')
            etiquetas.value = filas
                .map((item, index) => buildEntity(item, { id: ['id'], nombre: ['nombre'] }, index))
                .filter((item) => item.nombre)
            camposPlantilla[3].opciones = etiquetas.value.map((item) => ({ value: item.id, label: item.nombre }))
        } catch (loadError) {
            console.error('Error al cargar las etiquetas de plantillas:', loadError)
        }
    })

    const guardarPlantilla = async () => {
        mensaje.value = ''
        error.value = false
        guardando.value = true

        try {
            const id = idPlantillaPendiente.value || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
            if (!idPlantillaPendiente.value) {
                await saveRow('plantillas', {
                    id,
                    nombre: datosPlantilla.value.nombre,
                    tipo: datosPlantilla.value.tipo,
                    url_documento: datosPlantilla.value.urlDocumento,
                    id_etiqueta: datosPlantilla.value.idEtiqueta
                })
                idPlantillaPendiente.value = id
            }

            const clavesValidas = claves.value
                .map((clave) => clave.valores)
                .filter((clave) => String(clave.nombre ?? '').trim())

            if (clavesValidas.length) {
                await saveRows('claves_plantillas', clavesValidas.map((clave) => ({
                    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
                    nombre: String(clave.nombre).trim(),
                    tipo: clave.tipo || 'texto',
                    placeholder: clave.placeholder || '',
                    es_tabla: Boolean(clave.esTabla),
                    nombre_tabla: clave.esTabla ? String(clave.nombreTabla ?? '').trim() : '',
                    id_plantilla: id
                })))
            }

            mensaje.value = 'Plantilla guardada correctamente.'
            emit('plantilla-guardada', {
                id,
                nombre: datosPlantilla.value.nombre,
                tipo: datosPlantilla.value.tipo,
                urlDocumento: datosPlantilla.value.urlDocumento,
                idEtiqueta: datosPlantilla.value.idEtiqueta
            })
            datosPlantilla.value = {}
            idPlantillaPendiente.value = ''
            claves.value = []
            agregarClave()
        } catch (saveError) {
            console.error('Error al guardar la plantilla:', saveError)
            error.value = true
            mensaje.value = idPlantillaPendiente.value
                ? 'La plantilla ya se guardó, pero no se pudieron guardar sus claves. Corrige el problema y vuelve a intentarlo.'
                : 'No se pudo guardar la plantilla. Comprueba la conexión con Google Sheets.'
        } finally {
            guardando.value = false
        }
    }

    agregarClave()
</script>

<template>
    <section class="seccion-nueva">
        <TituloSeccion :icono="ClipboardPlus" titulo="Nueva plantilla" />
        <form @submit.prevent="guardarPlantilla">
            <FormularioDinamico v-model="datosPlantilla" :campos="camposPlantilla" />

            <div class="encabezado-claves">
                <h3>Claves de la plantilla</h3>
                <button type="button" aria-label="Agregar clave" title="Agregar clave" @click="agregarClave">
                    <Plus />
                </button>
            </div>

            <section v-for="(clave, indice) in claves" :key="clave.key" class="clave-configuracion">
                <div class="encabezado-clave">
                    <h4>Clave {{ indice + 1 }}</h4>
                    <button
                        v-if="claves.length > 1"
                        type="button"
                        :aria-label="`Eliminar clave ${indice + 1}`"
                        title="Eliminar clave"
                        @click="quitarClave(clave.key)"
                    >
                        <Trash2 />
                    </button>
                </div>
                <FormularioDinamico v-model="clave.valores" :campos="camposClave(clave.key)" />
            </section>

            <BtnPrincipal :texto="guardando ? 'Guardando...' : 'Guardar plantilla'" />
            <p v-if="mensaje" :class="{ error }" role="status">{{ mensaje }}</p>
        </form>
    </section>
</template>

<style scoped>
    .seccion-nueva {
        padding: 2em 0;
    }

    .seccion-nueva form {
        display: grid;
        gap: 1.25em;
    }

    .encabezado-claves,
    .encabezado-clave {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75em;
    }

    .clave-configuracion {
        padding: 1em 0;
        border-top: 1px solid color-mix(in srgb, var(--negro), transparent 75%);
    }

    .encabezado-claves h3,
    .encabezado-clave h4 {
        margin: 0;
    }

    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5em;
        height: 2.5em;
        border: 0;
        border-radius: 50%;
        background: var(--blanco);
        color: var(--negro);
        cursor: pointer;
    }

    button svg {
        width: 1.2em;
        height: 1.2em;
    }

    .error {
        color: #a12622;
    }
</style>