export function runOnDelay(fct: () => void, delay: number) {
    let isDone = false
    const obj: { stop: () => void } = {} as { stop: () => void }
    const refTim = setTimeout(() => {
        isDone = true
        fct()
    }, delay)

    obj.stop = () => {
        clearTimeout(refTim)
        if (!isDone) fct()
        isDone = true
    }
    return obj
}
