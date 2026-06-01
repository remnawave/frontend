import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const surgeLogoSource = readFileSync(
    path.join(__dirname, '../src/shared/ui/logos/surge-logo.tsx'),
    'utf8'
)

assert.equal(
    (surgeLogoSource.match(/<rect/g) ?? []).length,
    5,
    'Surge logo should use the five rounded vertical bars from the official app icon.'
)
assert.match(surgeLogoSource, /rx="20"/)
assert.doesNotMatch(surgeLogoSource, /M27\.1 5\.3H14\.9/)
