import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FC } from 'react'

import { IProps } from './interfaces/props.interface'

export const LottieLinkShared: FC<IProps> = (props) => {
    const { width = 96, height = 115 } = props

    return (
        <div style={{ width, height }}>
            <DotLottieReact
                autoplay
                loop
                renderConfig={{
                    autoResize: true,
                    devicePixelRatio: window.devicePixelRatio || 2
                }}
                src="/lotties/satellite.lottie"
            />
        </div>
    )
}
