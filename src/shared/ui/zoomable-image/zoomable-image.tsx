import type { Ref } from 'react'

import { UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { TbRestore, TbZoomIn, TbZoomOut } from 'react-icons/tb'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import classes from './zoomable-image.module.css'

interface IProps {
    alt: string
    className?: string
    ref?: Ref<HTMLImageElement>
    src: string
}

const WRAPPER_STYLE = { height: '100%', width: '100%' }
const CONTENT_STYLE = { width: '100%' }

export function ZoomableImage(props: IProps) {
    const { alt, className, ref, src } = props

    return (
        <TransformWrapper
            disablePadding
            doubleClick={{ mode: 'toggle' }}
            trackPadPanning={{ disabled: false }}
            wheel={{ wheelDisabled: true }}
        >
            {({ resetTransform, zoomIn, zoomOut }) => (
                <div className={clsx(classes.root, className)}>
                    <TransformComponent
                        contentStyle={CONTENT_STYLE}
                        wrapperClass={classes.surface}
                        wrapperStyle={WRAPPER_STYLE}
                    >
                        <img alt={alt} className={classes.image} ref={ref} src={src} />
                    </TransformComponent>

                    <div className={classes.controlBar}>
                        <div className={classes.controlGroup}>
                            <UnstyledButton
                                aria-label="Zoom in"
                                className={classes.controlButton}
                                onClick={() => zoomIn()}
                            >
                                <TbZoomIn size={16} />
                            </UnstyledButton>

                            <UnstyledButton
                                aria-label="Zoom out"
                                className={classes.controlButton}
                                onClick={() => zoomOut()}
                            >
                                <TbZoomOut size={16} />
                            </UnstyledButton>
                        </div>

                        <span className={classes.controlDivider} />

                        <UnstyledButton
                            aria-label="Reset"
                            className={classes.controlButton}
                            onClick={() => resetTransform()}
                        >
                            <TbRestore size={16} />
                        </UnstyledButton>
                    </div>
                </div>
            )}
        </TransformWrapper>
    )
}
