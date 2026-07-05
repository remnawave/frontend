import {
    Alert,
    Badge,
    Button,
    Checkbox,
    Divider,
    Group,
    px,
    Stack,
    Tabs,
    Text,
    Transition
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiKey } from 'react-icons/pi'
import { TbAlertTriangle, TbKey, TbLock, TbPlus, TbSignature } from 'react-icons/tb'

import { CopyableAreaShared } from '@shared/ui/copyable-area/copyable-area'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'

import { generateMlDsa65, generateMlKem768, generateX25519 } from './keypair-utils'
import classes from './keypair-generator.module.css'

const enum TabTypes {
    ML_DSA65 = 'ml-dsa65',
    ML_KEM768 = 'ml-kem768',
    X25519 = 'x25519'
}

type ApplicableTab = TabTypes.ML_DSA65 | TabTypes.X25519

interface IProps {
    applyConfigValue?: (value: string) => void
    getConfigValue?: () => string
}

interface IRealityInbound {
    protocol?: string
    streamSettings?: {
        realitySettings?: Record<string, string | undefined>
    }
    tag?: string
}

interface IXrayConfig {
    inbounds?: IRealityInbound[]
}

const APPLY_FIELDS: Record<ApplicableTab, { privateField: string; publicField: string }> = {
    [TabTypes.X25519]: { privateField: 'privateKey', publicField: 'publicKey' },
    [TabTypes.ML_DSA65]: { privateField: 'mldsa65Seed', publicField: 'mldsa65Verify' }
}

const generateKeyPairFor = (tab: ApplicableTab): { priv: string; pub: string } => {
    if (tab === TabTypes.X25519) {
        const kp = generateX25519()
        return { priv: kp.privateKey, pub: kp.password }
    }
    const kp = generateMlDsa65()
    return { priv: kp.mldsa65Seed, pub: kp.mldsa65Verify }
}

const collectRealityInbounds = (
    config: IXrayConfig | null | undefined,
    privateField: string
): { protocol: string; tag: string }[] => {
    const inbounds = config?.inbounds
    if (!Array.isArray(inbounds)) return []
    return inbounds
        .filter(
            (inbound) =>
                typeof inbound.tag === 'string' &&
                typeof inbound.streamSettings?.realitySettings?.[privateField] === 'string'
        )
        .map((inbound) => ({ protocol: inbound.protocol ?? '', tag: inbound.tag as string }))
}

export const KeypairGeneratorWidget = (props: IProps) => {
    const { applyConfigValue, getConfigValue } = props
    const { t } = useTranslation()

    const canApply = Boolean(getConfigValue && applyConfigValue)

    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.X25519)

    const [keyPair, setKeyPair] = useState(generateX25519)
    const [mlDsa65KeyPair, setMlDsa65KeyPair] = useState(generateMlDsa65)
    const [mlKem768KeyPair, setMlKem768KeyPair] = useState(generateMlKem768)

    const [x25519Selection, setX25519Selection] = useState<string[]>([])
    const [mlDsa65Selection, setMlDsa65Selection] = useState<string[]>([])

    const parsedConfig = useMemo<IXrayConfig | null | undefined>(() => {
        if (!getConfigValue) return null
        try {
            return JSON.parse(getConfigValue()) as IXrayConfig
        } catch {
            return undefined
        }
    }, [getConfigValue])

    const realityInboundsByTab = useMemo(
        () => ({
            [TabTypes.X25519]: collectRealityInbounds(
                parsedConfig,
                APPLY_FIELDS[TabTypes.X25519].privateField
            ),
            [TabTypes.ML_DSA65]: collectRealityInbounds(
                parsedConfig,
                APPLY_FIELDS[TabTypes.ML_DSA65].privateField
            )
        }),
        [parsedConfig]
    )

    const x25519Both = `"password": "${keyPair.password}",
"privateKey": "${keyPair.privateKey}",`

    const mlDsa65Both = `"mldsa65Seed": "${mlDsa65KeyPair.mldsa65Seed}",
"mldsa65Verify": "${mlDsa65KeyPair.mldsa65Verify}",`

    const applyToInbounds = (tab: ApplicableTab, selectedTags: string[]) => {
        if (!getConfigValue || !applyConfigValue) return

        let config: IXrayConfig
        try {
            config = JSON.parse(getConfigValue()) as IXrayConfig
        } catch {
            notifications.show({
                color: 'red',
                message: t('keypair-generator.widget.invalid-config'),
                title: t('keypair-generator.widget.error')
            })
            return
        }

        const { privateField, publicField } = APPLY_FIELDS[tab]
        const selected = new Set(selectedTags)
        let applied = 0

        for (const inbound of config.inbounds ?? []) {
            if (!inbound.tag || !selected.has(inbound.tag)) continue

            const realitySettings = inbound.streamSettings?.realitySettings
            if (!realitySettings || typeof realitySettings[privateField] !== 'string') continue

            const { priv, pub } = generateKeyPairFor(tab)
            realitySettings[privateField] = priv
            if (typeof realitySettings[publicField] === 'string') {
                realitySettings[publicField] = pub
            }
            applied += 1
        }

        if (applied === 0) {
            notifications.show({
                color: 'yellow',
                message: t('keypair-generator.widget.nothing-applied'),
                title: t('keypair-generator.widget.error')
            })
            return
        }

        applyConfigValue(JSON.stringify(config, null, 2))
        notifications.show({
            color: 'teal',
            message: t('keypair-generator.widget.applied', { count: applied }),
            title: t('keypair-generator.widget.success')
        })
    }

    const renderActions = (tab: ApplicableTab, onGenerate: () => void, selection: string[]) => {
        const hasInbounds = canApply && realityInboundsByTab[tab].length > 0

        return (
            <Group justify={hasInbounds ? 'space-between' : 'flex-end'}>
                <Button
                    leftSection={<PiKey size={px('1.2rem')} />}
                    onClick={onGenerate}
                    size="sm"
                    variant="default"
                >
                    {t('keypair-generator.widget.generate')}
                </Button>

                {hasInbounds && (
                    <Button
                        disabled={selection.length === 0}
                        leftSection={<TbPlus size={px('1.2rem')} />}
                        onClick={() => applyToInbounds(tab, selection)}
                        size="sm"
                    >
                        {t('keypair-generator.widget.apply')}
                    </Button>
                )}
            </Group>
        )
    }

    const renderInboundList = (
        tab: ApplicableTab,
        selection: string[],
        setSelection: (value: string[]) => void
    ) => {
        if (!canApply) return null

        const inbounds = realityInboundsByTab[tab]

        return (
            <>
                <Divider />
                <Stack gap="xs">
                    <Text fw={600} size="sm">
                        {t('keypair-generator.widget.apply-to-inbounds')}
                    </Text>

                    {parsedConfig === undefined && (
                        <Alert color="red" icon={<TbAlertTriangle size={16} />} variant="light">
                            {t('keypair-generator.widget.invalid-config')}
                        </Alert>
                    )}

                    {parsedConfig !== undefined && inbounds.length === 0 && (
                        <Text c="dimmed" size="sm">
                            {t('keypair-generator.widget.no-reality-inbounds')}
                        </Text>
                    )}

                    {inbounds.length > 0 && (
                        <Checkbox.Group onChange={setSelection} value={selection}>
                            <Stack gap="xs">
                                {inbounds.map((inbound) => (
                                    <Checkbox.Card
                                        className={classes.compactRoot}
                                        key={inbound.tag}
                                        radius="md"
                                        value={inbound.tag}
                                    >
                                        <Group
                                            align="center"
                                            gap="xs"
                                            justify="space-between"
                                            wrap="nowrap"
                                        >
                                            <Group
                                                align="center"
                                                gap="xs"
                                                style={{ flex: 1, minWidth: 0 }}
                                                wrap="nowrap"
                                            >
                                                <Checkbox.Indicator size="sm" />
                                                <Text
                                                    className={classes.compactLabel}
                                                    size="xs"
                                                    truncate
                                                >
                                                    {inbound.tag}
                                                </Text>
                                            </Group>

                                            {inbound.protocol && (
                                                <Badge color="blue" size="md" variant="light">
                                                    {inbound.protocol}
                                                </Badge>
                                            )}
                                        </Group>
                                    </Checkbox.Card>
                                ))}
                            </Stack>
                        </Checkbox.Group>
                    )}
                </Stack>
            </>
        )
    }

    return (
        <Stack gap="lg">
            <Tabs
                keepMounted
                keepMountedMode="display-none"
                onChange={(value) => value && setActiveTab(value as TabTypes)}
                value={activeTab}
            >
                <Tabs.List grow mb="md">
                    <Tabs.Tab
                        key={TabTypes.X25519}
                        leftSection={<TbKey size={16} />}
                        value={TabTypes.X25519}
                    >
                        X25519
                    </Tabs.Tab>

                    <Tabs.Tab
                        key={TabTypes.ML_DSA65}
                        leftSection={<TbSignature size={16} />}
                        value={TabTypes.ML_DSA65}
                    >
                        ML-DSA65
                    </Tabs.Tab>

                    <Tabs.Tab
                        key={TabTypes.ML_KEM768}
                        leftSection={<TbLock size={16} />}
                        value={TabTypes.ML_KEM768}
                    >
                        ML-KEM768
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={TabTypes.X25519}>
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === TabTypes.X25519}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <Stack gap="xs">
                                    <CopyableFieldShared
                                        label="Password"
                                        value={keyPair.password}
                                    />
                                    <CopyableFieldShared
                                        label="Private Key"
                                        value={keyPair.privateKey}
                                    />
                                </Stack>

                                <Divider />

                                <Stack gap="xs">
                                    <CopyableAreaShared
                                        label={t('keypair.widget.both-keys')}
                                        value={x25519Both}
                                    />
                                </Stack>

                                {renderActions(
                                    TabTypes.X25519,
                                    () => setKeyPair(generateX25519),
                                    x25519Selection
                                )}

                                {renderInboundList(
                                    TabTypes.X25519,
                                    x25519Selection,
                                    setX25519Selection
                                )}
                            </Stack>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value={TabTypes.ML_DSA65}>
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === TabTypes.ML_DSA65}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <Stack gap="xs">
                                    <CopyableFieldShared
                                        label="mldsa65Seed (server side)"
                                        value={mlDsa65KeyPair.mldsa65Seed}
                                    />

                                    <CopyableFieldShared
                                        label="mldsa65Verify (Client side, pqv)"
                                        value={mlDsa65KeyPair.mldsa65Verify}
                                    />
                                </Stack>

                                <Divider />

                                <Stack gap="xs">
                                    <CopyableAreaShared label="Both keys" value={mlDsa65Both} />
                                </Stack>

                                {renderActions(
                                    TabTypes.ML_DSA65,
                                    () => setMlDsa65KeyPair(generateMlDsa65),
                                    mlDsa65Selection
                                )}

                                {renderInboundList(
                                    TabTypes.ML_DSA65,
                                    mlDsa65Selection,
                                    setMlDsa65Selection
                                )}
                            </Stack>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value={TabTypes.ML_KEM768}>
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === TabTypes.ML_KEM768}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <Stack gap="xs">
                                    <CopyableFieldShared
                                        label="Server side, used in decryption"
                                        value={mlKem768KeyPair.mlkem768Seed}
                                    />

                                    <CopyableFieldShared
                                        label="Client side, used in encryption"
                                        value={mlKem768KeyPair.mlkem768PublicKey}
                                    />
                                </Stack>

                                <Group justify="flex-end">
                                    <Button
                                        leftSection={<PiKey size={px('1.2rem')} />}
                                        onClick={() => setMlKem768KeyPair(generateMlKem768)}
                                        size="sm"
                                        variant="default"
                                    >
                                        {t('keypair.widget.generate-key-pair')}
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                    </Transition>
                </Tabs.Panel>
            </Tabs>
        </Stack>
    )
}
