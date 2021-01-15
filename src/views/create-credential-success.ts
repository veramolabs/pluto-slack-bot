import { View } from "@slack/bolt";

export const credentialCreatedSuccess: View = {
  type: "modal",
  title: {
    type: "plain_text",
    text: "Verifiable credential"
  },
  close: {
    type: "plain_text",
    text: "Close"
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Message saved as verifiable credential"
      }
    }
  ]
}