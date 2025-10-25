import Lottie from 'lottie-react'
import { FC } from 'react'

import link from '../../../assets/lotties/satellite.json'
import { IProps } from './interfaces/props.interface'

export const LottieLinkShared: FC<IProps> = (props) => {
    const { width = 96, height = 115 } = props

    return (
        <div style={{ width, height }}>
            <Lottie animationData={link} autoplay controls loop />
        </div>
    )
}
