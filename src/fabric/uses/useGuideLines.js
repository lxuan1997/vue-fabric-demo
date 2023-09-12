/**
 * 辅助对齐线
 * 官方解决方案：https://github.com/fabricjs/fabric.js/tree/master/lib
 * 缩放bug修复：https://stackoverflow.com/questions/62906060/fabric-js-snapping-guidelines-not-correctly-positioned-when-zoomed
 */
import {fabric} from 'fabric'


const CENTER_LINE_COLOR = '#1D5D9B'
const CENTER_LINE_WIDTH = 1
const CENTER_LINE_DASH = false

const ALIGNING_LINE_COLOR = '#75C2F6'
const ALIGNING_LINE_WIDTH = 2
const ALIGNING_LINE_DASH = true

/**
 * Augments canvas by assigning to `onObjectMove` and `onAfterRender`.
 * This kind of sucks because other code using those methods will stop functioning.
 * Need to fix it by replacing callbacks with pub/sub kind of subscription model.
 * (or maybe use existing fabric.util.fire/observe (if it won't be too slow))
 */
function initCenteringGuidelines(canvas) {
    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const canvasWidthCenter = canvasWidth / 2
    const canvasHeightCenter = canvasHeight / 2
    const canvasWidthCenterMap = {}
    const canvasHeightCenterMap = {}
    const centerLineMargin = 4
    const centerLineColor = CENTER_LINE_COLOR
    const centerLineWidth = CENTER_LINE_WIDTH
    const ctx = canvas.getSelectionContext()
    let viewportTransform = {}

    for (let i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
        canvasWidthCenterMap[Math.round(i)] = true
    }
    for (let i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
        canvasHeightCenterMap[Math.round(i)] = true
    }

    function showVerticalCenterLine() {
        showCenterLine(
            canvasWidthCenter + 0.5,
            0,
            canvasWidthCenter + 0.5,
            canvasHeight
        )
    }

    function showHorizontalCenterLine() {
        showCenterLine(
            0,
            canvasHeightCenter + 0.5,
            canvasWidth,
            canvasHeightCenter + 0.5
        )
    }

    function showCenterLine(x1, y1, x2, y2) {
        ctx.save()
        ctx.strokeStyle = centerLineColor
        CENTER_LINE_DASH && ctx.setLineDash([5])
        ctx.lineWidth = centerLineWidth
        ctx.beginPath()
        ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3])
        ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3])
        ctx.stroke()
        ctx.restore()
    }

    const afterRenderActions = []
    let isInVerticalCenter
    let isInHorizontalCenter

    canvas.on('mouse:down', function () {
        viewportTransform = canvas.viewportTransform
    })

    canvas.on('object:moving', function (e) {
        const object = e.target
        const objectCenter = object.getCenterPoint()
        const transform = canvas._currentTransform

        if (!transform) return

        isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap
        isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap

        if (isInHorizontalCenter || isInVerticalCenter) {
            object.setPositionByOrigin(
                new fabric.Point(
                    isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
                    isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
                ),
                'center',
                'center'
            )
        }
    })

    canvas.on('before:render', function () {
        canvas.contextTop && canvas.clearContext(canvas.contextTop)
    })

    canvas.on('after:render', function () {
        if (isInVerticalCenter) {
            showVerticalCenterLine()
        }
        if (isInHorizontalCenter) {
            showHorizontalCenterLine()
        }
    })

    canvas.on('mouse:up', function () {
        // clear these values, to stop drawing guidelines once mouse is up
        isInVerticalCenter = isInHorizontalCenter = false
        canvas.renderAll()
    })
}

/**
 * Should objects be aligned by a bounding box?
 * [Bug] Scaled objects sometimes can not be aligned by edges
 *
 */
function initAligningGuidelines(canvas) {
    const ctx = canvas.getSelectionContext()
    const aligningLineOffset = 5
    const aligningLineMargin = 4
    const aligningLineWidth = ALIGNING_LINE_WIDTH
    const aligningLineColor = ALIGNING_LINE_COLOR
    let viewportTransform = {}
    let zoom = 1

    function drawVerticalLine(coords) {
        drawLine(
            coords.x + 0.5,
            coords.y1 > coords.y2 ? coords.y2 : coords.y1,
            coords.x + 0.5,
            coords.y2 > coords.y1 ? coords.y2 : coords.y1
        )
    }

    function drawHorizontalLine(coords) {
        drawLine(
            coords.x1 > coords.x2 ? coords.x2 : coords.x1,
            coords.y + 0.5,
            coords.x2 > coords.x1 ? coords.x2 : coords.x1,
            coords.y + 0.5
        )
    }

    function drawLine(x1, y1, x2, y2) {
        const originXY = fabric.util.transformPoint(new fabric.Point(x1, y1), canvas.viewportTransform)
        const dimensions = fabric.util.transformPoint(new fabric.Point(x2, y2), canvas.viewportTransform)
        ctx.save()
        ctx.lineWidth = aligningLineWidth
        ALIGNING_LINE_DASH && ctx.setLineDash([5])
        ctx.strokeStyle = aligningLineColor
        ctx.beginPath()

        ctx.moveTo(
            ((originXY.x)),
            ((originXY.y))
        )

        ctx.lineTo(
            ((dimensions.x)),
            ((dimensions.y))
        )
        ctx.stroke()
        ctx.restore()
    }

    function isInRange(value1, value2) {
        value1 = Math.round(value1)
        value2 = Math.round(value2)
        for (let i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
            if (i === value2) {
                return true
            }
        }
        return false
    }

    const verticalLines = []
    const horizontalLines = []

    canvas.on('mouse:down', function () {
        viewportTransform = canvas.viewportTransform
        zoom = canvas.getZoom()
    })

    canvas.on('object:moving', function (e) {
        const activeObject = e.target
        const canvasObjects = canvas.getObjects()
        const activeObjectCenter = activeObject.getCenterPoint()
        const activeObjectLeft = activeObjectCenter.x
        const activeObjectTop = activeObjectCenter.y
        const activeObjectBoundingRect = activeObject.getBoundingRect()
        const activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3]
        const activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0]
        let horizontalInTheRange = false
        let verticalInTheRange = false
        const transform = canvas._currentTransform

        if (!transform) return

        // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
        // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

        for (let i = canvasObjects.length; i--;) {
            if (canvasObjects[i] === activeObject) continue

            const objectCenter = canvasObjects[i].getCenterPoint()
            const objectLeft = objectCenter.x
            const objectTop = objectCenter.y
            const objectBoundingRect = canvasObjects[i].getBoundingRect()
            const objectHeight = objectBoundingRect.height / viewportTransform[3]
            const objectWidth = objectBoundingRect.width / viewportTransform[0]

            // snap by the horizontal center line
            if (isInRange(objectLeft, activeObjectLeft)) {
                verticalInTheRange = true
                verticalLines.push({
                    x: objectLeft,
                    y1:
                        objectTop < activeObjectTop
                            ? objectTop - objectHeight / 2 - aligningLineOffset
                            : objectTop + objectHeight / 2 + aligningLineOffset,
                    y2:
                        activeObjectTop > objectTop
                            ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                            : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
                })
                activeObject.setPositionByOrigin(
                    new fabric.Point(objectLeft, activeObjectTop),
                    'center',
                    'center'
                )
            }

            // snap by the left edge
            if (
                isInRange(
                    objectLeft - objectWidth / 2,
                    activeObjectLeft - activeObjectWidth / 2
                )
            ) {
                verticalInTheRange = true
                verticalLines.push({
                    x: objectLeft - objectWidth / 2,
                    y1:
                        objectTop < activeObjectTop
                            ? objectTop - objectHeight / 2 - aligningLineOffset
                            : objectTop + objectHeight / 2 + aligningLineOffset,
                    y2:
                        activeObjectTop > objectTop
                            ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                            : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
                })
                activeObject.setPositionByOrigin(
                    new fabric.Point(
                        objectLeft - objectWidth / 2 + activeObjectWidth / 2,
                        activeObjectTop
                    ),
                    'center',
                    'center'
                )
            }

            // snap by the right edge
            if (
                isInRange(
                    objectLeft + objectWidth / 2,
                    activeObjectLeft + activeObjectWidth / 2
                )
            ) {
                verticalInTheRange = true
                verticalLines.push({
                    x: objectLeft + objectWidth / 2,
                    y1:
                        objectTop < activeObjectTop
                            ? objectTop - objectHeight / 2 - aligningLineOffset
                            : objectTop + objectHeight / 2 + aligningLineOffset,
                    y2:
                        activeObjectTop > objectTop
                            ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                            : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
                })
                activeObject.setPositionByOrigin(
                    new fabric.Point(
                        objectLeft + objectWidth / 2 - activeObjectWidth / 2,
                        activeObjectTop
                    ),
                    'center',
                    'center'
                )
            }

            // snap by the vertical center line
            if (isInRange(objectTop, activeObjectTop)) {
                horizontalInTheRange = true
                horizontalLines.push({
                    y: objectTop,
                    x1:
                        objectLeft < activeObjectLeft
                            ? objectLeft - objectWidth / 2 - aligningLineOffset
                            : objectLeft + objectWidth / 2 + aligningLineOffset,
                    x2:
                        activeObjectLeft > objectLeft
                            ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                            : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
                })
                activeObject.setPositionByOrigin(
                    new fabric.Point(activeObjectLeft, objectTop),
                    'center',
                    'center'
                )
            }

            // snap by the top edge
            if (
                isInRange(
                    objectTop - objectHeight / 2,
                    activeObjectTop - activeObjectHeight / 2
                )
            ) {
                horizontalInTheRange = true
                horizontalLines.push({
                    y: objectTop - objectHeight / 2,
                    x1:
                        objectLeft < activeObjectLeft
                            ? objectLeft - objectWidth / 2 - aligningLineOffset
                            : objectLeft + objectWidth / 2 + aligningLineOffset,
                    x2:
                        activeObjectLeft > objectLeft
                            ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                            : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
                })
                activeObject.setPositionByOrigin(
                    new fabric.Point(
                        activeObjectLeft,
                        objectTop - objectHeight / 2 + activeObjectHeight / 2
                    ),
                    'center',
                    'center'
                )
            }

            // snap by the bottom edge
            if (
                isInRange(
                    objectTop + objectHeight / 2,
                    activeObjectTop + activeObjectHeight / 2
                )
            ) {
                horizontalInTheRange = true
                horizontalLines.push({
                    y: objectTop + objectHeight / 2,
                    x1:
                        objectLeft < activeObjectLeft
                            ? objectLeft - objectWidth / 2 - aligningLineOffset
                            : objectLeft + objectWidth / 2 + aligningLineOffset,
                    x2:
                        activeObjectLeft > objectLeft
                            ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                            : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
                })
                activeObject.setPositionByOrigin(
                    new fabric.Point(
                        activeObjectLeft,
                        objectTop + objectHeight / 2 - activeObjectHeight / 2
                    ),
                    'center',
                    'center'
                )
            }
        }

        if (!horizontalInTheRange) {
            horizontalLines.length = 0
        }

        if (!verticalInTheRange) {
            verticalLines.length = 0
        }
    })

    canvas.on('before:render', function () {
        canvas.contextTop && canvas.clearContext(canvas.contextTop)
    })

    canvas.on('after:render', function () {
        for (let i = verticalLines.length; i--;) {
            drawVerticalLine(verticalLines[i])
        }
        for (let i = horizontalLines.length; i--;) {
            drawHorizontalLine(horizontalLines[i])
        }

        verticalLines.length = horizontalLines.length = 0
    })

    canvas.on('mouse:up', function () {
        verticalLines.length = horizontalLines.length = 0
        canvas.renderAll()
    })
}

// ------------------------------------ //

export const useGuideLines = (canvas) => {
    initCenteringGuidelines(canvas)
    initAligningGuidelines(canvas)

    canvas.on('mouse:wheel', opt => {
        opt.e.preventDefault()
        initCenteringGuidelines(canvas)
        initAligningGuidelines(canvas)
    }, false)
}
