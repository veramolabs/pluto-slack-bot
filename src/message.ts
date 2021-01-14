import Discord from 'discord.js'
import { agent } from './agent'
import { getIdentity } from './profile'

export const createMessageCredential = async (message: Discord.Message) => {

  const author = await getIdentity(message.author)

  // Check if a VC for this message already exists
  const count = await agent.dataStoreORMGetVerifiableCredentialsCount({
    where: [
      { column: 'issuer', value: [author.did] },
      { column: 'subject', value: [message.url] },
      { column: 'type', value: ['VerifiableCredential,Mercury,Message']}
    ]
  })

  // If it does not exist - create one
  if (count === 0) {
    const channel = message.channel as Discord.TextChannel
  
    const credentialSubject = {
      id: message.url,
      channel: {
        id: channel.id,
        name: channel.name,
        nsfw: channel.nsfw,
      },
      content: message.content
    }

    await agent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Mercury', 'Message'],
        issuer: { id: author.did },
        issuanceDate: new Date(message.createdTimestamp).toISOString(),
        credentialSubject
      }
    })
  }

}