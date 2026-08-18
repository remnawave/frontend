import { domToCanvas } from 'modern-screenshot'

export const isScreenshotSupported = !/Firefox|Gecko\//.test(navigator.userAgent)

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

async function renderScreenshot(element: HTMLElement, scale = 3): Promise<HTMLCanvasElement> {
    const padding = 48 * scale
    const innerRadius = 5 * scale

    const sourceCanvas = await domToCanvas(element, { scale })

    const totalWidth = sourceCanvas.width + padding * 2
    const totalHeight = sourceCanvas.height + padding * 2

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
    ctx.roundRect(padding, padding, sourceCanvas.width, sourceCanvas.height, innerRadius)
    ctx.clip()
    ctx.drawImage(sourceCanvas, padding, padding)
    ctx.restore()

    return canvas
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

export function downloadBlob(blob: Blob, filename: string): void {
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

export async function copyScreenshotToClipboard(target: ScreenshotTarget): Promise<void> {
    assertScreenshotSupported()

    let renderError: unknown

    const blobPromise = Promise.resolve()
        .then(() => (typeof target === 'function' ? target() : target))
        .then((element) => renderScreenshot(element))
        .then((canvas) => canvasToBlob(canvas))
        .catch((error) => {
            renderError = error
            throw error
        })

    try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })])
    } catch (error) {
        throw renderError ?? error
    }
}

export async function downloadScreenshot(element: HTMLElement, filename: string): Promise<void> {
    assertScreenshotSupported()

    const canvas = await renderScreenshot(element)

    downloadBlob(await canvasToBlob(canvas), filename)
}
