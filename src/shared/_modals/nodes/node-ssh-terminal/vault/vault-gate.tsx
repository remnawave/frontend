import { Box, Center, Loader } from '@mantine/core'

import type { TInstanceLock } from '@shared/hooks/use-single-instance-lock'

import {
    useSshVaultActions,
    useSshVaultHasPasscode,
    useSshVaultPasscodeAttempts,
    useSshVaultPasscodeLength,
    useSshVaultStatus
} from '@entities/ssh-vault'

import classes from '../NodeSshTerminal.module.css'
import { InstanceConflictScreen } from '../window/instance-conflict.screen'
import { PasscodeRequiredScreen } from './passcode-required.screen'
import { VaultManageScreen } from './vault-manage.screen'
import { VaultSetupScreen } from './vault-setup.screen'
import { VaultUnlockScreen } from './vault-unlock.screen'

interface IProps {
    instanceLock: TInstanceLock
    isManaging: boolean
    onDestroy: () => void
    onLeaveManage: () => void
    onManage: () => void
    onRestore: (backup: Uint8Array, seedPhrase: string) => Promise<boolean>
}

export const VaultGate = (props: IProps) => {
    const { instanceLock, isManaging, onDestroy, onLeaveManage, onManage, onRestore } = props

    const vaultStatus = useSshVaultStatus()
    const vaultActions = useSshVaultActions()
    const hasPasscode = useSshVaultHasPasscode()
    const passcodeAttemptsLeft = useSshVaultPasscodeAttempts()
    const passcodeLength = useSshVaultPasscodeLength()

    if (instanceLock === 'blocked') {
        return <InstanceConflictScreen />
    }

    if (instanceLock === 'pending' || vaultStatus === 'unknown') {
        return (
            <Center flex={1}>
                <Loader size="sm" />
            </Center>
        )
    }

    if (isManaging) {
        return (
            <Box className={classes.screen}>
                <VaultManageScreen
                    canExport={vaultStatus === 'unlocked'}
                    hasVault={vaultStatus !== 'absent'}
                    onCreateNew={onLeaveManage}
                    onExport={vaultActions.exportVault}
                    onImport={onRestore}
                    onReset={onDestroy}
                />
            </Box>
        )
    }

    if (vaultStatus === 'absent') {
        return (
            <Box className={classes.screen}>
                <VaultSetupScreen onComplete={vaultActions.create} />
            </Box>
        )
    }

    if (vaultStatus === 'locked') {
        return (
            <Box className={classes.screen}>
                <VaultUnlockScreen
                    attemptsLeft={passcodeAttemptsLeft}
                    hasPasscode={hasPasscode}
                    onReset={onManage}
                    onUnlockWithPasscode={vaultActions.unlockWithPasscode}
                    onUnlockWithPhrase={vaultActions.unlock}
                    passcodeLength={passcodeLength}
                />
            </Box>
        )
    }

    if (!hasPasscode) {
        return (
            <Box className={classes.screen}>
                <PasscodeRequiredScreen onSubmit={vaultActions.setPasscode} />
            </Box>
        )
    }

    return null
}

export const useIsVaultGateOpen = (instanceLock: TInstanceLock, isManaging: boolean) => {
    const vaultStatus = useSshVaultStatus()
    const hasPasscode = useSshVaultHasPasscode()

    return instanceLock !== 'acquired' || isManaging || vaultStatus !== 'unlocked' || !hasPasscode
}
