import { Tabs } from '@mantine/core'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { AcmeCertificatesListWidget } from '@widgets/dashboard/acme/certificates-list/certificates-list.widget'
import { AcmeCredentialsGridWidget } from '@widgets/dashboard/acme/credentials-grid/credentials-grid.widget'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { TbCertificate, TbKey } from 'react-icons/tb'
import { z } from 'zod'

import { AcmeCertificateSchema, AcmeCredentialSchema } from '@shared/api/contracts/acme.contract'
import { Page, PageHeaderShared } from '@shared/ui'

interface Props {
    certificates: z.infer<typeof AcmeCertificateSchema>[]
    credentials: z.infer<typeof AcmeCredentialSchema>[]
    nodes: GetNodesCommand.Response['response']
}

export const AcmePageComponent = (props: Props) => {
    const { certificates, credentials, nodes } = props

    const { t } = useTranslation()

    return (
        <Page title={t('constants.certificates')}>
            <PageHeaderShared
                icon={<TbCertificate size={24} />}
                title={t('constants.certificates')}
            />

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Tabs defaultValue="certificates" keepMounted={false}>
                    <Tabs.List mb="md">
                        <Tabs.Tab leftSection={<TbCertificate size={16} />} value="certificates">
                            Certificates
                        </Tabs.Tab>
                        <Tabs.Tab leftSection={<TbKey size={16} />} value="credentials">
                            Credentials
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="certificates">
                        <AcmeCertificatesListWidget
                            certificates={certificates}
                            credentials={credentials}
                            nodes={nodes}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="credentials">
                        <AcmeCredentialsGridWidget credentials={credentials} />
                    </Tabs.Panel>
                </Tabs>
            </motion.div>
        </Page>
    )
}
