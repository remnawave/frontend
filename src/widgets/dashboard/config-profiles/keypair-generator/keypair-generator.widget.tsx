import { Button, Divider, Group, px, Stack, Tabs, Transition } from '@mantine/core'
import { TbKey, TbLock, TbSignature } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { PiKey } from 'react-icons/pi'
import { useState } from 'react'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { CopyableAreaShared } from '@shared/ui/copyable-area/copyable-area'

import { generateMlDsa65, generateMlKem768, generateX25519 } from './keypair-utils'
import classes from './KeypairGenerator.module.css'

const enum TabTypes {
    ML_DSA65 = 'ml-dsa65',
    ML_KEM768 = 'ml-kem768',
    X25519 = 'x25519'
}

export const KeypairGeneratorWidget = () => {
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.X25519)

    const [keyPair, setKeyPair] = useState(generateX25519)
    const [mlDsa65KeyPair, setMlDsa65KeyPair] = useState(generateMlDsa65)
    const [mlKem768KeyPair, setMlKem768KeyPair] = useState(generateMlKem768)

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
                                        label={t('keypair.widget.public-key')}
                                        value={keyPair.publicKey}
                                    />
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
                                        onClick={() => setKeyPair(generateX25519)}
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
                                        onClick={() => setMlDsa65KeyPair(generateMlDsa65)}
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
