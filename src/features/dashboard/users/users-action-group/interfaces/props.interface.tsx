/* eslint-disable camelcase */
import { GetAllUsersV2Command } from '@remnawave/backend-contract'
import { MRT_TableInstance } from 'mantine-react-table'
import { table } from 'console'

export interface IProps {
    isLoading: boolean
    refetch: () => void

    table: MRT_TableInstance<GetAllUsersV2Command.Response['response']['users'][0]>
}
