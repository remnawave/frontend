import { IBuildInfo } from './interfaces/build-info.interface'
import buildInfo from '../../../../build.info.json'

export function getBuildInfo(): IBuildInfo {
    return buildInfo
}
