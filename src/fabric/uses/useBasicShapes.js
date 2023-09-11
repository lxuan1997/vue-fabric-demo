import { fabric } from 'fabric'

export const useBasicShapes = (canvas) => {
  function addText() {
    const text = new fabric.Text('hello world', { left: 100, top: 100 })
    canvas.add(text)
  }
  function addTextbox() {
    const textbox = new fabric.Textbox('hello world', { left: 100, top: 100 })
    canvas.add(textbox)
  }
  function addRect() {
    const rect = new fabric.Rect({
      width: 100,
      height: 80,
      stroke: '#000',
      strokeWidth: 2,
      strokeUniform: true,
      fill: 'rgba(0,0,0,0)',
      backgroundColor: 'rgba(0,0,0,0)'
    })
    canvas.add(rect)
  }
 
  function addEllipse() {}
  function addTriangle() {}
  function addLine() {}
  function addCircle() {}
  function addImage() {}
  function addPolygon() {}
  function addPolyline() {}
  function addPath() {}

  return {
    addText,
    addTextbox,
    addRect,
    addEllipse,
    addTriangle,
    addLine,
    addCircle,
    addImage,
    addPolygon,
    addPolyline,
    addPath
  }
}
