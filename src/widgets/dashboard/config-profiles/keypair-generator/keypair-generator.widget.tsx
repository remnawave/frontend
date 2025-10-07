/* eslint-disable camelcase */
import { Button, Divider, Group, px, Stack, Tabs, Transition } from '@mantine/core'
import { PiGearSixDuotone, PiKey, PiNoteDuotone } from 'react-icons/pi'
import { randomBytes } from '@noble/post-quantum/utils.js'
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js'
import { generateKeyPair } from '@stablelib/x25519'
import { encodeURLSafe } from '@stablelib/base64'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { CopyableAreaShared } from '@shared/ui/copyable-area/copyable-area'

import classes from './KeypairGenerator.module.css'

const enum TabTypes {
    CLASSIC = 'classic',
    ML_DSA65 = 'ml-dsa65'
}

export const KeypairGeneratorWidget = () => {
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.CLASSIC)

    const [keyPair, setKeyPair] = useState<{
        privateKey: string
        publicKey: string
    }>({
        publicKey: '',
        privateKey: ''
    })

    const [mlDsa65KeyPair, setMlDsa65KeyPair] = useState<{
        mldsa65Seed: string
        mldsa65Verify: string
    }>({
        mldsa65Verify: '',
        mldsa65Seed: ''
    })

    const generatePublicAndPrivate = () => {
        const keyPair = generateKeyPair()
        setKeyPair({
            privateKey: encodeURLSafe(keyPair.secretKey).replace(/=/g, '').replace(/\n/g, ''),
            publicKey: encodeURLSafe(keyPair.publicKey).replace(/=/g, '').replace(/\n/g, '')
        })
    }

    const generateMlDsa65KeyPair = () => {
        const seed = randomBytes(32)
        const mldsa65KeyPair = ml_dsa65.keygen(seed)
        setMlDsa65KeyPair({
            mldsa65Verify: encodeURLSafe(mldsa65KeyPair.publicKey)
                .replace(/=/g, '')
                .replace(/\n/g, ''),
            mldsa65Seed: encodeURLSafe(seed).replace(/=/g, '').replace(/\n/g, '')
        })
    }

    useEffect(() => {
        generatePublicAndPrivate()
        generateMlDsa65KeyPair()
    }, [])

    return (
        <Stack gap="lg">
            <Tabs
                classNames={classes}
                keepMounted
                onChange={(value) => value && setActiveTab(value as TabTypes)}
                value={activeTab}
                variant="unstyled"
            >
                <Tabs.List grow mb="md">
                    <Tabs.Tab
                        key={TabTypes.CLASSIC}
                        leftSection={<PiNoteDuotone size={16} />}
                        value={TabTypes.CLASSIC}
                    >
                        Classic
                    </Tabs.Tab>

                    <Tabs.Tab
                        key={TabTypes.ML_DSA65}
                        leftSection={<PiGearSixDuotone size={16} />}
                        value={TabTypes.ML_DSA65}
                    >
                        ML-DSA65
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={TabTypes.CLASSIC}>
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === TabTypes.CLASSIC}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <Stack gap="xs">
                                    <CopyableFieldShared
                                        label={t('keypair.widget.public-key')}
                                        value={keyPair.publicKey}
                                    />
                                </Stack>

                                <Stack gap="xs">
                                    <CopyableFieldShared
                                        label={t('keypair.widget.private-key')}
                                        value={keyPair.privateKey}
                                    />
                                </Stack>

                                <Divider />

                                <Stack gap="xs">
                                    <CopyableAreaShared
                                        label={t('keypair.widget.both-keys')}
                                        value={`"publicKey": "${keyPair.publicKey}",
"privateKey": "${keyPair.privateKey}",`}
                                    />
                                </Stack>

                                <Group justify="flex-end">
                                    <Button
                                        leftSection={<PiKey size={px('1.2rem')} />}
                                        onClick={generatePublicAndPrivate}
                                        radius="md"
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
                                    <CopyableAreaShared
                                        label="Both keys"
                                        value={`"mldsa65Seed": "${mlDsa65KeyPair.mldsa65Seed}", 
"mldsa65Verify": "${mlDsa65KeyPair.mldsa65Verify}",`}
                                    />
                                </Stack>
                                <Group justify="flex-end">
                                    <Button
                                        leftSection={<PiKey size={px('1.2rem')} />}
                                        onClick={generateMlDsa65KeyPair}
                                        radius="md"
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
