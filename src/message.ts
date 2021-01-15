import { agent } from './agent'
import { getIdentifier } from './profile'

export const createMessageCredential = async (message: {text: string, user: string, ts: string, client_msg_id: string}, client: any) => {

  const author = await getIdentifier(message.user, client)

  // Check if a VC for this message already exists
  const count = await agent.dataStoreORMGetVerifiableCredentialsCount({
    where: [
      { column: 'issuer', value: [author.did] },
      { column: 'subject', value: [message.client_msg_id] },
      { column: 'type', value: ['VerifiableCredential,Pluto,Message']}
    ]
  })

  // If it does not exist - create one
  if (count === 0) {
  
    const credentialSubject = {
      id: message.client_msg_id,
      content: message.text
    }

    await agent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Pluto', 'Message'],
        issuer: { id: author.did },
        issuanceDate: new Date(parseInt(message.ts.split('.')[0], 10) * 1000).toISOString(),
        credentialSubject
      }
    })
  }

}