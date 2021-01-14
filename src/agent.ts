import { createAgent, IDIDManager } from '@veramo/core'
import { AgentRestClient } from '@veramo/remote-client'
import { ICredentialIssuer } from '@veramo/credential-w3c'
import { IDataStoreORM } from '@veramo/data-store'

if (!process.env.AGENT_URL) throw Error('AGENT_URL is missing')
if (!process.env.AGENT_API_KEY) throw Error('AGENT_API_KEY is missing')

export const agent = createAgent<IDIDManager & ICredentialIssuer & IDataStoreORM>({
  plugins: [
    new AgentRestClient({
      url: process.env.AGENT_URL,
      headers: {
        Authorization: 'Bearer ' + process.env.AGENT_API_KEY
      },
      enabledMethods: [
        // 'keyManagerGetKeyManagementSystems',
        // 'keyManagerCreate',
        // 'keyManagerGet',
        // 'keyManagerDelete',
        // 'keyManagerImport',
        // 'keyManagerEncryptJWE',
        // 'keyManagerDecryptJWE',
        // 'keyManagerSignJWT',
        // 'keyManagerSignEthTX',
        'didManagerGetProviders',
        'didManagerFind',
        'didManagerGet',
        'didManagerCreate',
        'didManagerGetOrCreate',
        'didManagerImport',
        'didManagerDelete',
        'didManagerAddKey',
        'didManagerRemoveKey',
        'didManagerAddService',
        'didManagerRemoveService',
        // 'resolveDid',
        // 'dataStoreSaveMessage',
        // 'dataStoreSaveVerifiableCredential',
        // 'dataStoreSaveVerifiablePresentation',
        'dataStoreORMGetIdentifiers',
        'dataStoreORMGetIdentifiersCount',
        'dataStoreORMGetMessages',
        'dataStoreORMGetMessagesCount',
        'dataStoreORMGetVerifiableCredentialsByClaims',
        'dataStoreORMGetVerifiableCredentialsByClaimsCount',
        'dataStoreORMGetVerifiableCredentials',
        'dataStoreORMGetVerifiableCredentialsCount',
        'dataStoreORMGetVerifiablePresentations',
        'dataStoreORMGetVerifiablePresentationsCount',
        // 'handleMessage',
        // 'sendMessageDIDCommAlpha1',
        'createVerifiablePresentation',
        'createVerifiableCredential',
        // 'createSelectiveDisclosureRequest',
        // 'getVerifiableCredentialsForSdr',
        // 'validatePresentationAgainstSdr',
      ]
    })
  ]
})