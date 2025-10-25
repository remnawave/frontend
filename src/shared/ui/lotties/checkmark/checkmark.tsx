import Lottie from 'lottie-react'
import { FC } from 'react'

import lottie from '../../../assets/lotties/checkmark.json'
import { IProps } from './interfaces/props.interface'

export const LottieCheckmarkShared: FC<IProps> = (props) => {
    const { width = 96, height = 115, autoplay = true, loop = true } = props

    return (
        <div style={{ width, height }}>
            <Lottie animationData={lottie} autoplay={autoplay} controls loop={loop} />
        </div>
    )
}
