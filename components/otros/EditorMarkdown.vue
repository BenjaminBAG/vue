<script setup>
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
    import { indentLess, defaultKeymap, history, historyKeymap } from '@codemirror/commands'
    import { markdown } from '@codemirror/lang-markdown'
    import { defaultHighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
    import { EditorState } from '@codemirror/state'
    import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view'

    const props = defineProps({
        modelValue: {
            type: String,
            default: ''
        }
    })

    const emit = defineEmits(['update:modelValue'])
    const editorElement = ref(null)
    let editorView

    const insertarIndentacion = (view) => {
        const { from, to } = view.state.selection.main
        view.dispatch({
            changes: { from, to, insert: '  ' },
            selection: { anchor: from + 2 },
            userEvent: 'input'
        })
        return true
    }

    const crearEstado = (documento) => EditorState.create({
        doc: documento,
        extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            history(),
            markdown(),
            syntaxHighlighting(defaultHighlightStyle),
            indentUnit.of('  '),
            keymap.of([
                { key: 'Tab', run: insertarIndentacion },
                { key: 'Shift-Tab', run: indentLess },
                ...defaultKeymap,
                ...historyKeymap
            ]),
            EditorView.lineWrapping,
            EditorView.updateListener.of(({ docChanged, state }) => {
                if (docChanged) emit('update:modelValue', state.doc.toString())
            }),
            EditorView.theme({
                '&': {
                    boxSizing: 'border-box',
                    width: '100%',
                    minHeight: '300px',
                    color: 'var(--negro)',
                    backgroundColor: 'var(--blanco)',
                    border: 'none',
                    borderLeft: '2px solid transparent',
                    borderRadius: '10px 10px 10px 10px',
                    fontSize: '1em',
                    transition: 'border-radius 0.3s',
                },
                '&.cm-focused': {
                    outline: 'none',
                    borderLeftColor: 'var(--azul)',
                },
                '.cm-scroller': {
                    minHeight: '300px',
                },
                '.cm-scroller, .cm-scroller *': {
                    fontFamily: 'var(--fuente-mono)',
                },
                '.cm-content': {
                    minHeight: '268px',
                    padding: '1em 1em 1em 0'
                },
                '.cm-gutters': {
                    color: 'var(--negro)',
                    backgroundColor: 'var(--blanco)',
                    border: 'none'
                },
                '.cm-activeLine, .cm-activeLineGutter': {
                    backgroundColor: 'color-mix(in srgb, var(--azul) 8%, transparent)'
                },
                '.cm-cursor, .cm-dropCursor': {
                    borderLeftColor: 'var(--azul)'
                },
                '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
                    backgroundColor: 'color-mix(in srgb, var(--azul) 24%, transparent)'
                },
                '.cm-lineNumbers .cm-gutterElement': {
                    color: 'var(--gris)',
                    fontSize: '0.6em',
                    fontVariantNumeric: 'tabular-nums',
                },
            })
        ]
    })

    onMounted(() => {
        editorView = new EditorView({
            state: crearEstado(props.modelValue),
            parent: editorElement.value
        })
    })

    watch(
        () => props.modelValue,
        (value) => {
            if (!editorView || editorView.state.doc.toString() === value) return
            editorView.setState(crearEstado(value))
        }
    )

    const insertarTexto = (texto) => {
        if (!editorView) {
            emit('update:modelValue', `${props.modelValue}${texto}`)
            return
        }

        const { from, to } = editorView.state.selection.main
        editorView.dispatch({
            changes: { from, to, insert: texto },
            selection: { anchor: from + texto.length },
            userEvent: 'input'
        })
        editorView.focus()
    }

    defineExpose({ insertarTexto })

    onBeforeUnmount(() => editorView?.destroy())
</script>

<template>
    <div ref="editorElement" class="editor-markdown"></div>
</template>

<style scoped>
    .editor-markdown {
        width: 100%;
        min-width: 0;
        border-radius: 10px;
    }
</style>