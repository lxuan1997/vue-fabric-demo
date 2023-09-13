<script setup>
import { inject } from 'vue';
const shapeHandler = inject('shapeHandler');
</script>


<template>
  <div class="shape-panel">
    <!-- <button @click="shapeHandler.addText">Text</button> -->
    <button @click="shapeHandler.addTextbox">Textbox</button>
    <button @click="shapeHandler.addRect">Rect</button>
    <button @click="shapeHandler.addCircle">Circle</button>
    <button @click="shapeHandler.addTriangle">Triangle</button>
    <button @click="shapeHandler.addPath">Path</button>
    <button @click="shapeHandler.addEllipse">Ellipse</button>
    <button @click="shapeHandler.addLine">Line</button>
    <button @click="shapeHandler.addPolyline">Polyline</button>
    <button @click="shapeHandler.addPolygon">Polygon</button>
    <button @click="shapeHandler.addImage">Image</button>
  </div>
</template>