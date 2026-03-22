import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { FC } from 'react'

// @ts-expect-error - no types for dotlottie-react
import link from '../../../assets/lotties/satellite.lottie'
import { IProps } from './interfaces/props.interface'

export const LottieLinkShared: FC<IProps> = (props) => {
    const { width = 96, height = 115 } = props

    return (
        <div style={{ width, height }}>
            <DotLottieReact autoplay loop src={link} />
        </div>
    )
}
