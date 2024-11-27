import { match } from '@shared/utils/match';
import {
  PiMoonDuotone as DarkIcon,
  PiSunDimDuotone as LightIcon,
  PiDesktop as SystemIcon,
} from 'react-icons/pi';
import {
  ActionIcon,
  ActionIconProps,
  ElementProps,
  MantineColorScheme,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';

type ColorSchemeTogglerProps = Omit<ActionIconProps, 'children' | 'c' | 'onClick' | 'size'> &
  ElementProps<'button', keyof ActionIconProps>;

export function ColorSchemeToggler(props: ColorSchemeTogglerProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const { label, icon: Icon } = match(
    [colorScheme === 'auto', { label: 'System', icon: SystemIcon }],
    [colorScheme === 'dark', { label: 'Dark', icon: DarkIcon }],
    [colorScheme === 'light', { label: 'Light', icon: LightIcon }],
    [true, { label: 'Dark', icon: DarkIcon }]
  );

  const handleSchemeChange = () => {
    const nextColorScheme = match<MantineColorScheme>(
      [colorScheme === 'auto', 'dark'],
      [colorScheme === 'dark', 'light'],
      [colorScheme === 'light', 'auto'],
      [true, 'dark']
    );

    setColorScheme(nextColorScheme);
  };

  return (
    <Tooltip label={label}>
      <ActionIcon variant="transparent" c="inherit" onClick={handleSchemeChange} {...props}>
        <Icon size="100%" />
      </ActionIcon>
    </Tooltip>
  );
}
