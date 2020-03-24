import { StrokeMethod } from './index'
import { createOutlineProgram } from './gl-outline'

const fs = `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D texture;
    uniform vec3 color;
    uniform vec2 thickness;

    void main() {
        vec4 texColor = texture2D(texture, uv);

        vec2 sibling;
        float curAlpha;
        float maxAlpha = 0.0;
        float minAlpha = 1.0;

        for (float angle = 0.0; angle <= 360.0; angle += 1.0) {
            if(texColor.a > 0.5 || maxAlpha == 1.0) break;
            sibling.x = uv.x + thickness.x * cos(angle);
            sibling.y = uv.y + thickness.y * sin(angle);
            curAlpha = texture2D(texture, sibling).a;
            minAlpha = min(minAlpha, curAlpha);
            maxAlpha = max(maxAlpha, curAlpha);
        }
        float alpha = max(maxAlpha, texColor.a);

        // If current color isn't opaque, need plus outline color as background.
        vec3 background = texColor.a == 0. ? color * texColor.a : vec3(0.);
        vec3 outlineColor = maxAlpha * color;
        gl_FragColor = vec4(texColor.rgb * texColor.a + background + outlineColor, alpha);
    }
`

export default {
    context: 'gl',
    create (ctx, image) {
        const glProgram = createOutlineProgram(ctx, image, fs)

        return options => {
            glProgram.update(options)
        }
    }
} as StrokeMethod<'gl'>
