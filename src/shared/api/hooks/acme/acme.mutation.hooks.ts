import { notifications } from '@mantine/notifications'

import {
    CreateAcmeCertificateCommand,
    CreateAcmeCredentialCommand,
    DeleteAcmeCertificateCommand,
    DeleteAcmeCredentialCommand,
    ImportAcmeCertificateCommand,
    IssueAcmeCertificateCommand,
    PublishAcmePersistRecordCommand,
    ReimportAcmeCertificateCommand,
    TestAcmeCredentialCommand,
    UpdateAcmeCertificateCommand,
    UpdateAcmeCredentialCommand
} from '@shared/api/contracts/acme.contract'

import { createMutationHook } from '../../tsq-helpers'

const notifyError = (title: string) => (error: unknown) => {
    notifications.show({
        color: 'red',
        message: error instanceof Error ? error.message : 'Request failed with unknown error.',
        title
    })
}

const notifySuccess = (message: string) => () => {
    notifications.show({ color: 'teal', message, title: 'Success' })
}

export const useCreateAcmeCredential = createMutationHook({
    bodySchema: CreateAcmeCredentialCommand.RequestBodySchema,
    endpoint: CreateAcmeCredentialCommand.TSQ_url,
    requestMethod: CreateAcmeCredentialCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: CreateAcmeCredentialCommand.ResponseSchema,
    rMutationParams: {
        onError: notifyError('Create ACME credential'),
        onSuccess: notifySuccess('Credential created successfully')
    }
})

export const useUpdateAcmeCredential = createMutationHook({
    bodySchema: UpdateAcmeCredentialCommand.RequestBodySchema,
    endpoint: UpdateAcmeCredentialCommand.TSQ_url,
    requestMethod: UpdateAcmeCredentialCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: UpdateAcmeCredentialCommand.ResponseSchema,
    rMutationParams: {
        onError: notifyError('Update ACME credential'),
        onSuccess: notifySuccess('Credential updated successfully')
    }
})

export const useDeleteAcmeCredential = createMutationHook({
    endpoint: DeleteAcmeCredentialCommand.TSQ_url,
    requestMethod: DeleteAcmeCredentialCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: DeleteAcmeCredentialCommand.ResponseSchema,
    routeParamsSchema: DeleteAcmeCredentialCommand.RequestParamSchema,
    rMutationParams: {
        onError: notifyError('Delete ACME credential'),
        onSuccess: notifySuccess('Credential deleted successfully')
    }
})

export const useTestAcmeCredential = createMutationHook({
    endpoint: TestAcmeCredentialCommand.TSQ_url,
    requestMethod: TestAcmeCredentialCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: TestAcmeCredentialCommand.ResponseSchema,
    routeParamsSchema: TestAcmeCredentialCommand.RequestParamSchema,
    rMutationParams: {
        onError: notifyError('Test ACME credential')
    }
})

export const useCreateAcmeCertificate = createMutationHook({
    bodySchema: CreateAcmeCertificateCommand.RequestBodySchema,
    endpoint: CreateAcmeCertificateCommand.TSQ_url,
    requestMethod: CreateAcmeCertificateCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: CreateAcmeCertificateCommand.ResponseSchema,
    rMutationParams: {
        onError: notifyError('Create certificate'),
        onSuccess: notifySuccess('Certificate created successfully')
    }
})

export const useUpdateAcmeCertificate = createMutationHook({
    bodySchema: UpdateAcmeCertificateCommand.RequestBodySchema,
    endpoint: UpdateAcmeCertificateCommand.TSQ_url,
    requestMethod: UpdateAcmeCertificateCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: UpdateAcmeCertificateCommand.ResponseSchema,
    rMutationParams: {
        onError: notifyError('Update certificate'),
        onSuccess: notifySuccess('Certificate updated successfully')
    }
})

export const useDeleteAcmeCertificate = createMutationHook({
    endpoint: DeleteAcmeCertificateCommand.TSQ_url,
    requestMethod: DeleteAcmeCertificateCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: DeleteAcmeCertificateCommand.ResponseSchema,
    routeParamsSchema: DeleteAcmeCertificateCommand.RequestParamSchema,
    rMutationParams: {
        onError: notifyError('Delete certificate'),
        onSuccess: notifySuccess('Certificate deleted successfully')
    }
})

export const useImportAcmeCertificate = createMutationHook({
    bodySchema: ImportAcmeCertificateCommand.RequestBodySchema,
    endpoint: ImportAcmeCertificateCommand.TSQ_url,
    requestMethod: ImportAcmeCertificateCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: ImportAcmeCertificateCommand.ResponseSchema,
    rMutationParams: {
        onError: notifyError('Import certificate'),
        onSuccess: notifySuccess('Certificate imported')
    }
})

export const useReimportAcmeCertificate = createMutationHook({
    bodySchema: ReimportAcmeCertificateCommand.RequestBodySchema,
    endpoint: ReimportAcmeCertificateCommand.TSQ_url,
    requestMethod: ReimportAcmeCertificateCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: ReimportAcmeCertificateCommand.ResponseSchema,
    routeParamsSchema: ReimportAcmeCertificateCommand.RequestParamSchema,
    rMutationParams: {
        onError: notifyError('Replace certificate material'),
        onSuccess: notifySuccess('Certificate replaced, bound nodes restarted')
    }
})

export const useIssueAcmeCertificate = createMutationHook({
    endpoint: IssueAcmeCertificateCommand.TSQ_url,
    requestMethod: IssueAcmeCertificateCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: IssueAcmeCertificateCommand.ResponseSchema,
    routeParamsSchema: IssueAcmeCertificateCommand.RequestParamSchema,
    rMutationParams: {
        onError: notifyError('Issue certificate'),
        // Issuance is queued, not awaited: the certificate status and its event
        // log are where the outcome shows up.
        onSuccess: notifySuccess('Issuance queued, watch the certificate status')
    }
})

export const usePublishAcmePersistRecord = createMutationHook({
    endpoint: PublishAcmePersistRecordCommand.TSQ_url,
    requestMethod: PublishAcmePersistRecordCommand.endpointDetails.REQUEST_METHOD,
    responseSchema: PublishAcmePersistRecordCommand.ResponseSchema,
    routeParamsSchema: PublishAcmePersistRecordCommand.RequestParamSchema,
    rMutationParams: {
        onError: notifyError('Publish authorization record'),
        onSuccess: notifySuccess('Authorization record published')
    }
})
