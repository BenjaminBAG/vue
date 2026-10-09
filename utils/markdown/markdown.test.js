import test from 'node:test';
import assert from 'node:assert/strict';
import { procesarMarkdown } from './markdown.js';

test('extrae encabezados HTML y conserva sus niveles e IDs', () => {
  const titulos = [];

  procesarMarkdown('<h1 id="introduccion">Introducción</h1>\n<h2 id="objetivo">Objetivo</h2>', (lista) => {
    titulos.push(...lista);
  });

  assert.deepEqual(titulos, [
    { texto: 'Introducción', slug: 'introduccion', nivel: 1 },
    { texto: 'Objetivo', slug: 'objetivo', nivel: 2 }
  ]);
});

test('renderiza iconos en los títulos y el contenido de los callouts', () => {
  const html = procesarMarkdown('::: warning :check:\nContenido :star:\n:::');

  assert.match(html, /<p class="md-container__title"><img class="md-icon md-icon--check"/);
  assert.match(html, /<p class="md-p">Contenido <img class="md-icon md-icon--star"/);
});
