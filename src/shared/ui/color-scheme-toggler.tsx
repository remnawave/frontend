import {
    ActionIcon,
    ActionIconProps,
    ElementProps,
    MantineColorScheme,
    Tooltip,
    useMantineColorScheme
} from '@mantine/core'
import {
    PiMoonDuotone as DarkIcon,
    PiSunDimDuotone as LightIcon,
    PiDesktop as SystemIcon
} from 'react-icons/pi'

import { match } from '@shared/utils/match'

type ColorSchemeTogglerProps = ElementProps<'button', keyof ActionIconProps> &
    Omit<ActionIconProps, 'c' | 'children' | 'onClick' | 'size'>

export function ColorSchemeToggler(props: ColorSchemeTogglerProps) {
    const { colorScheme, setColorScheme } = useMantineColorScheme()

    const { label, icon: Icon } = match(
        [colorScheme === 'auto', { label: 'System', icon: SystemIcon }],
        [colorScheme === 'dark', { label: 'Dark', icon: DarkIcon }],
        [colorScheme === 'light', { label: 'Light', icon: LightIcon }],
        [true, { label: 'Dark', icon: DarkIcon }]
    )

    const handleSchemeChange = () => {
        const nextColorScheme = match<MantineColorScheme>(
            [colorScheme === 'auto', 'dark'],
            [colorScheme === 'dark', 'light'],
            [colorScheme === 'light', 'auto'],
            [true, 'dark']
        )

        setColorScheme(nextColorScheme)
    }

    return (
        <Tooltip label={label}>
            <ActionIcon c="inherit" onClick={handleSchemeChange} variant="transparent" {...props}>
                <Icon size="100%" />
            </ActionIcon>
        </Tooltip>
    )
}
