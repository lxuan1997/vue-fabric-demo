/**
 * fabric basic shapes
 */
import { fabric } from 'fabric'

const IMAGE_INITAL_SIZE = 200

export const useBasicShapes = (canvas) => {
  function addText() {
    const text = new fabric.Text('hello world', { left: 100, top: 100 })
    canvas.add(text)
  }
  function addTextbox() {
    const textbox = new fabric.Textbox('hello world', {
      left: 100,
      top: 100
    })
    canvas.add(textbox)
  }
  function addRect() {
    const rect = new fabric.Rect({
      width: 100,
      height: 80,
      rx: 4,
      ry: 4,
      stroke: '#94A684',
      strokeWidth: 2,
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
  function addEllipse() {
    const ellipse = new fabric.Ellipse({
      rx: 100,
      ry: 50,
      fill: '#FFBFBF',
      left: 50,
      top: 50
    })
    canvas.add(ellipse)
  }

  function addLine() {
    const line = new fabric.Line([20, 20, 100, 100], {
      stroke: '#96C291',
      strokeWidth: 2
    })
    canvas.add(line)
  }

  function addImage() {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const fileList = e.target.files
      const file = fileList[0]
      // console.log('input on change file', file)
      const reader = new FileReader()
      reader.onload = () => {
        const url = reader.result
        // console.log('url', url)
        addImageFromUrl(url)
      }
      reader.readAsDataURL(file)
    }
    input.display = 'none'
    input.click()
  }

  function addPolyline() {
    const polyline = new fabric.Polyline(
      [
        { x: 10, y: 10 },
        { x: 50, y: 10 },
        { x: 60, y: 50 },
        { x: 10, y: 50 }
      ],
      {
        stroke: '#96C291',
        strokeWidth: 2,
        fill: null,
        left: 100,
        top: 100
      }
    )
    canvas.add(polyline)
  }

  function addPolygon() {
    const polygon = new fabric.Polyline(
      [
        { x: 10, y: 10 },
        { x: 50, y: 10 },
        { x: 60, y: 50 },
        { x: 0, y: 50 },
        { x: 10, y: 10 }
      ],
      {
        stroke: null,
        strokeWidth: 0,
        strokeLineCap: 'butt',
        fill: '#FFBFBF',
        left: 100,
        top: 100
      }
    )
    canvas.add(polygon)
  }
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

  // image from url
  function addImageFromUrl(url) {
    fabric.Image.fromURL(url, (image) => {
      const { width } = image
      const initialScale = IMAGE_INITAL_SIZE / width
      image.set({
        scaleX: initialScale,
        scaleY: initialScale
      })
      canvas.add(image)
    })
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
