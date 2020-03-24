import { utils } from './utils'

export type Options = {
    thickness: number;
    color: string;
}
export type StrokeMethod<
    T extends 'gl' | '2d' = 'gl' | '2d',
> = {
    context: T;
    create: (
        context: T extends 'gl' ? WebGLRenderingContext : CanvasRenderingContext2D,
        image: HTMLImageElement
    ) => (options: Options) => void;
}

const createCanvas = () => document.createElement('canvas')

export default class ImageStroke {
    canvas: HTMLCanvasElement | null = null

    glCanvas: HTMLCanvasElement | null = null

    image: HTMLImageElement

    method: ReturnType<StrokeMethod['create']>

    useMethod: StrokeMethod

    constructor (useMethod?: StrokeMethod) {
        this.useMethod = useMethod
    }

    getCanvas (useMethod = this.useMethod) {
        if (useMethod.context === 'gl') {
            this.glCanvas = this.glCanvas || createCanvas()
            return this.glCanvas
        } else {
            this.canvas = this.canvas || createCanvas()
            return this.canvas
        }
    }

    initMethod (image = this.image, useMethod = this.useMethod) {
        if (this.image !== image || this.useMethod !== useMethod) {
            this.method = useMethod.create(this.getContext(useMethod), image)
        }
    }

    setImage (image: HTMLImageElement) {
        this.initMethod(image)
    }

    use (useMethod: StrokeMethod) {
        this.initMethod(undefined, useMethod)
        this.useMethod = useMethod
    }

    make (image: HTMLImageElement, options: Options) {
        this.initMethod(image)
        this.image = image

        const canvas = this.getCanvas()
        const strokeSize = options.thickness * 2
        const [
            resultWidth,
            resultHeight
        ] = [this.image.width, this.image.height].map((val) => val + strokeSize)
        const context = this.getContext()

        if (resultWidth !== canvas.width || resultHeight !== canvas.height) {
            canvas.width = resultWidth
            canvas.height = resultHeight
        }

        utils.clear(context)

        this.method(options)

        return canvas
    }

    private getContext (useMethod = this.useMethod) {
        const canvas = this.getCanvas(useMethod)
        switch (useMethod.context) {
        case 'gl':
            return canvas.getContext('webgl') as WebGLRenderingContext
        case '2d':
            return canvas.getContext('2d') as CanvasRenderingContext2D
        }
    }
}
