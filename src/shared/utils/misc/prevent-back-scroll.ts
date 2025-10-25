export function preventBackScroll(event: WheelEvent): void {
    if (event.deltaX === 0) {
        return
    }
    event.preventDefault()
    event.stopPropagation()
}
