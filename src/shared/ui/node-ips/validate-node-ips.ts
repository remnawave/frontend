import { FormErrors } from '@mantine/form'
import { NodeIpSchema, TNodeIps } from '@remnawave/backend-contract'
import { t } from 'i18next'

export const MAX_NODE_IPS = 64

export const isValidNodeIp = (ip: string): boolean => NodeIpSchema.shape.ip.safeParse(ip).success

export const getNodeIpsErrors = (ips: null | TNodeIps | undefined): FormErrors => {
    const errors: FormErrors = {}

    if (!ips?.length) {
        return errors
    }

    ips.forEach((entry, index) => {
        const ip = entry.ip.trim()

        if (!ip) {
            errors[`ips.${index}.ip`] = t('node-ips.ip-is-required')
            return
        }

        if (!isValidNodeIp(ip)) {
            errors[`ips.${index}.ip`] = t('node-ips.invalid-ip')
        }
    })

    if (ips.length > MAX_NODE_IPS) {
        errors.ips = t('node-ips.max-ips-reached', { max: MAX_NODE_IPS })
    }

    return errors
}

export const withNodeIpsErrors =
    <T extends { ips?: null | TNodeIps }>(
        resolver: (values: T) => FormErrors | Promise<FormErrors>
    ) =>
    (values: T): FormErrors | Promise<FormErrors> => {
        const merge = (errors: FormErrors): FormErrors => ({
            ...errors,
            ...getNodeIpsErrors(values.ips)
        })

        const resolved = resolver(values)

        return resolved instanceof Promise ? resolved.then(merge) : merge(resolved)
    }
