import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const readProjectFile = (path) => readFileSync(join(root, path), 'utf8')

describe('frontend WARP controls', () => {
    it('declares WARP hooks, badge, and detail toggle', () => {
        const hooks = readProjectFile('src/shared/api/hooks/nodes/nodes.mutation.hooks.ts')
        const warpContract = readProjectFile('src/shared/api/hooks/nodes/node-warp-contract.ts')
        const nodeCard = readProjectFile(
            'src/widgets/dashboard/nodes/node-card/node-card.widget.tsx'
        )
        const detailsCard = readProjectFile(
            'src/widgets/dashboard/nodes/node-details-card/node-details-card.widget.tsx'
        )
        const systemCard = readProjectFile(
            'src/widgets/dashboard/nodes/node-system-card/node-system-card.widget.tsx'
        )

        assert.match(hooks, /useEnableNodeWarp/)
        assert.match(hooks, /useDisableNodeWarp/)
        assert.match(warpContract, /\/api\/nodes\/:uuid\/actions\/warp\/enable/)
        assert.match(warpContract, /\/api\/nodes\/:uuid\/actions\/warp\/disable/)
        assert.match(nodeCard, /NodeWarpBadgeWidget/)
        assert.match(detailsCard, /ToggleNodeWarpFeature/)
        assert.match(systemCard, /WARP/)
    })
})
