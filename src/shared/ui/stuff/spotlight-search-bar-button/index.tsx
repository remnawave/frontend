import { ReactNode } from 'react';
import { PiCommand as CommandIcon, PiMagnifyingGlassBold as SearchIcon } from 'react-icons/pi';
import {
    Button,
    ElementProps,
    TextInput,
    UnstyledButton,
    UnstyledButtonProps,
} from '@mantine/core';
import { spotlight } from '@mantine/spotlight';
import classes from './spotlight-search-bar-button.module.css';

interface SpotlightSearchBarButtonProps
    extends Omit<UnstyledButtonProps, 'children'>,
        ElementProps<'div', keyof UnstyledButtonProps> {
    placeholder?: string;
    spotlight: ReactNode;
}

export function SpotlightSearchBarButton({
    placeholder,
    spotlight: spotlightComponent,
    ...props
}: SpotlightSearchBarButtonProps) {
    return (
        <>
            <UnstyledButton
                component="div"
                className={classes.input}
                onClick={spotlight.open}
                {...props}
            >
                <TextInput
                    placeholder={placeholder}
                    leftSection={<SearchIcon />}
                    rightSection={
                        <Button
                            component="span"
                            size="compact-xs"
                            leftSection={<CommandIcon size="1rem" />}
                        >
                            K
                        </Button>
                    }
                />
            </UnstyledButton>

            <Button
                c="inherit"
                variant="transparent"
                className={classes.button}
                onClick={spotlight.open}
                leftSection={<SearchIcon size="1.2rem" />}
                rightSection={
                    <Button
                        component="span"
                        variant="filled"
                        size="compact-md"
                        leftSection={<CommandIcon size="1rem" />}
                    >
                        K
                    </Button>
                }
            />

            {spotlightComponent}
        </>
    );
}
