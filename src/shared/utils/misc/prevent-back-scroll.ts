function findScrollableParent(el: Element | null, horizontal: boolean): Element | null {
    while (el && el !== document.body) {
        const style = window.getComputedStyle(el)
        const overflow = horizontal ? style.overflowX : style.overflowY

        if (overflow === 'auto' || overflow === 'scroll') {
            return el
        }
        // eslint-disable-next-line no-param-reassign
        el = el.parentElement
    }
    return null
}

export function preventBackScroll(event: WheelEvent): void {
    if (event.deltaX === 0) {
        return
    }
    event.preventDefault()
    event.stopPropagation()
}

export function preventBackScrollTables(event: WheelEvent): void {
    if (event.deltaX === 0) {
        return
    }

    const scrollable = findScrollableParent(event.target as Element, true)

    if (scrollable) {
        const atLeftEdge = scrollable.scrollLeft <= 0 && event.deltaX < 0
        const atRightEdge =
            scrollable.scrollLeft + scrollable.clientWidth >= scrollable.scrollWidth - 1 &&
            event.deltaX > 0

        if (!atLeftEdge && !atRightEdge) {
            return
        }
    }

    event.preventDefault()
    event.stopPropagation()
}
