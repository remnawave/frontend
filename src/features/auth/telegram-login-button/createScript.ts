export function createScript(): HTMLScriptElement {
    const script = document.createElement('script')

    script.async = true

    script.src = `https://telegram.org/js/telegram-widget.js?22`

    return script
}
