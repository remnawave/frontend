import { Box, Flex, Text } from '@mantine/core'
import { TbExternalLink } from 'react-icons/tb'
import { parseURL } from 'ufo'

export function InfraProvidersTableUrlCell({ url }: { url: null | string }) {
    if (!url) return null

    const urlObj = parseURL(url)

    return (
        <Box
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--mantine-color-dark-6)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
            }}
            title={`Click to open ${url}`}
        >
            <Flex align="center" gap="xs" wrap="nowrap">
                <Text
                    size="sm"
                    style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    <Text c="gray.1" component="span" fw={500}>
                        {urlObj.host}
                    </Text>
                    <Text c="gray.6" component="span">
                        {urlObj.pathname}
                    </Text>
                </Text>
                <TbExternalLink
                    color="var(--mantine-color-gray-5)"
                    size={14}
                    style={{ flexShrink: 0 }}
                />
            </Flex>
        </Box>
    )
}
