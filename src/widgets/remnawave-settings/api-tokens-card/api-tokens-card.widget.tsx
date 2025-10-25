import {
    ActionIcon,
    Box,
    Button,
    Center,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Transition
} from '@mantine/core'
import { CreateApiTokenCommand, FindAllApiTokensCommand } from '@remnawave/backend-contract'
import { PiBookOpenTextDuotone, PiEmpty } from 'react-icons/pi'
import { TbCookie, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { SiSwagger } from 'react-icons/si'
import { useField } from '@mantine/form'
import { Link } from 'react-router-dom'

import { useCreateApiToken, useGetApiTokens } from '@shared/api/hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { LoadingScreen } from '@shared/ui'

import { ApiTokenItem } from './api-token-item'

interface IProps {
    apiTokensData: FindAllApiTokensCommand.Response['response']
}

export const ApiTokensCardWidget = (props: IProps) => {
    const { apiTokensData } = props
    const { t } = useTranslation()

    const tokenNameField = useField<CreateApiTokenCommand.Request['tokenName']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateApiTokenCommand.RequestSchema.safeParse({ tokenName: value })
            return result.success ? null : result.error.errors[0]?.message
        }
    })

    const [opened, { open, close }] = useDisclosure(false)

    const { isLoading, isRefetching, refetch } = useGetApiTokens()
    const { mutate: createApiToken, isPending: isCreateApiTokenPending } = useCreateApiToken({
        mutationFns: {
            onSuccess: () => {
                close()
                tokenNameField.reset()
                refetch()
            }
        }
    })

    return (
        <>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('api-tokens-card.widget.api-tokens-description')}
                    icon={<TbCookie size={24} />}
                    title={t('api-tokens-card.widget.api-tokens')}
                />

                <SettingsCardShared.Content>
                    {isLoading && <LoadingScreen height="300px" />}

                    {!isLoading && apiTokensData.apiKeys.length === 0 && (
                        <Center h="300px">
                            <Stack align="center" gap="xs">
                                <PiEmpty size={48} />
                                <Text c="dimmed" size="sm" ta="center">
                                    {t('api-tokens-card.widget.no-api-tokens-found')}
                                </Text>
                            </Stack>
                        </Center>
                    )}

                    <Transition mounted={apiTokensData.apiKeys.length > 0} transition="fade">
                        {(styles) => (
                            <Box style={{ ...styles }}>
                                {!isLoading && apiTokensData.apiKeys.length > 0 && (
                                    <ScrollArea h="300px" mah="300px">
                                        <Stack gap="xs">
                                            {apiTokensData?.apiKeys.map((apiToken) => (
                                                <ApiTokenItem
                                                    apiToken={apiToken}
                                                    key={apiToken.uuid}
                                                />
                                            ))}
                                        </Stack>
                                    </ScrollArea>
                                )}
                            </Box>
                        )}
                    </Transition>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="space-between">
                        <ActionIcon.Group>
                            <ActionIcon
                                loading={isRefetching}
                                onClick={() => refetch()}
                                size="input-md"
                                variant="light"
                            >
                                <TbRefresh size={24} />
                            </ActionIcon>

                            {apiTokensData.docs.isDocsEnabled && (
                                <>
                                    {apiTokensData.docs.swaggerPath && (
                                        <ActionIcon
                                            color="cyan"
                                            component={Link}
                                            rel="noopener noreferrer"
                                            size="input-md"
                                            target="_blank"
                                            to={apiTokensData.docs.swaggerPath!}
                                            variant="light"
                                        >
                                            <SiSwagger size={24} />
                                        </ActionIcon>
                                    )}
                                    {apiTokensData.docs.scalarPath && (
                                        <ActionIcon
                                            color="cyan"
                                            component={Link}
                                            rel="noopener noreferrer"
                                            size="input-md"
                                            target="_blank"
                                            to={apiTokensData.docs.scalarPath!}
                                            variant="light"
                                        >
                                            <PiBookOpenTextDuotone size={24} />
                                        </ActionIcon>
                                    )}
                                </>
                            )}
                        </ActionIcon.Group>

                        <Button color="teal" onClick={open} size="md" variant="light">
                            {t('common.create')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>

            <Modal centered onClose={close} opened={opened} size="md" title={t('common.create')}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createApiToken({
                            variables: {
                                tokenName: tokenNameField.getValue()
                            }
                        })
                    }}
                >
                    <Stack gap="md">
                        <TextInput
                            data-autofocus
                            label={t('api-tokens-card.widget.token-name')}
                            placeholder="For Local Development"
                            required
                            {...tokenNameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button color="gray" onClick={close} variant="light">
                                {t('common.cancel')}
                            </Button>

                            <Button color="teal" loading={isCreateApiTokenPending} type="submit">
                                {t('common.create')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    )
}
