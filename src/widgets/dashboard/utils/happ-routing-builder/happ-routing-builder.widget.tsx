import {
    PiArrowClockwise,
    PiCheck,
    PiCopy,
    PiGear,
    PiGlobe,
    PiGlobeStand,
    PiProhibit,
    PiQrCodeDuotone,
    PiShieldCheck,
    PiShieldStar,
    PiSignOut
} from 'react-icons/pi'
import {
    Accordion,
    Box,
    Button,
    CopyButton,
    Grid,
    Group,
    JsonInput,
    Paper,
    px,
    Select,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { modals } from '@mantine/modals'
import consola from 'consola/browser'
import { renderSVG } from 'uqr'

interface HappRoutingData {
    [key: string]: unknown
    BlockIp?: string[]
    BlockSites?: string[]
    DirectIp?: string[]
    DirectSites?: string[]
    DnsHosts?: Record<string, string>
    DomainStrategy?: string
    DomesticDNSDomain?: string
    DomesticDNSIP?: string
    DomesticDNSIp?: string
    DomesticDNSType?: string
    FakeDNS?: boolean | string
    FakeDns?: boolean | string
    Geoipurl?: string
    GeoipUrl?: string
    Geositeurl?: string
    GeositeUrl?: string
    GlobalProxy?: boolean | string
    LastUpdated?: number | string
    Name?: string
    ProxyIp?: string[]
    ProxySites?: string[]
    RemoteDNSDomain?: string
    RemoteDNSIP?: string
    RemoteDNSIp?: string
    RemoteDNSType?: string
    UseChunkFiles?: string
    useChunkFiles?: string
}

export const HappRoutingBuilderWidget = () => {
    const { t } = useTranslation()
    const [jsonEditorValue, setJsonEditorValue] = useState('')
    const [base64Input, setBase64Input] = useState('')
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
        fakeDns: 'false',
        useChunkFiles: 'true'
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
                consola.error(e)
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

            const formattedData: HappRoutingData = {
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
                DnsHosts: dnsHostsObj as Record<string, string>,
                DirectSites: directSitesArray,
                DirectIp: directIpArray,
                ProxySites: proxySitesArray,
                ProxyIp: proxyIpArray,
                BlockSites: blockSitesArray,
                BlockIp: blockIpArray,
                DomainStrategy: formData.domainStrategy,
                FakeDNS: formData.fakeDns,
                UseChunkFiles: formData.useChunkFiles
            }

            return formattedData
        } catch (error) {
            consola.error(error)
            return {}
        }
    }

    const generateJson = () => {
        return JSON.stringify(formatJsonData(), null, 2)
    }

    const generateBase64 = () => {
        const formattedData = formatJsonData()
        const jsonString = JSON.stringify(formattedData)
        return Buffer.from(jsonString, 'utf8').toString('base64')
    }

    const generateHappLink = () => {
        return `happ://routing/add/${generateBase64()}`
    }

    const updateFormDataFromJson = (jsonData: HappRoutingData) => {
        try {
            const newFormData = { ...formData }

            if (jsonData.Name !== undefined) newFormData.name = jsonData.Name
            if (jsonData.GlobalProxy !== undefined)
                newFormData.globalProxy = String(jsonData.GlobalProxy)

            if (jsonData.RemoteDNSType !== undefined)
                newFormData.remoteDnsType = jsonData.RemoteDNSType
            if (jsonData.RemoteDNSDomain !== undefined)
                newFormData.remoteDnsDomain = jsonData.RemoteDNSDomain
            if (jsonData.RemoteDNSIP !== undefined) newFormData.remoteDnsIp = jsonData.RemoteDNSIP
            if (jsonData.RemoteDNSIp !== undefined) newFormData.remoteDnsIp = jsonData.RemoteDNSIp

            if (jsonData.DomesticDNSType !== undefined)
                newFormData.domesticDnsType = jsonData.DomesticDNSType
            if (jsonData.DomesticDNSDomain !== undefined)
                newFormData.domesticDnsDomain = jsonData.DomesticDNSDomain
            if (jsonData.DomesticDNSIP !== undefined)
                newFormData.domesticDnsIp = jsonData.DomesticDNSIP
            if (jsonData.DomesticDNSIp !== undefined)
                newFormData.domesticDnsIp = jsonData.DomesticDNSIp

            if (jsonData.Geoipurl !== undefined) newFormData.geoipUrl = jsonData.Geoipurl
            if (jsonData.GeoipUrl !== undefined) newFormData.geoipUrl = jsonData.GeoipUrl

            if (jsonData.Geositeurl !== undefined) newFormData.geositeUrl = jsonData.Geositeurl
            if (jsonData.GeositeUrl !== undefined) newFormData.geositeUrl = jsonData.GeositeUrl

            if (jsonData.LastUpdated !== undefined)
                newFormData.lastUpdated = String(jsonData.LastUpdated)
            if (jsonData.DomainStrategy !== undefined)
                newFormData.domainStrategy = jsonData.DomainStrategy

            if (jsonData.FakeDNS !== undefined) newFormData.fakeDns = String(jsonData.FakeDNS)
            if (jsonData.FakeDns !== undefined) newFormData.fakeDns = String(jsonData.FakeDns)
            if (jsonData.UseChunkFiles !== undefined)
                newFormData.useChunkFiles = String(jsonData.UseChunkFiles)

            if (jsonData.useChunkFiles !== undefined)
                newFormData.useChunkFiles = String(jsonData.useChunkFiles)

            if (jsonData.DnsHosts !== undefined) {
                newFormData.dnsHosts = JSON.stringify(jsonData.DnsHosts, null, 2)
            }

            if (jsonData.DirectSites !== undefined && Array.isArray(jsonData.DirectSites)) {
                newFormData.directSites = jsonData.DirectSites.join('\n')
            }
            if (jsonData.DirectIp !== undefined && Array.isArray(jsonData.DirectIp)) {
                newFormData.directIp = jsonData.DirectIp.join('\n')
            }
            if (jsonData.ProxySites !== undefined && Array.isArray(jsonData.ProxySites)) {
                newFormData.proxySites = jsonData.ProxySites.join('\n')
            }
            if (jsonData.ProxyIp !== undefined && Array.isArray(jsonData.ProxyIp)) {
                newFormData.proxyIp = jsonData.ProxyIp.join('\n')
            }
            if (jsonData.BlockSites !== undefined && Array.isArray(jsonData.BlockSites)) {
                newFormData.blockSites = jsonData.BlockSites.join('\n')
            }
            if (jsonData.BlockIp !== undefined && Array.isArray(jsonData.BlockIp)) {
                newFormData.blockIp = jsonData.BlockIp.join('\n')
            }

            setFormData(newFormData)
        } catch (error) {
            consola.error(error)
            // Failed to update form data
        }
    }

    const handleJsonChange = (value: string) => {
        setJsonEditorValue(value)
        try {
            const jsonData = JSON.parse(value) as HappRoutingData
            updateFormDataFromJson(jsonData)
        } catch (error) {
            consola.error(error)
            // Invalid JSON, do nothing
        }
    }

    const decodeBase64Input = () => {
        try {
            const jsonString = Buffer.from(
                base64Input.replace('happ://routing/add/', '').replace('happ://routing/onadd/', ''),
                'base64'
            ).toString('utf8')
            const jsonData = JSON.parse(jsonString) as HappRoutingData

            setJsonEditorValue(JSON.stringify(jsonData, null, 2))

            updateFormDataFromJson(jsonData)
        } catch (error) {
            consola.error(error)
            modals.open({
                title: t('happ-routing-builder.widget.close'),
                centered: true,
                children: (
                    <>
                        <Text>{t('happ-routing-builder.widget.invalid-base64-or-happ-link')}</Text>
                        <Button fullWidth mt="md" onClick={() => modals.closeAll()}>
                            {t('happ-routing-builder.widget.close')}
                        </Button>
                    </>
                )
            })
        }
    }

    const copiedText = t('happ-routing-builder.widget.copy-link')

    const inputStyles = () => ({
        label: { fontWeight: 500, marginBottom: 4 },
        description: {
            fontSize: '0.8rem',
            opacity: 0.7,
            height: '50px'
        }
    })

    useEffect(() => {
        setJsonEditorValue(generateJson())
    }, [formData])

    return (
        <Grid>
            <Grid.Col span={12}>
                <Paper mb="md" p="md" withBorder>
                    <Text fw={700} mb="md" size="lg">
                        {t('happ-routing-builder.widget.import-configuration')}
                    </Text>
                    <Box>
                        <Group align="flex-end">
                            <TextInput
                                description={t(
                                    'happ-routing-builder.widget.paste-a-happ-routing-link-or-base64-encoded-config'
                                )}
                                label={t('happ-routing-builder.widget.import-from-base64')}
                                onChange={(e) => setBase64Input(e.target.value)}
                                placeholder={t(
                                    'happ-routing-builder.widget.paste-base64-or-happ-link-here'
                                )}
                                size="sm"
                                style={{ flex: 1 }}
                                value={base64Input}
                            />
                            <Button
                                leftSection={<PiArrowClockwise size="16px" />}
                                onClick={decodeBase64Input}
                            >
                                {t('happ-routing-builder.widget.decode')}
                            </Button>
                        </Group>
                    </Box>
                </Paper>

                <Paper mb="md" p="md" withBorder>
                    <Group mb="md">
                        <Text fw={700}>{t('happ-routing-builder.widget.encoded-happ-link')}</Text>
                        <CopyButton timeout={2000} value={generateHappLink()}>
                            {({ copied, copy }) => (
                                <Button
                                    color={copied ? 'teal' : 'blue'}
                                    leftSection={
                                        copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />
                                    }
                                    onClick={copy}
                                    size="sm"
                                    variant="light"
                                >
                                    {copied ? t('happ-routing-builder.widget.copied') : copiedText}
                                </Button>
                            )}
                        </CopyButton>
                        <Button
                            leftSection={<PiQrCodeDuotone size="16px" />}
                            onClick={() => {
                                const happLinkQrCode = renderSVG(generateHappLink(), {
                                    whiteColor: '#161B22',
                                    blackColor: '#3CC9DB'
                                })
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
                                                {t('happ-routing-builder.widget.close')}
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
                                wordBreak: 'break-all'
                            }
                        }}
                        value={generateHappLink()}
                    />
                </Paper>

                <Grid gutter="md">
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <Paper mb="md" p="md" withBorder>
                            <Text fw={700} mb="md" size="lg">
                                {t('happ-routing-builder.widget.visual-editor')}
                            </Text>
                            <Accordion defaultValue="basic" variant="separated">
                                <Accordion.Item value="basic">
                                    <Accordion.Control icon={<PiGear size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.basic-configuration')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Grid>
                                            <Grid.Col span={{ xs: 12, sm: 4 }}>
                                                <TextInput
                                                    description={t(
                                                        'happ-routing-builder.widget.enter-the-configuration-name'
                                                    )}
                                                    label={t('happ-routing-builder.widget.name')}
                                                    onChange={(e) =>
                                                        handleInputChange('name', e.target.value)
                                                    }
                                                    placeholder={t(
                                                        'happ-routing-builder.widget.russia'
                                                    )}
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
                                                        handleInputChange(
                                                            'globalProxy',
                                                            value || 'true'
                                                        )
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
                                                            label: t(
                                                                'happ-routing-builder.widget.enable'
                                                            )
                                                        },
                                                        {
                                                            value: 'false',
                                                            label: t(
                                                                'happ-routing-builder.widget.disable'
                                                            )
                                                        }
                                                    ]}
                                                    description={t(
                                                        'happ-routing-builder.widget.fake-dns-description'
                                                    )}
                                                    label={'FakeDNS'}
                                                    onChange={(value) =>
                                                        handleInputChange(
                                                            'fakeDns',
                                                            value || 'false'
                                                        )
                                                    }
                                                    styles={inputStyles}
                                                    value={formData.fakeDns}
                                                />
                                            </Grid.Col>

                                            <Grid.Col span={{ xs: 12, sm: 4 }}>
                                                <Select
                                                    data={[
                                                        {
                                                            value: 'true',
                                                            label: t(
                                                                'happ-routing-builder.widget.enable'
                                                            )
                                                        },
                                                        {
                                                            value: 'false',
                                                            label: t(
                                                                'happ-routing-builder.widget.disable'
                                                            )
                                                        }
                                                    ]}
                                                    label={'useChunkFiles'}
                                                    onChange={(value) =>
                                                        handleInputChange(
                                                            'useChunkFiles',
                                                            value || 'true'
                                                        )
                                                    }
                                                    styles={inputStyles}
                                                    value={formData.useChunkFiles}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="remoteDns">
                                    <Accordion.Control icon={<PiGlobeStand size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.remote-dns-settings')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
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
                                                    label={t(
                                                        'happ-routing-builder.widget.remote-dns-type'
                                                    )}
                                                    onChange={(value) =>
                                                        handleInputChange(
                                                            'remoteDnsType',
                                                            value || 'DoH'
                                                        )
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
                                                    label={t(
                                                        'happ-routing-builder.widget.remote-dns-domain'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'remoteDnsDomain',
                                                            e.target.value
                                                        )
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
                                                    label={t(
                                                        'happ-routing-builder.widget.remote-dns-ip'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'remoteDnsIp',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. 8.8.8.8"
                                                    styles={inputStyles}
                                                    value={formData.remoteDnsIp}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="domesticDns">
                                    <Accordion.Control icon={<PiGlobe size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.domestic-dns-settings')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Grid>
                                            <Grid.Col span={{ xs: 12, sm: 4 }}>
                                                <Select
                                                    data={[
                                                        { value: 'DoH', label: 'DoH' },
                                                        { value: 'DoU', label: 'DoU' }
                                                    ]}
                                                    description={t(
                                                        'happ-routing-builder.widget.domestic-dns-type-description'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.domestic-dns-type'
                                                    )}
                                                    onChange={(value) =>
                                                        handleInputChange(
                                                            'domesticDnsType',
                                                            value || 'DoU'
                                                        )
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
                                                    label={t(
                                                        'happ-routing-builder.widget.domestic-dns-domain'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'domesticDnsDomain',
                                                            e.target.value
                                                        )
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
                                                    label={t(
                                                        'happ-routing-builder.widget.domestic-dns-ip'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'domesticDnsIp',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. 77.88.8.8"
                                                    styles={inputStyles}
                                                    value={formData.domesticDnsIp}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="geoSettings">
                                    <Accordion.Control icon={<PiGlobeStand size={px('1.2rem')} />}>
                                        <Text fw={700}>Geo Settings</Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Grid>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <TextInput
                                                    description={t(
                                                        'happ-routing-builder.widget.geoip-description'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.geoip-url'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'geoipUrl',
                                                            e.target.value
                                                        )
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
                                                    label={t(
                                                        'happ-routing-builder.widget.geosite-url'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'geositeUrl',
                                                            e.target.value
                                                        )
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
                                                    label={t(
                                                        'happ-routing-builder.widget.last-updated'
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'lastUpdated',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. 1693826255"
                                                    styles={inputStyles}
                                                    value={formData.lastUpdated}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Select
                                                    data={[
                                                        {
                                                            value: 'IPIfNonMatch',
                                                            label: 'IPIfNonMatch'
                                                        },
                                                        { value: 'AsIs', label: 'AsIs' },
                                                        { value: 'IPOnDemand', label: 'IPOnDemand' }
                                                    ]}
                                                    description={t(
                                                        'happ-routing-builder.widget.select-the-domain-processing-strategy'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.domain-strategy'
                                                    )}
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
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="dnsHosts">
                                    <Accordion.Control icon={<PiShieldStar size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.dns-hosts-0')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Textarea
                                            autosize
                                            description={t(
                                                'happ-routing-builder.widget.dns-hosts-description'
                                            )}
                                            label={t('happ-routing-builder.widget.dns-hosts')}
                                            minRows={3}
                                            onChange={(e) =>
                                                handleInputChange('dnsHosts', e.target.value)
                                            }
                                            placeholder='{ "example.com": "1.2.3.4", "test.org": "8.8.8.8" }'
                                            value={formData.dnsHosts}
                                        />
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="directRouting">
                                    <Accordion.Control icon={<PiSignOut size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.direct-routing')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Grid>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Textarea
                                                    autosize
                                                    description={t(
                                                        'happ-routing-builder.widget.sites-that-will-use-direct-connection'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.direct-sites'
                                                    )}
                                                    minRows={3}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'directSites',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="geosite:ru&#10;geosite:geolocation-ru"
                                                    value={formData.directSites}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Textarea
                                                    autosize
                                                    description={t(
                                                        'happ-routing-builder.widget.ip-addresses-that-will-use-direct-connection'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.direct-ip'
                                                    )}
                                                    minRows={3}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'directIp',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="geoip:cn"
                                                    value={formData.directIp}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="proxyRouting">
                                    <Accordion.Control icon={<PiShieldCheck size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.proxy-routing')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Grid>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Textarea
                                                    autosize
                                                    description={t(
                                                        'happ-routing-builder.widget.sites-that-will-be-proxied'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.proxy-sites'
                                                    )}
                                                    minRows={3}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'proxySites',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="geosite:com"
                                                    value={formData.proxySites}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Textarea
                                                    autosize
                                                    description={t(
                                                        'happ-routing-builder.widget.ip-addresses-that-will-be-proxied'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.proxy-ip'
                                                    )}
                                                    minRows={3}
                                                    onChange={(e) =>
                                                        handleInputChange('proxyIp', e.target.value)
                                                    }
                                                    placeholder="192.168.1.0/24"
                                                    value={formData.proxyIp}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="blockRouting">
                                    <Accordion.Control icon={<PiProhibit size={px('1.2rem')} />}>
                                        <Text fw={700}>
                                            {t('happ-routing-builder.widget.block-routing')}
                                        </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Grid>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Textarea
                                                    autosize
                                                    description={t(
                                                        'happ-routing-builder.widget.sites-that-will-be-blocked'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.blocked-sites'
                                                    )}
                                                    minRows={3}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'blockSites',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="example.com"
                                                    value={formData.blockSites}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                <Textarea
                                                    autosize
                                                    description={t(
                                                        'happ-routing-builder.widget.ip-addresses-that-will-be-blocked'
                                                    )}
                                                    label={t(
                                                        'happ-routing-builder.widget.blocked-ips'
                                                    )}
                                                    minRows={3}
                                                    onChange={(e) =>
                                                        handleInputChange('blockIp', e.target.value)
                                                    }
                                                    placeholder="10.0.0.0/8"
                                                    value={formData.blockIp}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Paper p="md" withBorder>
                            <Text fw={700} mb="md" size="lg">
                                {t('happ-routing-builder.widget.code-editor')}
                            </Text>
                            <JsonInput
                                formatOnBlur
                                onChange={handleJsonChange}
                                styles={{
                                    input: {
                                        fontFamily: 'monospace',
                                        backgroundColor: 'var(--mantine-color-dark-7)',
                                        height: '100%',
                                        minHeight: '500px'
                                    }
                                }}
                                value={jsonEditorValue}
                            />
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Grid.Col>
        </Grid>
    )
}
