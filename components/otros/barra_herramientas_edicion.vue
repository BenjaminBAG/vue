<script setup>
    import { computed } from 'vue'
    import { Table, List, ListOrdered, Quote, CodeXml, Link2, Image, PanelTop, Bold, Heading1, Clapperboard, StickyNote, EyeOff, Workflow } from 'lucide-vue-next'

    const iconos = {
        Table,
        List,
        ListOrdered,
        Quote,
        CodeXml,
        Link2,
        Image,
        PanelTop,
        Bold,
        Heading1,
        Clapperboard,
        StickyNote,
        EyeOff,
        Workflow
    }

    const menus = computed(() => ['Títulos', 'Texto', 'Listas', 'Multimedia', 'Secciones'])

    const herramientas = computed(() => [
        {
            id: 'tabla',
            menu: 'Listas',
            nombre: 'Tabla',
            icono: 'Table',
            insercion: '\n\n| Proyecto | Estado |\n| :-- | :-- |\n| Portal 2 | En progreso |\n| Documentación | Revisar |'
        },
        {
            id: 'lista-no-ordenada',
            menu: 'Listas',
            nombre: 'Lista no ordenada',
            icono: 'List',
            insercion: '\n\n- Revisión del contenido\n- Ajuste del diseño\n- Publicación final'
        },
        {
            id: 'lista-ordenada',
            menu: 'Listas',
            nombre: 'Lista ordenada',
            icono: 'ListOrdered',
            insercion: '\n\n1. Abrir el documento\n2. Editar el texto\n3. Guardar cambios'
        },
        {
            id: 'cita',
            menu: 'Secciones',
            nombre: 'Cita',
            icono: 'Quote',
            insercion: '\n\n> La documentación clara evita errores y acelera la entrega.'
        },
        {
            id: 'bloque-codigo',
            menu: 'Secciones',
            nombre: 'Bloque de código',
            icono: 'CodeXml',
            insercion: '\n\n```markdown\n# Portada\n## Sección principal\nTexto de ejemplo\n```'
        },
        {
            id: 'link',
            menu: 'Texto',
            nombre: 'Enlace',
            icono: 'Link2',
            insercion: '\n\n[Portal de ejemplo](https://www.example.com)'
        },
        {
            id: 'imagen',
            menu: 'Multimedia',
            nombre: 'Imagen',
            icono: 'Image',
            insercion: '\n\n![Logo del proyecto](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80)'
        },
        {
            id: 'callout',
            menu: 'Secciones',
            nombre: 'Callout',
            icono: 'PanelTop',
            insercion: '\n\n> [!WARNING]\n> Revisa antes de publicar este contenido.'
        },
        {
            id: 'texto-negrita',
            menu: 'Texto',
            nombre: 'Negrita',
            icono: 'Bold',
            insercion: '**Texto destacado**'
        },
        {
            id: 'h1',
            menu: 'Títulos',
            nombre: 'Título H1',
            icono: 'Heading1',
            insercion: '\n\n# Título principal'
        },
        {
            id: 'video',
            menu: 'Multimedia',
            nombre: 'Video',
            icono: 'Clapperboard',
            insercion: '\n\n```video\nhttps://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4\n```'
        },
        {
            id: 'nota-al-pie',
            menu: 'Texto',
            nombre: 'Nota al pie',
            icono: 'StickyNote',
            insercion: '\n\nTexto con referencia.[^1]\n\n[^1]: Esta es la nota al pie del contenido.'
        },
        {
            id: 'detalles',
            menu: 'Secciones',
            nombre: 'Detalles',
            icono: 'EyeOff',
            insercion: '\n\n:::details Ver más\nAquí va el contenido oculto.\n:::'
        },
        {
            id: 'mermaid',
            menu: 'Multimedia',
            nombre: 'Diagrama Mermaid',
            icono: 'Workflow',
            insercion: '\n\n```mermaid\nflowchart TD\nA[Inicio] --> B[Procesar]\nB --> C[Fin]\n```'
        },
        {
            id: 'icono-inline',
            menu: 'Multimedia',
            nombre: 'Icono inline',
            icono: 'Bold',
            insercion: '\n\nEste contenido incluye un aviso :warning: importante.'
        }
    ])

    const emit = defineEmits(['insertar-texto'])

    const insertarTexto = (texto) => {
        emit('insertar-texto', texto)
    }
</script>

<template>
    <div id="barra-herramientas-edicion">
      <div>
        <button v-for="item in menus">
            {{ item }}
        </button>
      </div>
      <div>
        <button
            v-for="herramienta in herramientas"
            :key="herramienta.id"
            type="button"
            :title="herramienta.nombre"
            @click="insertarTexto(herramienta.insercion)"
        >
            <component :is="iconos[herramienta.icono]" />
        </button>
      </div>
    </div>
</template>

<style scoped>
    #barra-herramientas-edicion {
        width: 100%;
        background-color: var(--beige);
        padding: 0.2em;
        display: flex;
        gap: 0.2em;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: column;
    }
    #barra-herramientas-edicion div button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        color: var(--negro);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5em;
        border-radius: 8px;
        transition: background-color 0.2s ease, transform 0.2s ease;
        display: inline;
        font-size: 0.8em;
    }
    #barra-herramientas-edicion div button:hover {
        background-color: rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
    }
    #barra-herramientas-edicion div button svg {
        width: 1.2em;
        height: 1.2em;
    }
</style>