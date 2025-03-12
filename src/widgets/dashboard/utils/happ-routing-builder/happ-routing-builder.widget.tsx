import {
    Box,
    Button,
    CopyButton,
    Divider,
    Grid,
    Group,
    JsonInput,
    Select,
    Stack,
    Tabs,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import {
    PiArrowsDownUp,
    PiCheck,
    PiCopy,
    PiFile,
    PiFloppyDisk,
    PiQrCodeDuotone
} from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useState } from 'react'
import { renderSVG } from 'uqr'

export const HappRoutingBuilderWidget = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<null | string>('visual')
    const [showBase64, setShowBase64] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        globalProxy: 'true',
        remoteDnsType: 'DoH',
        remoteDnsDomain: '',
        remoteDnsIp: '',
        domesticDnsType: 'DoU',
        domesticDnsDomain: '',
        domesticDnsIp: '',
        geoipUrl: '',
        geositeUrl: '',
        lastUpdated: '',
        dnsHosts: '{\n  "example.com": "1.2.3.4",\n  "test.org": "8.8.8.8"\n}',
        directSites: 'geosite:ru\ngeosite:geolocation-ru',
        directIp: 'geoip:cn',
        proxySites: 'geosite:com',
        proxyIp: '',
        blockSites: '',
        blockIp: '',
        domainStrategy: 'IPIfNonMatch',
        fakeDns: 'false'
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }

    const formatJsonData = () => {
        try {
            let dnsHostsObj = {}
            try {
                dnsHostsObj = JSON.parse(formData.dnsHosts)
            } catch (e) {
                // silence
                // console.error('Failed to parse DNS Hosts JSON:', e)
            }

            const directSitesArray = formData.directSites
                .split('\n')
                .filter((line) => line.trim() !== '')
            const directIpArray = formData.directIp.split('\n').filter((line) => line.trim() !== '')
            const proxySitesArray = formData.proxySites
                .split('\n')
                .filter((line) => line.trim() !== '')
            const proxyIpArray = formData.proxyIp.split('\n').filter((line) => line.trim() !== '')
            const blockSitesArray = formData.blockSites
                .split('\n')
                .filter((line) => line.trim() !== '')
            const blockIpArray = formData.blockIp.split('\n').filter((line) => line.trim() !== '')

            const formattedData = {
                Name: formData.name,
                GlobalProxy: formData.globalProxy,
                RemoteDNSType: formData.remoteDnsType,
                RemoteDNSDomain: formData.remoteDnsDomain,
                RemoteDNSIP: formData.remoteDnsIp,
                DomesticDNSType: formData.domesticDnsType,
                DomesticDNSDomain: formData.domesticDnsDomain,
                DomesticDNSIP: formData.domesticDnsIp,
                Geoipurl: formData.geoipUrl,
                Geositeurl: formData.geositeUrl,
                LastUpdated: formData.lastUpdated,
                DnsHosts: dnsHostsObj,
                DirectSites: directSitesArray,
                DirectIp: directIpArray,
                ProxySites: proxySitesArray,
                ProxyIp: proxyIpArray,
                BlockSites: blockSitesArray,
                BlockIp: blockIpArray,
                DomainStrategy: formData.domainStrategy,
                FakeDNS: formData.fakeDns
            }

            return formattedData
        } catch (error) {
            return {}
        }
    }

    const generateJson = () => {
        return JSON.stringify(formatJsonData(), null, 2)
    }

    const generateBase64 = () => {
        const formattedData = formatJsonData()
        const jsonString = JSON.stringify(formattedData)
        return btoa(jsonString)
    }

    const handleSave = () => {
        setActiveTab('code')
        setShowBase64(true)
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        setShowBase64(tab === 'code')
    }

    const generateHappLink = () => {
        return `happ://routing/add/${generateBase64()}`
    }

    const copiedText = t('happ-routing-builder.widget.copy-link')

    const inputStyles = () => ({
        label: { fontWeight: 500, marginBottom: 4 },
        description: {
            fontSize: '0.8rem',
            opacity: 0.7,
            height: '40px'
        }
    })

    return (
        <Grid>
            <Grid.Col span={12}>
                <Stack gap="md">
                    <Group align="normal" justify="flex-start">
                        <Tabs
                            onChange={(value: null | string) => handleTabChange(value || 'visual')}
                            value={activeTab}
                        >
                            <Tabs.List>
                                <Tabs.Tab
                                    leftSection={<PiArrowsDownUp size="1rem" />}
                                    value="visual"
                                >
                                    {t('happ-routing-builder.widget.visual-editor')}
                                </Tabs.Tab>
                                <Tabs.Tab leftSection={<PiFile size="1rem" />} value="code">
                                    {t('happ-routing-builder.widget.code-viewer')}
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs>
                        <Button
                            color="cyan"
                            leftSection={<PiFloppyDisk size="1.2rem" />}
                            onClick={handleSave}
                            variant="light"
                        >
                            {t('happ-routing-builder.widget.encode-happ-link')}
                        </Button>
                    </Group>

                    {activeTab === 'visual' && (
                        <Stack gap="md">
                            <Grid>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.enter-the-configuration-name'
                                        )}
                                        label={t('happ-routing-builder.widget.name')}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder={t('happ-routing-builder.widget.russia')}
                                        styles={inputStyles}
                                        value={formData.name}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <Select
                                        data={[
                                            {
                                                value: 'true',
                                                label: t(
                                                    'happ-routing-builder.widget.proxy-all-traffic-except-rules'
                                                )
                                            },
                                            {
                                                value: 'false',
                                                label: t(
                                                    'happ-routing-builder.widget.direct-all-traffic-except-rules'
                                                )
                                            }
                                        ]}
                                        description={t(
                                            'happ-routing-builder.widget.proxy-all-traffic-except-rules-or-direct-all-traffic-except-rules'
                                        )}
                                        label={'GlobalProxy'}
                                        onChange={(value) =>
                                            handleInputChange('globalProxy', value || 'true')
                                        }
                                        styles={inputStyles}
                                        value={formData.globalProxy}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <Select
                                        data={[
                                            {
                                                value: 'true',
                                                label: t('happ-routing-builder.widget.enable')
                                            },
                                            {
                                                value: 'false',
                                                label: t('happ-routing-builder.widget.disable')
                                            }
                                        ]}
                                        description={t(
                                            'happ-routing-builder.widget.fake-dns-description'
                                        )}
                                        label={'FakeDNS'}
                                        onChange={(value) =>
                                            handleInputChange('fakeDns', value || 'false')
                                        }
                                        styles={inputStyles}
                                        value={formData.fakeDns}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Divider />

                            <Grid>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <Select
                                        data={[
                                            { value: 'DoH', label: 'DoH' },
                                            { value: 'DoU', label: 'DoU' }
                                        ]}
                                        description={t(
                                            'happ-routing-builder.widget.choose-doh-dns-over-https-or-dou-dns-over-udp'
                                        )}
                                        label={t('happ-routing-builder.widget.remote-dns-type')}
                                        onChange={(value) =>
                                            handleInputChange('remoteDnsType', value || 'DoH')
                                        }
                                        styles={inputStyles}
                                        value={formData.remoteDnsType}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.domain-name-for-doh'
                                        )}
                                        label={t('happ-routing-builder.widget.remote-dns-domain')}
                                        onChange={(e) =>
                                            handleInputChange('remoteDnsDomain', e.target.value)
                                        }
                                        placeholder="e.g. dns.google"
                                        styles={inputStyles}
                                        value={formData.remoteDnsDomain}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.server-ip-for-doh-or-dou'
                                        )}
                                        label={t('happ-routing-builder.widget.remote-dns-ip')}
                                        onChange={(e) =>
                                            handleInputChange('remoteDnsIp', e.target.value)
                                        }
                                        placeholder="e.g. 8.8.8.8"
                                        styles={inputStyles}
                                        value={formData.remoteDnsIp}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Divider />

                            <Grid>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <Select
                                        data={[
                                            { value: 'DoH', label: 'DoH' },
                                            { value: 'DoU', label: 'DoU' }
                                        ]}
                                        description={t(
                                            'happ-routing-builder.widget.domenstic-dns-type-description'
                                        )}
                                        label={t('happ-routing-builder.widget.domestic-dns-type')}
                                        onChange={(value) =>
                                            handleInputChange('domesticDnsType', value || 'DoU')
                                        }
                                        styles={inputStyles}
                                        value={formData.domesticDnsType}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.domain-name-for-doh-0'
                                        )}
                                        label={t('happ-routing-builder.widget.domestic-dns-domain')}
                                        onChange={(e) =>
                                            handleInputChange('domesticDnsDomain', e.target.value)
                                        }
                                        placeholder="e.g. dns.yandex"
                                        styles={inputStyles}
                                        value={formData.domesticDnsDomain}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.server-ip-for-doh-or-dou-0'
                                        )}
                                        label={t('happ-routing-builder.widget.domestic-dns-ip')}
                                        onChange={(e) =>
                                            handleInputChange('domesticDnsIp', e.target.value)
                                        }
                                        placeholder="e.g. 77.88.8.8"
                                        styles={inputStyles}
                                        value={formData.domesticDnsIp}
                                    />
                                </Grid.Col>
                            </Grid>
                            <Divider />
                            <Grid>
                                <Grid.Col span={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.geoip-description'
                                        )}
                                        label={t('happ-routing-builder.widget.geoip-url')}
                                        onChange={(e) =>
                                            handleInputChange('geoipUrl', e.target.value)
                                        }
                                        placeholder="https://github.com/v2fly/geoip/releases/latest/download/geoip.dat"
                                        styles={inputStyles}
                                        value={formData.geoipUrl}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.geosite-description'
                                        )}
                                        label={t('happ-routing-builder.widget.geosite-url')}
                                        onChange={(e) =>
                                            handleInputChange('geositeUrl', e.target.value)
                                        }
                                        placeholder="https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat"
                                        styles={inputStyles}
                                        value={formData.geositeUrl}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        description={t(
                                            'happ-routing-builder.widget.unix-timestamp-description'
                                        )}
                                        label={t('happ-routing-builder.widget.last-updated')}
                                        onChange={(e) =>
                                            handleInputChange('lastUpdated', e.target.value)
                                        }
                                        placeholder="e.g. 1693826255"
                                        styles={inputStyles}
                                        value={formData.lastUpdated}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ xs: 12, sm: 6 }}>
                                    <Select
                                        data={[
                                            { value: 'IPIfNonMatch', label: 'IPIfNonMatch' },
                                            { value: 'AsIs', label: 'AsIs' },
                                            { value: 'IPOnDemand', label: 'IPOnDemand' }
                                        ]}
                                        description={t(
                                            'happ-routing-builder.widget.select-the-domain-processing-strategy'
                                        )}
                                        label={t('happ-routing-builder.widget.domain-strategy')}
                                        onChange={(value) =>
                                            handleInputChange(
                                                'domainStrategy',
                                                value || 'IPIfNonMatch'
                                            )
                                        }
                                        styles={inputStyles}
                                        value={formData.domainStrategy}
                                    />
                                </Grid.Col>
                            </Grid>
                            <Divider />
                            <Textarea
                                autosize
                                description={t('happ-routing-builder.widget.dns-hosts-description')}
                                label={t('happ-routing-builder.widget.dns-hosts')}
                                minRows={3}
                                onChange={(e) => handleInputChange('dnsHosts', e.target.value)}
                                placeholder='{ "example.com": "1.2.3.4", "test.org": "8.8.8.8" }'
                                value={formData.dnsHosts}
                            />

                            <Grid>
                                <Grid.Col span={6}>
                                    <Textarea
                                        autosize
                                        description={t(
                                            'happ-routing-builder.widget.sites-that-will-use-direct-connection'
                                        )}
                                        label={t('happ-routing-builder.widget.direct-sites')}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleInputChange('directSites', e.target.value)
                                        }
                                        placeholder="geosite:ru&#10;geosite:geolocation-ru"
                                        value={formData.directSites}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Textarea
                                        autosize
                                        description={t(
                                            'happ-routing-builder.widget.ip-addresses-that-will-use-direct-connection'
                                        )}
                                        label={t('happ-routing-builder.widget.direct-ip')}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleInputChange('directIp', e.target.value)
                                        }
                                        placeholder="geoip:cn"
                                        value={formData.directIp}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Grid>
                                <Grid.Col span={6}>
                                    <Textarea
                                        autosize
                                        description={t(
                                            'happ-routing-builder.widget.sites-that-will-be-proxied'
                                        )}
                                        label={t('happ-routing-builder.widget.proxy-sites')}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleInputChange('proxySites', e.target.value)
                                        }
                                        placeholder="geosite:com"
                                        value={formData.proxySites}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Textarea
                                        autosize
                                        description={t(
                                            'happ-routing-builder.widget.ip-addresses-that-will-be-proxied'
                                        )}
                                        label={t('happ-routing-builder.widget.proxy-ip')}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleInputChange('proxyIp', e.target.value)
                                        }
                                        placeholder="192.168.1.0/24"
                                        value={formData.proxyIp}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Grid>
                                <Grid.Col span={6}>
                                    <Textarea
                                        autosize
                                        description={t(
                                            'happ-routing-builder.widget.sites-that-will-be-blocked'
                                        )}
                                        label={t('happ-routing-builder.widget.blocked-sites')}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleInputChange('blockSites', e.target.value)
                                        }
                                        placeholder="example.com"
                                        value={formData.blockSites}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Textarea
                                        autosize
                                        description={t(
                                            'happ-routing-builder.widget.ip-addresses-that-will-be-blocked'
                                        )}
                                        label={t('happ-routing-builder.widget.blocked-ips')}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleInputChange('blockIp', e.target.value)
                                        }
                                        placeholder="10.0.0.0/8"
                                        value={formData.blockIp}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    )}

                    {activeTab === 'code' && (
                        <Stack gap="md">
                            <JsonInput
                                formatOnBlur
                                size="xl"
                                styles={{
                                    input: {
                                        fontFamily: 'monospace',
                                        backgroundColor: 'var(--mantine-color-dark-7)',
                                        height: '500px'
                                    }
                                }}
                                value={generateJson()}
                            />

                            {showBase64 && (
                                <Box mt="md">
                                    <Group mb="xs" mt="md">
                                        <Text fw={500}>
                                            {t('happ-routing-builder.widget.encoded-happ-link')}
                                        </Text>
                                        <CopyButton timeout={2000} value={generateHappLink()}>
                                            {({ copied, copy }) => (
                                                <Button
                                                    color={copied ? 'teal' : 'blue'}
                                                    leftSection={
                                                        copied ? (
                                                            <PiCheck size="1rem" />
                                                        ) : (
                                                            <PiCopy size="1rem" />
                                                        )
                                                    }
                                                    onClick={copy}
                                                    size="sm"
                                                    variant="light"
                                                >
                                                    {copied
                                                        ? t('happ-routing-builder.widget.copied')
                                                        : copiedText}
                                                </Button>
                                            )}
                                        </CopyButton>
                                        <Button
                                            leftSection={<PiQrCodeDuotone size="1rem" />}
                                            onClick={() => {
                                                const happLinkQrCode = renderSVG(
                                                    generateHappLink(),
                                                    {
                                                        whiteColor: '#161B22',
                                                        blackColor: '#3CC9DB'
                                                    }
                                                )
                                                modals.open({
                                                    centered: true,
                                                    title: 'Happ Routing QR Code',
                                                    children: (
                                                        <>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: happLinkQrCode
                                                                }}
                                                            />
                                                            <Button
                                                                fullWidth
                                                                mt="md"
                                                                onClick={() => modals.closeAll()}
                                                            >
                                                                {t(
                                                                    'happ-routing-builder.widget.close'
                                                                )}
                                                            </Button>
                                                        </>
                                                    )
                                                })
                                            }}
                                            size="sm"
                                            variant="light"
                                        >
                                            {t('happ-routing-builder.widget.show-qr')}
                                        </Button>
                                    </Group>
                                    <Textarea
                                        autosize
                                        minRows={3}
                                        readOnly
                                        styles={{
                                            input: {
                                                fontFamily: 'monospace',
                                                backgroundColor: 'var(--mantine-color-dark-8)',
                                                wordBreak: 'break-all'
                                            }
                                        }}
                                        value={generateHappLink()}
                                    />
                                </Box>
                            )}
                        </Stack>
                    )}
                </Stack>
            </Grid.Col>
        </Grid>
    )
}
