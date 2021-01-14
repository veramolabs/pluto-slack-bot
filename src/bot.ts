import { config } from 'dotenv'
config()
import express from 'express'
import Discord from 'discord.js'
import { agent } from './agent'
import { getIdentity } from './profile'
import { createReactionCredential } from './reaction'

const client = new Discord.Client({ 
  partials: ['MESSAGE', 'REACTION'] 
})

client.on('messageReactionAdd', async (reaction, user) => {
  console.log(reaction)
	if (reaction.partial) {
		try {
			await reaction.fetch()
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error)
			return
		}
  }

  const reactionAuthor = await getIdentity(user as Discord.User)
  await createReactionCredential(reaction, reactionAuthor)
})

client.once('ready', async() => {
  if (!process.env.DISCORD_BOT_DID_ALIAS) throw Error('DISCORD_BOT_DID_ALIAS is missing')

  const bot = await agent.didManagerGetOrCreate({
    alias: process.env.DISCORD_BOT_DID_ALIAS,
    provider: 'did:web'
  })

  console.log(bot.did, 'is ready')
})

const app = express()

app.get('/', async (req, res) => {
 
  res.send('Pluto')
})

app.listen(process.env.PORT, async () => {
  console.log(`Server running on port: ${process.env.PORT}`)
  client.login(process.env.DISCORD_TOKEN)
})
