import { IIdentifier } from '@veramo/core'
import Discord from 'discord.js'
import { agent } from './agent'
import { createMessageCredential } from './message'
import { getIdentity } from './profile'

export const createReactionCredential = async (reaction: Discord.MessageReaction, reactionAuthor: IIdentifier) => {

  await createMessageCredential(reaction.message)

  const channel = reaction.message.channel as Discord.TextChannel
  const author = await getIdentity(reaction.message.author)

  const credentialSubject = {
    id: reaction.message.url,
    message: {
      author: author.did,
      channel: {
        id: channel.id,
        name: channel.name,
        nsfw: channel.nsfw,
      },
      content: reaction.message.content,
    },
    emoji: reaction.emoji.name
  }

  await agent.createVerifiableCredential({
    save: true,
    proofFormat: 'jwt',
    credential: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'Mercury', 'Reaction'],
      issuer: { id: reactionAuthor.did },
      issuanceDate: new Date().toISOString(),
      credentialSubject
    }
  })


}