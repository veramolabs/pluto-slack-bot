# pluto-slack-bot
Experimental Veramo Slack bot

## Create Slack app

* Goto https://api.slack.com/apps/ 
* Create New App
* Navigate to Basic information > General information > App Credentials
  * Copy **Signing secret** to `SLACK_SIGNING_SECRET` environment variable
* Navigate to OAuth & Permissions
  * Scopes > **Bot Token Scopes**
  * Add `commands`, `users:read` scopes
  * Install to Workspace 
  * Copy **Bot User OAuth Access Token** to `SLACK_TOKEN` environment variable
* Navigate to Interactivity & Shortcuts
  * Turn on
  * Interactivity 
    * **Request URL** - `https://{your-domain}/slack/events`
  * Create new shortcut
    * On messages
    * Set **Name** to `Create VC`
    * Set **Short description ** to `Creates verifiable credential`
    * Set **Callback ID** to `create_vc`
  * Select Menus
    * **Options Load URL** - `https://{your-domain}/slack/events`
  * Save Changes
* (After deploying this bot) Navigate to Event Subscriptions
  * Enable events
  * **Request URL** - `https://{your-domain}/slack/events`


## Environment variables

`PORT` - http server port

`AGENT_URL` - agent url

`AGENT_API_KEY` - agent api key

`SLACK_BOT_DID_ALIAS` - example `sun.veramo.io:pluto`

`SLACK_SIGNING_SECRET` - from above

`SLACK_TOKEN` - from above


## Deploy

Click to launch your agent on Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
