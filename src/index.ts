import { utils } from './utils'

export type Options = {
    thickness: number;
    color: string;
}
export type StrokeMethod<T extends 'gl' | '2d' = 'gl' | '2d'> = {
    context: T;
    exec: (
        ctx: T extends 'gl' ? WebGLRenderingContext : CanvasRenderingContext2D,
        image: HTMLImageElement,
        options: Options
    ) => void;
}

export default class ImageStroke {
    canvas: HTMLCanvasElement | null = null

    method: StrokeMethod

    constructor (method: StrokeMethod) {
        this.use(method)
    }

    use (method: StrokeMethod) {
        this.method = method
    }

    make (image: HTMLImageElement, options: Options) {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas')
        }
        const { canvas } = this
        const ctx = this.getContext()
        const strokeSize = options.thickness * 2
        const [resultWidth, resultHeight] = [image.width, image.height].map((val) => val + strokeSize)

        if (resultWidth !== canvas.width || resultHeight !== canvas.height) {
            canvas.width = resultWidth
            canvas.height = resultHeight
        }

        utils.clear(ctx)

        this.method.exec(ctx, image, options)

        return canvas
    }

    private getContext () {
        switch (this.method.context) {
        case 'gl':
            return this.canvas.getContext('gl') as WebGLRenderingContext
        case '2d':
            return this.canvas.getContext('2d') as CanvasRenderingContext2D
        }
    }
}
