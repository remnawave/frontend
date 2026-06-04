import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const axiosSource = readFileSync(new URL('../src/shared/api/axios.ts', import.meta.url), 'utf8')
const viteConfigSource = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8')

test('production API base is controlled by Vite build mode', () => {
    assert.match(axiosSource, /const isDev = import\.meta\.env\.DEV/)
    assert.doesNotMatch(axiosSource, /__NODE_ENV__ === ['"]development['"]/)
    assert.match(axiosSource, /const isDomainOverride = isDev && __DOMAIN_OVERRIDE__ === ['"]1['"]/)
    assert.match(viteConfigSource, /command === ['"]serve['"]/)
    assert.ok(
        viteConfigSource.indexOf('dotenv.config') > viteConfigSource.indexOf("command === 'serve'")
    )
    assert.match(
        viteConfigSource,
        /const domainBackend = isServe\s+\?\s+process\.env\.DOMAIN_BACKEND \|\| ['"]http:\/\/127\.0\.0\.1:3003['"]\s+:\s+['"]['"]/
    )
    assert.match(
        viteConfigSource,
        /const domainOverride = isServe\s+\?\s+process\.env\.DOMAIN_OVERRIDE \|\| ['"]0['"]\s+:\s+['"]0['"]/
    )
    assert.doesNotMatch(viteConfigSource, /DOMAIN_BACKEND \|\| ['"]example\.com['"]/)
})
