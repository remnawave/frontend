import Lottie from 'lottie-react'
import { FC } from 'react'

import globe from '../../../assets/lotties/globe.json'
import { IProps } from './interfaces/props.interface'

export const LottieGlobeShared: FC<IProps> = (props) => {
    const { width = 96, height = 115 } = props

    return (
        <div style={{ width, height }}>
            <Lottie animationData={globe} autoplay controls loop />
        </div>
    )
}
