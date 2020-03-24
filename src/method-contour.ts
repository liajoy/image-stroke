import { StrokeMethod } from './index'
import traceRegion from 'marching-squares'

export function getContours (ctx: CanvasRenderingContext2D, opacityThreshold = 100) {
    const { width, height } = ctx.canvas
    const { data } = ctx.getImageData(0, 0, width, height)
    const isInside = (x: number, y: number) => {
        return x >= 0 && y >= 0 && x < width && y < height
            ? data[(y * width + x) * 4 - 1] > opacityThreshold
            : false
    }

    let contours = []
    let startPos = -1
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] > opacityThreshold) {
            startPos = (i + 1) / 4
            break
        }
    }

    if (startPos >= 0) {
        contours = traceRegion(
            startPos % width,
            Math.floor(startPos / width),
            isInside
        )
    }

    return contours
}

const canvas4Image = document.createElement('canvas')
const ctx4Image = canvas4Image.getContext('2d')
export default {
    context: '2d',
    create (ctx, image) {
        return (options) => {
            ctx.save()
            canvas4Image.width = image.width
            canvas4Image.height = image.height
            ctx4Image.drawImage(image, 0, 0)

            const contours = getContours(ctx4Image)
            const x = options.thickness
            const y = options.thickness
            ctx.strokeStyle = options.color
            ctx.lineWidth = options.thickness * 2
            ctx.lineJoin = 'round'

            ctx.beginPath()
            ctx.moveTo(x + contours[0].x, y + contours[1].y)
            for (let i = 1; i < contours.length; i++) {
                ctx.lineTo(x + contours[i].x, y + contours[i].y)
            }
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
            ctx.drawImage(image, options.thickness, options.thickness)
        }
    }
} as StrokeMethod<'2d'>
