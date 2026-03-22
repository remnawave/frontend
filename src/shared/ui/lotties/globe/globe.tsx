import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FC } from 'react'

// @ts-expect-error - no types for dotlottie-react
import globe from '../../../assets/lotties/globe.lottie'
import { IProps } from './interfaces/props.interface'

export const LottieGlobeShared: FC<IProps> = (props) => {
    const { width = 96, height = 115, autoplay = true, loop = true } = props

    return (
        <div style={{ width, height }}>
            <DotLottieReact autoplay={autoplay} loop={loop} src={globe} />
        </div>
    )
}
