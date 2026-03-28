import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FC } from 'react'

import { IProps } from './interfaces/props.interface'

export const LottieCheckmarkShared: FC<IProps> = (props) => {
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
                src="/lotties/checkmark.lottie"
            />
        </div>
    )
}
