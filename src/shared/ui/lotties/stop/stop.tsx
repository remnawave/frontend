import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FC } from 'react'

import { IProps } from './interfaces/props.interface'

export const LottieStopShared: FC<IProps> = (props) => {
    const { width = 96, height = 115, autoplay = true, loop = true } = props

    return (
        <div style={{ width, height }}>
            <DotLottieReact
                autoplay={autoplay}
                loop={loop}
                renderConfig={{
                    autoResize: true,
                    devicePixelRatio: window.devicePixelRatio || 2
                }}
                src="/lotties/stop-v2.lottie"
            />
        </div>
    )
}
