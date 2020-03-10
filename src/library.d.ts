
declare module 'marching-squares' {
    export default function (x: number, y: number, isInside: (x: number, y: number) => boolean): number[]
}
