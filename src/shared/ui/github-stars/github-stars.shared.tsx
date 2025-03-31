import { IconBrandGithub, IconStar } from '@tabler/icons-react'
import { Box, Loader, Text, Tooltip } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { sToMs } from '@shared/utils/time-utils'
import { app } from 'src/config'

import classes from './GithubStars.module.css'

export function GithubStarsShared() {
    const { data, isLoading } = useQuery({
        queryKey: ['github-stars'],
        staleTime: sToMs(3600),
        refetchInterval: sToMs(3600),
        queryFn: async () => {
            const response = await axios.get<{
                totalStars: number
            }>('https://ungh.cc/stars/remnawave/*')
            return response.data
        }
    })

    return (
        <Tooltip label="GitHub Stars" position="right" withArrow>
            <Box className={classes.container} onClick={() => window.open(app.githubOrg, '_blank')}>
                <Box className={classes.iconSection}>
                    <IconBrandGithub className={classes.githubIcon} size="1.2rem" />
                </Box>

                <Box className={classes.countSection}>
                    <IconStar className={classes.starIcon} size="1rem" style={{ marginRight: 8 }} />
                    {isLoading ? (
                        <Loader color="white" size="xs" />
                    ) : (
                        <Text fw={600} size="sm">
                            {data?.totalStars || 0}
                        </Text>
                    )}
                </Box>
            </Box>
        </Tooltip>
    )
}
