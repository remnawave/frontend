/**
 * Parses a string containing color-annotated segments and returns an array of
 * text parts with associated colors.
 *
 * The function looks for segments in the format `{color}word`, where `color` can be
 * a six-digit hex code (with or without a leading #) or any string representing a color,
 * and `word` is the sequence of non-whitespace, non-brace characters that follows.
 *
 * All other text (plain, outside braces) is grouped as "normal" and assigned the color `'white'`.
 *
 * Examples:
 *   - "{ff0000}Remna{00ff00}wave" =>
 *       [
 *         { text: "Remna", color: "#ff0000" },
 *         { text: "wave", color: "#00ff00" }
 *       ]
 *   - "{blue}My Brand" =>
 *       [
 *         { text: "My", color: "blue" },
 *         { text: " Brand", color: "white" }
 *       ]
 *
 * @param text - The text to parse, possibly containing color-annotated segments.
 * @returns An array of objects, each with `text` and `color` properties.
 */
export function parseColoredTextUtil(text: string): Array<{ color: string; text: string }> {
    const parts: Array<{ color: string; text: string }> = []
    let i = 0

    while (i < text.length) {
        if (text[i] === '{') {
            const closeIndex = text.indexOf('}', i)
            if (closeIndex !== -1) {
                let color = text.slice(i + 1, closeIndex)

                if (/^[0-9A-Fa-f]{6}$/.test(color)) {
                    color = `#${color}`
                }

                i = closeIndex + 1

                let word = ''
                while (i < text.length && text[i] !== ' ' && text[i] !== '{') {
                    word += text[i]
                    i++
                }

                if (word) {
                    parts.push({ text: word, color })
                }
            }
        }

        let normalText = ''
        while (i < text.length && text[i] !== '{') {
            normalText += text[i]
            i++
        }

        if (normalText) {
            parts.push({ text: normalText, color: 'white' })
        }
    }

    return parts.length > 0 ? parts : [{ text, color: 'white' }]
}
