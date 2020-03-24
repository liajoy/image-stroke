import { StrokeMethod } from './index'

export default {
    context: '2d',
    create (ctx, image) {
        return (options) => {
            ctx.save()
            for (let i = 0; i < 360; i++) {
                ctx.drawImage(
                    image,
                    options.thickness * (1 + Math.cos(i)),
                    options.thickness * (1 + Math.sin(i))
                )
            }
            ctx.globalCompositeOperation = 'source-in'
            ctx.fillStyle = options.color
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.restore()
            ctx.drawImage(image, options.thickness, options.thickness)
        }
    }
} as StrokeMethod<'2d'>
