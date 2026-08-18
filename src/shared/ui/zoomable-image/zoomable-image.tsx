import type { Ref } from 'react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'

import { UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
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

    const transformRef = useRef<ReactZoomPanPinchRef>(null)

    useEffect(() => {
        const instance = transformRef.current?.instance
        const content = instance?.contentComponent
        const wrapper = instance?.wrapperComponent

        if (!instance || !content || !wrapper) return undefined

        const observer = new ResizeObserver(() => instance.update(instance.props))

        observer.observe(content)
        observer.observe(wrapper)

        return () => observer.disconnect()
    }, [])

    const handleReset = () => {
        const controls = transformRef.current

        if (!controls) return

        controls.resetTransform(0)
        controls.instance.update(controls.instance.props)
    }

    return (
        <TransformWrapper
            ref={transformRef}
            disablePadding
            doubleClick={{ mode: 'toggle' }}
            trackPadPanning={{ disabled: false }}
            wheel={{ wheelDisabled: true }}
        >
            {({ zoomIn, zoomOut }) => (
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
                            onClick={handleReset}
                        >
                            <TbRestore size={16} />
                        </UnstyledButton>
                    </div>
                </div>
            )}
        </TransformWrapper>
    )
}
