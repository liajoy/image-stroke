import * as twgl from 'twgl.js'
import Color from 'color'
import { Options } from './index'

const vs = `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        uv = position / 2.0 + 0.5;
    }
`
const fs = `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D texture;
    uniform vec2 offset;

    void main() {
        vec2 newUv = uv;
        // clip
        newUv *= step(offset, newUv);
        newUv *= step(offset, 1.0 - newUv);
        // scale
        newUv -= offset;
        newUv /= 1.0 - 2.0 * offset;

        if (newUv.x < 0. || newUv.y < 0.) {
            discard;
        }

        gl_FragColor = texture2D(texture, newUv);
    }
`

export function createOutlineProgram (gl: WebGLRenderingContext, image: HTMLImageElement, outlineFs: string) {
    const imageProgram = twgl.createProgramInfo(gl, [vs, fs])
    const arrays = {
        position: [-1, -1, 0, 1, -1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, -1, 1, 0]
    }
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
    const outlineProgram = twgl.createProgramInfo(gl, [vs, outlineFs])
    const tex = twgl.createTexture(gl, {
        src: image,
        flipY: 1
    })

    return {
        update (options: Options) {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

            const normalizedThickness = [
                options.thickness / gl.canvas.width,
                options.thickness / gl.canvas.height
            ]
            const uniforms = {
                texture: tex,
                offset: normalizedThickness
            }
            const fbi = twgl.createFramebufferInfo(gl)
            // Transform image to fit canvas
            gl.useProgram(imageProgram.program)
            twgl.bindFramebufferInfo(gl, fbi)
            twgl.setBuffersAndAttributes(gl, imageProgram, bufferInfo)
            twgl.setUniforms(imageProgram, uniforms)
            twgl.drawBufferInfo(gl, bufferInfo)
            twgl.bindFramebufferInfo(gl, null)

            const color = Color(options.color)
            const colorArray = color.array().map(val => val / 255)
            const outlineUniforms = {
                texture: fbi.attachments[0],
                thickness: normalizedThickness,
                color: colorArray
            }
            gl.useProgram(outlineProgram.program)
            twgl.setBuffersAndAttributes(gl, outlineProgram, bufferInfo)
            twgl.setUniforms(outlineProgram, outlineUniforms)
            twgl.drawBufferInfo(gl, bufferInfo)
        }
    }
}
