import { StrokeMethod } from './index'
import Color from 'color'

// See https://github.com/parmanoir/Meijster-distance
function computeDistances (binaryImage: Uint8Array, width: number, height: number) {
    // First phase
    const infinity = width + height
    const b = binaryImage
    const g = new Array(width * height)
    for (let x = 0; x < width; x++) {
        if (b[x + 0 * width]) { g[x + 0 * width] = 0 } else {
            g[x + 0 * width] = infinity
        }
        // Scan 1
        for (let y = 1; y < height; y++) {
            if (b[x + y * width]) { g[x + y * width] = 0 } else {
                g[x + y * width] = 1 + g[x + (y - 1) * width]
            }
        }
        // Scan 2
        for (let y = height - 1; y >= 0; y--) {
            if (g[x + (y + 1) * width] < g[x + y * width]) {
                g[x + y * width] = 1 + g[x + (y + 1) * width]
            }
        }
    }

    // Euclidean
    function EDTFunc (x: number, i: number, gi: number) {
        return (x - i) * (x - i) + gi * gi
    }
    function EDTSep (i: number, u: number, gi: number, gu: number) {
        return Math.floor((u * u - i * i + gu * gu - gi * gi) / (2 * (u - i)))
    }

    // Second phase
    const dt = new Array(width * height)
    const s = new Array(width)
    const t = new Array(width)
    let q = 0
    let w = 0
    for (let y = 0; y < height; y++) {
        q = 0
        s[0] = 0
        t[0] = 0

        // Scan 3
        for (let u = 1; u < width; u++) {
            while (q >= 0 && EDTFunc(t[q], s[q], g[s[q] + y * width]) > EDTFunc(t[q], u, g[u + y * width])) {
                q--
            }
            if (q < 0) {
                q = 0
                s[0] = u
            } else {
                w = 1 + EDTSep(s[q], u, g[s[q] + y * width], g[u + y * width])
                if (w < width) {
                    q++
                    s[q] = u
                    t[q] = w
                }
            }
        }
        // Scan 4
        for (let u = width - 1; u >= 0; u--) {
            let d = EDTFunc(u, s[q], g[s[q] + y * width])
            d = Math.floor(Math.sqrt(d))
            dt[u + y * width] = d
            if (u === t[q]) {
                q--
            }
        }
    }

    return dt
}

const toBinaryImage = (ctx: CanvasRenderingContext2D, threshold = 5) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const data = ctx.getImageData(0, 0, width, height).data
    const binaryImage = new Uint8Array(width * height)
    for (let i = 0; i < data.length; i += 4) {
        const binary = data[i] < threshold ? 1 : 0
        binaryImage[i / 4] = 1 - binary
    }
    return binaryImage
}

const canvas4Image = document.createElement('canvas')
const ctx4Image = canvas4Image.getContext('2d')
export default {
    context: '2d',
    create (ctx, image) {
        return (options) => {
            const { width, height } = ctx.canvas
            const color = Color(options.color)
            const colorArray = color.array().concat(color.alpha() * 255)

            canvas4Image.width = width
            canvas4Image.height = height
            ctx4Image.drawImage(image, options.thickness, options.thickness)

            const binaryImage = toBinaryImage(ctx4Image)
            const distances = computeDistances(binaryImage, canvas4Image.width, canvas4Image.height)
            const imageData = ctx.getImageData(0, 0, width, height)
            const { data } = imageData
            for (let i = 0; i < data.length; i += 4) {
                const distance = distances[i / 4]
                if (distance < options.thickness) {
                    [
                        data[i],
                        data[i + 1],
                        data[i + 2],
                        data[i + 3]
                    ] = colorArray
                }
            }
            ctx.putImageData(imageData, 0, 0)
            ctx.drawImage(image, options.thickness, options.thickness)
        }
    }
} as StrokeMethod<'2d'>
