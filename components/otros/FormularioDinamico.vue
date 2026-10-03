<script setup>
    import { computed, onMounted } from 'vue'
    import { Plus, Trash2 } from 'lucide-vue-next'
    import CampoFormulario from './CampoFormulario.vue'

    const props = defineProps({
        campos: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: Object,
            default: () => ({})
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const claveDe = (campo) => campo.clave || campo.id
    const esVisible = (campo) => {
        if (!campo.visibleSi) return true
        const valor = props.modelValue?.[campo.visibleSi.clave]
        return valor === campo.visibleSi.valor
    }
    const camposSimples = computed(() => props.campos.filter((campo) => !campo.esTabla && esVisible(campo)))
    const gruposTabla = computed(() => {
        const grupos = new Map()

        props.campos.filter((campo) => campo.esTabla).forEach((campo) => {
            const nombre = String(campo.nombreTabla ?? '').trim() || 'Tabla'
            const id = nombre.toLocaleLowerCase()
            if (!grupos.has(id)) grupos.set(id, { id, nombre, campos: [] })
            grupos.get(id).campos.push(campo)
        })

        return [...grupos.values()]
    })

    const filasDe = (grupo) => {
        const filas = props.modelValue?.filasTablas?.[grupo.id]
        return Array.isArray(filas) ? filas : []
    }

    const actualizarCampo = (campo, valor) => {
        emit('update:modelValue', {
            ...props.modelValue,
            [claveDe(campo)]: valor
        })
    }

    const crearFila = (grupo) => Object.fromEntries(grupo.campos.map((campo) => [claveDe(campo), '']))

    const actualizarFilas = (grupo, filas) => {
        emit('update:modelValue', {
            ...props.modelValue,
            filasTablas: {
                ...props.modelValue.filasTablas,
                [grupo.id]: filas
            }
        })
    }

    const agregarFila = (grupo) => {
        actualizarFilas(grupo, [...filasDe(grupo), crearFila(grupo)])
    }

    const eliminarFila = (grupo, indice) => {
        const filas = filasDe(grupo)
        if (filas.length <= 1) return
        actualizarFilas(grupo, filas.filter((_, index) => index !== indice))
    }

    const actualizarCelda = (grupo, indice, campo, valor) => {
        const filasActualizadas = filasDe(grupo).map((fila, index) =>
            index === indice ? { ...fila, [claveDe(campo)]: valor } : fila
        )
        actualizarFilas(grupo, filasActualizadas)
    }

    onMounted(() => {
        const filasTablas = { ...props.modelValue.filasTablas }
        let hayCambios = false

        gruposTabla.value.forEach((grupo) => {
            if (!Array.isArray(filasTablas[grupo.id]) || !filasTablas[grupo.id].length) {
                filasTablas[grupo.id] = [crearFila(grupo)]
                hayCambios = true
            }
        })

        if (hayCambios) emit('update:modelValue', { ...props.modelValue, filasTablas })
    })
</script>

<template>
    <div class="formulario-dinamico">
        <CampoFormulario
            v-for="campo in camposSimples"
            :key="campo.id"
            :campo="campo"
            :id-control="`campo-${campo.id}`"
            :model-value="modelValue[claveDe(campo)] ?? campo.valorPredeterminado ?? ''"
            @update:model-value="actualizarCampo(campo, $event)"
        />

        <section v-for="grupo in gruposTabla" :key="grupo.id" class="tabla-repetible">
            <header>
            <h3>{{ grupo.nombre }}</h3>
            <button type="button" class="agregar-fila" @click="agregarFila(grupo)">
                    <Plus aria-hidden="true" />
                    <span>Agregar fila</span>
                </button>
            </header>
            <div class="desbordamiento-tabla">
                <table>
                    <thead>
                        <tr>
                            <th v-for="campo in grupo.campos" :key="campo.id" scope="col">
                                {{ campo.nombre }}
                            </th>
                            <th scope="col" aria-label="Acciones"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(fila, indice) in filasDe(grupo)" :key="indice">
                            <td v-for="campo in grupo.campos" :key="campo.id">
                                <CampoFormulario
                                    :campo="campo"
                                    :id-control="`campo-${campo.id}-fila-${indice}`"
                                    :aria-label="`${campo.nombre}, fila ${indice + 1}`"
                                    :mostrar-etiqueta="false"
                                    :model-value="fila[claveDe(campo)] ?? ''"
                                    @update:model-value="actualizarCelda(grupo, indice, campo, $event)"
                                />
                            </td>
                            <td class="acciones-fila">
                                <button
                                    v-if="filasDe(grupo).length > 1"
                                    type="button"
                                    :aria-label="`Eliminar fila ${indice + 1} de ${grupo.nombre}`"
                                    :title="`Eliminar fila ${indice + 1}`"
                                    @click="eliminarFila(grupo, indice)"
                                >
                                    <Trash2 aria-hidden="true" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<style scoped>
    .formulario-dinamico {
        display: grid;
        gap: 0.75em;
    }

    .tabla-repetible {
        display: grid;
        gap: 0.75em;
    }

    .tabla-repetible > header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75em;
    }

    .tabla-repetible h3 {
        margin: 0;
    }

    .agregar-fila,
    .acciones-fila button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4em;
        min-height: 2.5em;
        padding: 0.45em 0.7em;
        border: 0;
        border-radius: 6px;
        background: var(--blanco);
        color: var(--negro);
        font: inherit;
        cursor: pointer;
    }

    .agregar-fila svg,
    .acciones-fila svg {
        width: 1.1em;
        height: 1.1em;
    }

    .desbordamiento-tabla {
        max-width: 100%;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 0.5em;
        text-align: left;
        vertical-align: top;
    }

    td :deep(input),
    td :deep(select),
    td :deep(textarea) {
        min-width: 9em;
    }

    .acciones-fila {
        width: 2.5em;
    }
</style>