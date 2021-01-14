import Discord from 'discord.js'
import { IIdentifier } from '@veramo/core'
import { agent } from './agent'

export interface UserInfo {
  provider?: string,
  alias: string,
  nickname: string,
  name: string,
  picture: string
}

export const getIdentity = async (user: Discord.User) => {
  return getIdentityAndUpdateProfile({
    provider: 'did:web',
    alias: process.env.DISCORD_BOT_DID_ALIAS + ':' + user.id,
    name: user.username,
    nickname: `${user.username}#${user.discriminator}`,
    picture: user.displayAvatarURL({format: "png"}),
  })
}

export const getIdentityAndUpdateProfile = async ( userInfo: UserInfo ): Promise<IIdentifier> => {

  if (!process.env.DISCORD_BOT_DID_ALIAS) throw Error('DISCORD_BOT_DID_ALIAS is missing')

  const identity = await agent.didManagerGetOrCreate({
    alias: userInfo.alias,
    provider: userInfo.provider
  })

  //Update profile info
  const credentials = await agent.dataStoreORMGetVerifiableCredentials({
    where: [
      { column: 'subject', value: [identity.did], op: 'Equal'},
      { column: 'type', value: ['VerifiableCredential,Profile'], op: 'Equal'}
    ],
    order: [
      { column: 'issuanceDate', direction: 'DESC' }
    ]
  })

  if (credentials.length === 0  || (
    credentials[0].verifiableCredential.credentialSubject['name'] !== userInfo.name ||
    credentials[0].verifiableCredential.credentialSubject['nickname'] !== userInfo.nickname ||
    credentials[0].verifiableCredential.credentialSubject['picture'] !== userInfo.picture
  )) {
    await agent.createVerifiableCredential({
      save: true,
      proofFormat: 'jwt',
      credential: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'Profile'],
        issuer: { id: 'did:web:' + process.env.DISCORD_BOT_DID_ALIAS },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: identity.did,
          name: userInfo.name,
          nickname: userInfo.nickname,
          picture: userInfo.picture
        }
      }
    })
  }

  return identity
}


