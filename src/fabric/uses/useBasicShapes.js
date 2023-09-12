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
      // stroke: '#94A684',
      // strokeWidth: 2,
      strokeUniform: true,
      fill: '#AEC3AE'
    })
    canvas.add(rect)
  }

  function addCircle() {
    const circle = new fabric.Circle({
      radius: 42,
      fill: '#A8DF8E',
      left: 100,
      top: 100
    })
    canvas.add(circle)
  }

  function addTriangle() {
    const triangle = new fabric.Triangle({
      width: 64,
      height: 64,
      fill: '#FFBFBF',
      left: 50,
      top: 50
    })
    canvas.add(triangle)
  }
  function addEllipse() {}

  function addLine() {}

  function addImage() {}
  function addPolygon() {}
  function addPolyline() {}
  function addPath() {
    const path = new fabric.Path(
      'M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
    c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
    0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
    c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
    -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
    12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
    -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z',
      {
        left: 100,
        top: 100,
        fill: '#B689C0'
      }
    )
    canvas.add(path)
  }

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
