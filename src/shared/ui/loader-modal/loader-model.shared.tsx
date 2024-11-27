import { Center, Loader, Stack, Text } from '@mantine/core';
import { IProps } from './interfaces';

export function LoaderModalShared(props: IProps) {
  const { text, ...rest} = props; 

  return (
    <Center {...rest}>
      <Stack align="center" gap="sm">
        <Loader size="lg" variant="bars" />
        <Text size="sm" c="dimmed">
          {text}
        </Text>
      </Stack>
    </Center>
  );
}
