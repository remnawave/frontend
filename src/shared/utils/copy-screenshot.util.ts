import { domToCanvas } from 'modern-screenshot'

export const isScreenshotSupported = !/Firefox|Gecko\//.test(navigator.userAgent)

const prefersNativeShare =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)

const MAX_CANVAS_AREA = 12_000_000
const PADDING_UNITS = 96

const BLOB_COLORS = [
    'rgba(99, 59, 171, 0.45)',
    'rgba(49, 120, 198, 0.4)',
    'rgba(167, 55, 138, 0.35)',
    'rgba(30, 144, 155, 0.35)',
    'rgba(76, 29, 149, 0.4)',
    'rgba(14, 116, 144, 0.35)',
    'rgba(134, 55, 100, 0.35)',
    'rgba(59, 78, 171, 0.4)'
]

function decorateCanvas(
    source: CanvasImageSource,
    sourceWidth: number,
    sourceHeight: number,
    scale: number
): HTMLCanvasElement {
    const padding = (PADDING_UNITS / 2) * scale
    const innerRadius = 5 * scale

    const totalWidth = sourceWidth + padding * 2
    const totalHeight = sourceHeight + padding * 2

    const canvas = document.createElement('canvas')
    canvas.width = totalWidth
    canvas.height = totalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')

    ctx.fillStyle = '#111118'
    ctx.fillRect(0, 0, totalWidth, totalHeight)

    const blobCount = 3 + Math.floor(Math.random() * 2)
    const shuffled = [...BLOB_COLORS].sort(() => Math.random() - 0.5)
    for (let i = 0; i < blobCount; i++) {
        const bx = Math.random() * totalWidth
        const by = Math.random() * totalHeight
        const br = Math.max(totalWidth, totalHeight) * (0.3 + Math.random() * 0.4)
        const radial = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        radial.addColorStop(0, shuffled[i % shuffled.length])
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = radial
        ctx.fillRect(0, 0, totalWidth, totalHeight)
    }

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(padding, padding, sourceWidth, sourceHeight, innerRadius)
    ctx.clip()
    ctx.drawImage(source, padding, padding, sourceWidth, sourceHeight)
    ctx.restore()

    return canvas
}

async function renderScreenshot(element: HTMLElement, scale = 3): Promise<HTMLCanvasElement> {
    const sourceCanvas = await domToCanvas(element, { scale })

    return decorateCanvas(sourceCanvas, sourceCanvas.width, sourceCanvas.height, scale)
}

async function renderImageScreenshot(image: HTMLImageElement): Promise<HTMLCanvasElement> {
    await image.decode().catch(() => {})

    const naturalWidth = image.naturalWidth || image.clientWidth
    const naturalHeight = image.naturalHeight || image.clientHeight

    if (!naturalWidth || !naturalHeight) throw new Error('Image is not ready yet')

    const maxScale = Math.sqrt(
        MAX_CANVAS_AREA / ((naturalWidth + PADDING_UNITS) * (naturalHeight + PADDING_UNITS))
    )
    const scale = Math.max(1, Math.min(2, maxScale))

    return decorateCanvas(image, naturalWidth * scale, naturalHeight * scale, scale)
}

function assertScreenshotSupported(): void {
    if (!isScreenshotSupported) {
        throw new Error('Screenshots are not supported in Firefox-based browsers')
    }
}

type ScreenshotTarget = (() => HTMLElement | Promise<HTMLElement>) | HTMLElement

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Failed to capture'))),
            'image/png'
        )
    })
}

function screenshotBlob(target: ScreenshotTarget): Promise<Blob> {
    return Promise.resolve()
        .then(() => (typeof target === 'function' ? target() : target))
        .then((element) => renderScreenshot(element))
        .then((canvas) => canvasToBlob(canvas))
}

function imageScreenshotBlob(image: HTMLImageElement): Promise<Blob> {
    return renderImageScreenshot(image).then((canvas) => canvasToBlob(canvas))
}

function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.download = filename
    a.href = url
    a.rel = 'noopener'

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

function copyBlobToClipboard(blob: Blob): Promise<void> {
    return navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

async function copyPendingBlobToClipboard(blobPromise: Promise<Blob>): Promise<void> {
    let renderError: unknown

    const guarded = blobPromise.catch((error) => {
        renderError = error
        throw error
    })

    try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': guarded })])
    } catch (error) {
        throw renderError ?? error
    }
}

function shareableFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type || 'image/png' })
}

function canShareFiles(): boolean {
    return (
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [shareableFile(new Blob(), 'probe.png')] })
    )
}

async function shareBlob(blob: Blob, filename: string): Promise<boolean> {
    if (!canShareFiles()) return false

    try {
        await navigator.share({ files: [shareableFile(blob, filename)] })
        return true
    } catch (error) {
        return error instanceof DOMException && error.name === 'AbortError'
    }
}

async function shareOrCopyBlob(blob: Blob, filename: string): Promise<void> {
    if (await shareBlob(blob, filename)) return

    await copyBlobToClipboard(blob)
}

async function shareOrSaveBlob(blob: Blob, filename: string): Promise<void> {
    if (prefersNativeShare && (await shareBlob(blob, filename))) return

    downloadBlob(blob, filename)
}

export async function copyScreenshotToClipboard(
    target: ScreenshotTarget,
    filename = 'screenshot.png'
): Promise<void> {
    assertScreenshotSupported()

    if (canShareFiles()) {
        await shareOrCopyBlob(await screenshotBlob(target), filename)
        return
    }

    await copyPendingBlobToClipboard(screenshotBlob(target))
}

export async function downloadScreenshot(element: HTMLElement, filename: string): Promise<void> {
    assertScreenshotSupported()

    await shareOrSaveBlob(await screenshotBlob(element), filename)
}

export async function copyImageScreenshotToClipboard(
    image: HTMLImageElement,
    filename: string
): Promise<void> {
    if (canShareFiles()) {
        await shareOrCopyBlob(await imageScreenshotBlob(image), filename)
        return
    }

    await copyPendingBlobToClipboard(imageScreenshotBlob(image))
}

export async function downloadImageScreenshot(
    image: HTMLImageElement,
    filename: string
): Promise<void> {
    await shareOrSaveBlob(await imageScreenshotBlob(image), filename)
}
