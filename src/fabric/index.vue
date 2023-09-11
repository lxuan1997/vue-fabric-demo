<script setup>
import { ref, onMounted, provide, markRaw } from 'vue'
import { fabric } from 'fabric'
import { useBasicShapes, useUtil, useSelection } from './uses/index'
import ShapePanel from './components/shapePanel.vue';

const canvas = ref({})
const shapeHandler = ref({})
const util = ref({})
const selection = ref({})

function canvasInit() {
  canvas.value = markRaw(new fabric.Canvas('canvas', {
    width: window.innerWidth,
    height: window.innerHeight,
    // 保持画布层级关系
    preserveObjectStacking: true,
    // 选框
    selection: false,
    zoom: 1
  }))
  shapeHandler.value = useBasicShapes(canvas.value)
  util.value = useUtil(canvas.value)
  selection.value = useSelection(canvas.value)
}

provide('shapeHandler', shapeHandler)
provide('util', util)
provide('selection', selection)

onMounted(() => {
  canvasInit()
})


</script>
<template>
  <div class="canvas-shape-panel">
    <ShapePanel />
  </div>
  <div class="canvas-wrapper">
    <canvas id="canvas" />
  </div>
</template>

<style scoped></style>
