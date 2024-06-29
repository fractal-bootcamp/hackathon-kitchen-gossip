// import express, { Request, Response } from "express"
// import { WebClient } from "@slack/web-api"
// import bodyParser from "body-parser"

// const app = express()
// const port = 3000

// Initialize the Slack WebClient
// const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

// Middleware to parse the request body
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// interface SlackSlashCommandPayload {
//   channel_id: string
//   // Add other properties as needed
// }

// Function to generate the Block Kit JSON for the kitchen gossip
export async function generateKitchenGossip(): Array<any> {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🍽️ KITCHEN_GOSSIP 👨‍🍳👩‍🍳",
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "🕒 *55 commits* in the last 4 hours",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Dorothy's Gourmet API* :knife_fork_plate:\nCooked up a fresh API in Flask, garnished it with OAuth, served with a side of frontend tweaks!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Josh's Quick Recipe Tweak* :male-cook::scroll:\nAdded a pinch of text to README.md. Voilà!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*DC's Juicy SQL Server* :grapefruit: :banana:\nJuiced his way through a new SQL server, looks tasty!",
      },
    },
    {
      type: "divider",
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🏆 Top Cooks of the Day 🏆",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*:first_place_medal: Dorothy*\n5 PRs & 55 commits!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*:second_place_medal: Dorothy*\n3 PRs & 33 commits!",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*:third_place_medal: Dorothy*\n2 PRs & 2 commits!",
      },
    },
  ]
}

// Function to post the kitchen gossip message to Slack
// export async function postKitchenGossip(commits: any[]) {
//   try {
//     const kitchenGossip = generateKitchenGossip()
//     await slack.chat.postMessage({
//       channel: "#kitchen-gossip",
//       text: "Here is the latest kitchen gossip!",
//       blocks: kitchenGossip,
//     })
//     console.log("Message posted")
//   } catch (error) {
//     console.error("Error posting message:", error)
//   }
// }

// // Add a GET endpoint for testing in the browser
// app.get('/slack/whatscooking', async (req: Request, res: Response) => {
//     const kitchenGossip = generateKitchenGossip();
//     res.json({
//         response_type: 'in_channel',
//         blocks: kitchenGossip
//     });
// });

// // Handle incoming Slash Command requests
// app.post('/slack/whatscooking', async (req: Request, res: Response) => {
//     try {
//         const payload = req.body as SlackSlashCommandPayload;
//         const kitchenGossip = generateKitchenGossip();

//         console.log('Received payload:', payload);

//         res.json({
//             response_type: 'in_channel',
//             blocks: kitchenGossip
//         });

//         // Post the message to the Slack channel
//         await postKitchenGossip();
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({
//             response_type: 'ephemeral',
//             text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
//         });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
//     console.log(`Use http://localhost:${port}/slack/whatscooking as your Request URL for testing`);
// });
