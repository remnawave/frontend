import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const axiosSource = readFileSync(new URL('../src/shared/api/axios.ts', import.meta.url), 'utf8')
const viteConfigSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8')

test('production API base is controlled by Vite build mode', () => {
    assert.match(axiosSource, /const isDev = import\.meta\.env\.DEV/)
    assert.doesNotMatch(axiosSource, /__NODE_ENV__ === ['"]development['"]/)
    assert.match(viteConfigSource, /command === ['"]serve['"]/)
    assert.ok(
        viteConfigSource.indexOf('dotenv.config') > viteConfigSource.indexOf("command === 'serve'")
    )
})
