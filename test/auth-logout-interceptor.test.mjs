import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const axiosSource = readFileSync(new URL('../src/shared/api/axios.ts', import.meta.url), 'utf8')

test('auth interceptor clears the in-memory bearer token before emitting logout', () => {
    assert.match(axiosSource, /export const clearAuthorizationToken = \(\) => \{/)
    assert.match(axiosSource, /authorizationToken = ''/)

    const clearCallIndex = axiosSource.indexOf('clearAuthorizationToken()')
    const logoutEmitIndex = axiosSource.indexOf('logoutEvents.emit()')

    assert.ok(clearCallIndex > -1, 'clearAuthorizationToken() should be called for auth errors')
    assert.ok(logoutEmitIndex > -1, 'logoutEvents.emit() should be called for auth errors')
    assert.ok(
        clearCallIndex < logoutEmitIndex,
        'the bearer token should be cleared before logout events are emitted'
    )
})
