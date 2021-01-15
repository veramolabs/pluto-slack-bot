import { config } from 'dotenv'
config()
import { App, LogLevel } from '@slack/bolt'
import { agent } from './agent'
import { credentialCreatedSuccess } from './views/create-credential-success'
import { createMessageCredential } from './message'

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.ERROR,
})

app.shortcut(
  { type: 'message_action', callback_id: 'create_vc' },
  async ({ ack, shortcut, client, payload }) => {
    try {
      await ack()

      await createMessageCredential({
        client_msg_id: shortcut.message.client_msg_id,
        text: shortcut.message.text as string,
        user: shortcut.message.user as string,
        ts: shortcut.message.ts
      }, client)

      await client.views.open({
        trigger_id: shortcut.trigger_id,
        view: credentialCreatedSuccess,
      });
    } catch (error) {
      console.error(error)
    }
  }
)

const main = async () => {

  if (!process.env.PORT) throw Error('PORT not defined')
  if (!process.env.SLACK_BOT_DID_ALIAS) throw Error('SLACK_BOT_DID_ALIAS not defined')

  await agent.didManagerGetOrCreate({
    provider: 'did:web',
    alias: process.env.SLACK_BOT_DID_ALIAS
  })

  await app.start(parseInt(process.env.PORT, 10))
  console.log('⚡️ Pluto is running!!!')
}

main().catch(console.error)
