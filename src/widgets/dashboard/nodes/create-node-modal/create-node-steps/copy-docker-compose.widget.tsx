import { Button, CopyButton, Group, Skeleton } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { SiDocker } from 'react-icons/si'
import { PiCheck } from 'react-icons/pi'

import { useGetPubKey } from '@shared/api/hooks'

interface IProps {
    port?: number
}

export const CopyDockerComposeWidget = ({ port }: IProps) => {
    const { data: pubKey, isLoading: isPubKeyLoading } = useGetPubKey()
    const { t } = useTranslation()

    if (isPubKeyLoading || !pubKey) {
        return <Skeleton height={40} />
    }

    const generateDockerCompose = (port?: number) => {
        return `services:
  remnanode:
    container_name: remnanode
    hostname: remnanode
    image: remnawave/node:latest
    network_mode: host
    restart: always
    ulimits:
      nofile:
        soft: 1048576
        hard: 1048576
    environment:
      - NODE_PORT=${port ?? 2222}
      - SECRET_KEY="${pubKey.pubKey.trimEnd()}"`
    }

    return (
        <Group mt="lg">
            <CopyButton timeout={2000} value={generateDockerCompose(port)}>
                {({ copied, copy }) => (
                    <Button
                        color={copied ? 'teal' : 'gray'}
                        fullWidth
                        leftSection={copied ? <PiCheck size={18} /> : <SiDocker size={18} />}
                        onClick={copy}
                        size="md"
                    >
                        {t('copy-docker-compose.widget.copy-docker-compose-yml')}
                    </Button>
                )}
            </CopyButton>
        </Group>
    )
}
