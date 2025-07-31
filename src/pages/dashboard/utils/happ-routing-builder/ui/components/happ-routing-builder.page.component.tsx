import { Avatar, Button, Container, Group, Paper, px, Stack, Text, Title } from '@mantine/core'
import { PiBookOpenTextDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { HappRoutingBuilderWidget } from '@widgets/dashboard/utils/happ-routing-builder/happ-routing-builder.widget'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

export const HappLogo = ({ size = 48 }: { size?: number }) => (
    <svg
        height={size}
        preserveAspectRatio="xMidYMid meet"
        style={{ borderRadius: '8px', overflow: 'hidden' }}
        viewBox="0 0 460 460"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
    >
        <g
            fill="currentColor"
            stroke="none"
            transform="translate(0.000000,460.000000) scale(0.100000,-0.100000)"
        >
            <path
                d="M0 2300 l0 -2300 2300 0 2300 0 0 2300 0 2300 -2300 0 -2300 0 0
            -2300z m2095 1528 c-2 -13 -16 -93 -30 -178 l-26 -155 -427 -421 c-235 -232
            -428 -421 -428 -420 -1 0 44 270 99 599 l101 597 358 0 358 0 -5 -22z m1420 0
            c-3 -13 -17 -92 -31 -177 l-25 -155 -421 -415 c-231 -229 -424 -417 -428 -419
            -4 -1 37 260 91 580 54 321 99 589 99 596 0 9 79 12 360 12 l360 0 -5 -22z
            m-1441 -788 c-40 -239 -74 -443 -74 -452 0 -17 20 -18 272 -18 l273 0 -265
            -265 -264 -264 -55 -3 -55 -3 -11 -60 -11 -60 -424 -422 c-234 -232 -426 -420
            -427 -419 -2 1 56 353 127 782 l130 779 426 423 c235 233 428 422 429 420 2
            -2 -30 -199 -71 -438z m1492 409 c-3 -17 -62 -369 -132 -782 l-125 -752 -427
            -421 c-235 -232 -428 -421 -429 -420 0 0 35 212 78 471 43 258 79 475 79 482
            0 10 -55 13 -247 13 l-248 0 265 265 c216 216 269 265 294 267 27 3 31 7 34
            35 3 28 63 91 430 453 235 231 429 420 431 420 2 0 1 -14 -3 -31z m-1644
            -2122 l-97 -577 -358 0 -359 0 6 28 c3 15 15 83 26 152 12 68 23 127 25 130
            14 17 850 848 852 846 1 -1 -41 -262 -95 -579z m1430 0 l-97 -577 -358 0 -359
            0 6 28 c3 15 15 85 27 156 l21 129 427 423 c234 232 427 421 428 420 1 -1 -41
            -262 -95 -579z"
            />
        </g>
    </svg>
)

export const HappRoutingBuilderPageComponent = () => {
    const { t } = useTranslation()

    const title = t('constants.happ-routing-builder')

    return (
        <Page title={title}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: title }
                ]}
                title={title}
            />
            <Container fluid p={0} size="xl">
                <Paper mb="xl" p="md" radius="md" shadow="sm" withBorder>
                    <Group align="flex-start" wrap="nowrap">
                        <Avatar radius="md" size="lg" variant="transparent" visibleFrom="sm">
                            <HappLogo />
                        </Avatar>

                        <Stack gap="xs">
                            <Title fw={600} order={4}>
                                {t('happ-routing-builder.page.component.about-happ')}
                            </Title>

                            <Text c="dimmed" lh={1.6} size="sm">
                                {t(
                                    'happ-routing-builder.page.component.happ-is-multiplatform-xray-client'
                                )}
                                <br />
                                {t(
                                    'happ-routing-builder.page.component.about-happ-description-line-2'
                                )}
                                <br />
                                <b>
                                    {t(
                                        'happ-routing-builder.page.component.about-happ-description-line-3'
                                    )}
                                </b>
                            </Text>

                            <Group>
                                <Button
                                    component={Link}
                                    leftSection={<PiBookOpenTextDuotone size={px('1.2rem')} />}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    to={'https://www.happ.su/main/developer-documentation/routing'}
                                    variant="light"
                                >
                                    {t(
                                        'happ-routing-builder.page.component.check-out-happ-website'
                                    )}
                                </Button>
                            </Group>
                        </Stack>
                    </Group>
                </Paper>

                <HappRoutingBuilderWidget />
            </Container>
        </Page>
    )
}
