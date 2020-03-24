import imageUrl from './test.png'
import ImageStroke from '../src/index'
import methodRotate from '../src/method-rotate'
import methodContour from '../src/method-contour'
import methodDistance from '../src/method-distance'
import methodRotateGl from '../src/method-rotate-by-gl'

const $canvas = document.getElementById('canvas') as HTMLCanvasElement
const $select = document.getElementById('select') as HTMLSelectElement
const $thickness = document.getElementById('thickness') as HTMLInputElement
const $color = document.getElementById('color') as HTMLInputElement
const $file = document.getElementById('file') as HTMLInputElement
const $time = document.getElementById('time')

const showPerf = () => {
    const startTime = performance.now()
    return () => {
        $time.innerText = Math.round(performance.now() - startTime) + 'ms'
    }
}

let targetImage
const imageStroke = new ImageStroke(methodRotate)
const methodMap = {
    rotate: methodRotate,
    contour: methodContour,
    distance: methodDistance,
    rotateByGl: methodRotateGl
}
const update = () => {
    const endPerf = showPerf()
    imageStroke.use(methodMap[$select.value])
    const result = imageStroke.make(targetImage, {
        thickness: Number($thickness.value),
        color: $color.value
    })
    const ctx = $canvas.getContext('2d')
    $canvas.width = result.width
    $canvas.height = result.height
    $canvas.style.width = result.width + 'px'
    $canvas.style.height = result.height + 'px'
    ctx.drawImage(result, 0, 0)
    endPerf()
}

const useImage = url => {
    const image = new Image()
    image.onload = () => {
        targetImage = image
        update()
    }
    image.src = url
}

useImage(imageUrl)

$select.addEventListener('input', update)
$thickness.addEventListener('input', update)
$color.addEventListener('input', update)
$file.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files[0]
    useImage(URL.createObjectURL(file))
})
