# ImageStroke

Makes stroke for a image with transparent background.

## Getting Started

### Installing

``` bash
yarn add image-stroke
```

### How To Use

There are three built-in methods to make stroke. Choose one of them in different situations.

- Rotate. Rotates the image with 360 degree.
- Contour. Detects contours of the image by [Marching Squares](https://en.wikipedia.org/wiki/Marching_squares) and stroke them.
- Distance. Finds distance from edge per pixel by [Distance transform](https://en.wikipedia.org/wiki/
- Distance_transform), then fill every pixel not in stroke.
- Rotate by WebGL. The same as 「Rotate」 but implements in WebGL.

``` javascript
import ImageStroke from 'image-stroke'

// Choose one of these methods
import rotate from 'image-stroke/lib/method-rotate'
import distance from 'image-stroke/lib/method-distance'
import contour from 'image-stroke/lib/method-contour'
import rotateByGL from 'image-stroke/lib/method-rotate-by-gl'

const imageStroke = new ImageStroke()

// Just use it
imageStroke.use(rotate)

const image = new Image();
image.onload = () => {
    // Get result
    const resultCanvas = imageStroke.make(image, {
        thickness: 10,
        color: 'red'
    })
}
```