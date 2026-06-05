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
        const toggleWarp = readProjectFile(
            'src/features/ui/dashboard/nodes/toggle-node-warp/toggle-node-warp.feature.tsx'
        )
        const systemCard = readProjectFile(
            'src/widgets/dashboard/nodes/node-system-card/node-system-card.widget.tsx'
        )

        assert.match(hooks, /useEnableNodeWarp/)
        assert.match(hooks, /useDisableNodeWarp/)
        assert.match(hooks, /useInstallNodeWarp/)
        assert.match(hooks, /useUninstallNodeWarp/)
        assert.match(warpContract, /publicIpv4/)
        assert.match(warpContract, /publicIpv6/)
        assert.match(warpContract, /countryCode: z\.string\(\)\.nullable\(\)/)
        assert.match(warpContract, /HostConnectivitySchema/)
        assert.match(warpContract, /operation/)
        assert.match(warpContract, /\/api\/nodes\/:uuid\/actions\/warp\/install/)
        assert.match(warpContract, /\/api\/nodes\/:uuid\/actions\/warp\/enable/)
        assert.match(warpContract, /\/api\/nodes\/:uuid\/actions\/warp\/disable/)
        assert.match(warpContract, /\/api\/nodes\/:uuid\/actions\/warp\/uninstall/)
        assert.match(nodeCard, /NodeWarpBadgeWidget/)
        assert.match(detailsCard, /ToggleNodeWarpFeature/)
        assert.match(toggleWarp, /Install WARP/)
        assert.match(toggleWarp, /Uninstall WARP/)
        assert.match(systemCard, /WARP/)
        assert.match(systemCard, /IPv4/)
        assert.match(systemCard, /IPv6/)
        assert.match(systemCard, /Host/)
    })

    it('keeps host and WARP addresses readable and copyable', () => {
        const systemCard = readProjectFile(
            'src/widgets/dashboard/nodes/node-system-card/node-system-card.widget.tsx'
        )
        const systemCardCss = readProjectFile(
            'src/widgets/dashboard/nodes/node-system-card/node-system-card.module.css'
        )

        assert.match(systemCard, /NodeNetworkAddress/)
        assert.match(systemCard, /CopyButton/)
        assert.match(systemCard, /CountryFlag/)
        assert.match(systemCard, /Intl\.DisplayNames/)
        assert.match(systemCard, /PiCheck/)
        assert.match(systemCard, /PiCopy/)
        assert.match(systemCard, /aria-label=\{`Copy \$\{section\} \$\{label\}`\}/)
        assert.match(systemCard, /section="Host"/)
        assert.match(systemCard, /section="WARP"/)
        assert.match(systemCard, /countryCode=\{hostData\?\.ipv4\?\.countryCode\}/)
        assert.match(systemCard, /countryCode=\{hostData\?\.ipv6\?\.countryCode\}/)
        assert.match(systemCard, /countryCode=\{warpData\.warp\?\.ipv4\?\.countryCode\}/)
        assert.match(systemCard, /countryCode=\{warpData\.warp\?\.ipv6\?\.countryCode\}/)
        assert.match(systemCard, /className=\{classes\.networkAddressValue\}/)

        const addressValueRule = systemCardCss.match(/\.networkAddressValue\s*{[^}]+}/s)?.[0] ?? ''

        assert.match(addressValueRule, /overflow-wrap:\s*anywhere;/)
        assert.match(addressValueRule, /white-space:\s*normal;/)
        assert.doesNotMatch(addressValueRule, /text-overflow|ellipsis/)
    })
})
