<script setup>
    const props = defineProps({
        campo: {
            type: Object,
            required: true
        },
        modelValue: {
            default: ''
        },
        idControl: {
            type: String,
            required: true
        },
        ariaLabel: {
            type: String,
            default: ''
        },
        mostrarEtiqueta: {
            type: Boolean,
            default: true
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const tipoDeControl = (campo) => {
        const tipo = String(campo.tipo ?? '').trim().toLowerCase()
        if (['texto_largo', 'texto largo', 'long_text', 'textarea'].includes(tipo)) return 'textarea'
        if (['moneda', 'currency'].includes(tipo)) return 'number'
        if (['imagen', 'image', 'documento', 'document', 'url', 'enlace'].includes(tipo)) return 'url'
        if (['numero', 'number'].includes(tipo)) return 'number'
        if (['fecha', 'date'].includes(tipo)) return 'date'
        if (['booleano', 'boolean', 'checkbox'].includes(tipo)) return 'checkbox'
        if (['seleccion', 'select'].includes(tipo)) return 'select'

        return ['text', 'email', 'tel', 'time', 'datetime-local'].includes(tipo) ? tipo : 'text'
    }

    const placeholderDe = (campo) => {
        if (campo.placeholder) return campo.placeholder
        const tipo = String(campo.tipo ?? '').trim().toLowerCase()
        if (['imagen', 'image'].includes(tipo)) return 'URL de la imagen'
        if (['documento', 'document'].includes(tipo)) return 'URL del documento'
        return ''
    }

    const actualizar = (event) => {
        const valor = tipoDeControl(props.campo) === 'checkbox'
            ? event.target.checked
            : event.target.value
        emit('update:modelValue', valor)
    }
</script>

<template>
    <div class="campo-dinamico">
        <label
            v-if="mostrarEtiqueta && tipoDeControl(campo) !== 'checkbox'"
            :for="idControl"
        >
            {{ campo.nombre }}
        </label>
        <label v-if="tipoDeControl(campo) === 'checkbox'" class="campo-checkbox" :for="idControl">
            <input
                :id="idControl"
                type="checkbox"
                :aria-label="ariaLabel || campo.nombre"
                :checked="Boolean(modelValue)"
                @change="actualizar"
            />
            {{ campo.placeholder || campo.nombre || 'Sí' }}
        </label>
        <div v-if="tipoDeControl(campo) !== 'checkbox'" class="contenedor-control">
                <textarea
                    v-if="tipoDeControl(campo) === 'textarea'"
                    :id="idControl"
                    :aria-label="ariaLabel || campo.nombre"
                    :value="modelValue"
                    :placeholder="placeholderDe(campo)"
                    :required="campo.requerido"
                    rows="4"
                    @input="actualizar"
                />
                <select
                    v-else-if="tipoDeControl(campo) === 'select'"
                    :id="idControl"
                    :aria-label="ariaLabel || campo.nombre"
                    :value="modelValue"
                    :required="campo.requerido"
                    @change="actualizar"
                >
                    <option value="">Selecciona una opción</option>
                    <option v-for="opcion in campo.opciones || []" :key="opcion.value" :value="opcion.value">
                        {{ opcion.label }}
                    </option>
                </select>
                <input
                    v-else
                    :id="idControl"
                    :type="tipoDeControl(campo)"
                    :step="['moneda', 'currency'].includes(String(campo.tipo ?? '').toLowerCase()) ? '0.01' : undefined"
                    :aria-label="ariaLabel || campo.nombre"
                    :value="modelValue"
                    :placeholder="placeholderDe(campo)"
                    :required="campo.requerido"
                    @input="actualizar"
                />
        </div>
    </div>
</template>

<style scoped>
    .campo-dinamico > label:first-child {
        display: block;
        margin-left: 0.5em;
    }

    .contenedor-control {
        position: relative;
        display: inline-block;
        width: 100%;
        max-width: 400px;
        margin: 0.5em 0 1em;
    }

    .contenedor-control::after {
        content: '';
        position: absolute;
        left: 8px;
        top: 50%;
        width: 0.7em;
        height: 0.7em;
        background-color: var(--azul);
        transform: translateY(-50%) scale(0);
        transition: transform 0.25s ease;
        pointer-events: none;
    }

    .contenedor-control:focus-within::after {
        transform: translateY(-50%) scale(1);
    }

    .contenedor-control input,
    .contenedor-control select,
    .contenedor-control textarea {
        box-sizing: border-box;
        width: 100%;
        padding: 0.5em 0.5em 0.5em 1.8em;
        margin: 0;
        border: 0;
        border-radius: 10px;
        background: var(--blanco);
        color: var(--negro);
        font: inherit;
        outline: none;
        display: block;
    }

    .contenedor-control textarea {
        min-height: 7em;
        resize: vertical;
    }

    .campo-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }
</style>