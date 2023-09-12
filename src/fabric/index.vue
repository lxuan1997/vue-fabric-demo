<script setup>
import { ref, onMounted, provide, markRaw } from 'vue'
import { fabric } from 'fabric'
import { useBasicShapes, useUtil, useSelection, useGuideLines } from './uses/index'
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
    selection: true,
    zoom: 1
  }))
  useGuideLines(canvas.value)
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
  <div class="fabric-canvas">
    <div class="canvas-shape-panel">
      <ShapePanel />
    </div>
    <div class="canvas-playground">
      <canvas id="canvas" />
    </div>
  </div>
</template>

<style scoped>
.fabric-canvas {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.canvas-shape-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.canvas-playground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9
}
</style>
