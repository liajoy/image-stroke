
type Utils<
    T extends CanvasRenderingContext2D | WebGLRenderingContext = CanvasRenderingContext2D | WebGLRenderingContext
> = {
    clear: (ctx: T) => void;
    drawImage: (ctx: T, image: HTMLImageElement, x: number, y: number) => void;
}

const utilsGl: Utils<WebGLRenderingContext> = {
    clear () {
        // nothing
    },
    drawImage () {
        // nothing
    }
}
const utils2d: Utils<CanvasRenderingContext2D> = {
    clear (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },
    drawImage (ctx, image, x, y) {
        ctx.drawImage(image, x, y)
    }
}

export const utils: Utils = {
    clear (ctx) {
        if (ctx instanceof CanvasRenderingContext2D) {
            utils2d.clear(ctx)
        } else if (ctx instanceof WebGLRenderingContext) {
            utilsGl.clear(ctx)
        }
    },
    drawImage (ctx, image, x, y) {
        if (ctx instanceof CanvasRenderingContext2D) {
            utils2d.drawImage(ctx, image, x, y)
        } else if (ctx instanceof WebGLRenderingContext) {
            utilsGl.drawImage(ctx, image, x, y)
        }
    }
}
