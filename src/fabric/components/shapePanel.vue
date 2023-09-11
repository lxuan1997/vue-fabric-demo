<script setup>
import { inject } from 'vue';

const shapeHandler = inject('shapeHandler')

console.log('shapeHandler', shapeHandler)

</script>

<template>
  <div class="shape-panel">
    <button @click="shapeHandler.addText">Text</button>
    <button @click="shapeHandler.addTextbox">Textbox</button>
    <button @click="shapeHandler.addRect">Rect</button>
  </div>
</template>