export const getStartBlocks = (commitCount: number, ageMaxHrs: number) => [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "💚🍽️💚 Here we go! 💚🍽️💚",
      emoji: true,
    },
  },
  // {
  //   type: "context",
  //   elements: [
  //     {
  //       type: "mrkdwn",
  //       text: `🕒 *${commitCount} commits* in the last ${ageMaxHrs} hours`,
  //     },
  //   ],
  // },
];

export const getEndBlocks = () => [
  // Add some randomizing logic in here at some point!
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "💚🍳💚 Yum Yum! 💚😍💚",
      emoji: true,
    },
  },
];

export const getReviewBlock = (review: string) => [
  // Add some randomizing logic in here at some point!
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: review,
    },
  },
];

/**
 * Currently this takes in a single string and returns all reviews in a single block. This is weak.
 * We should return an array of blocks, and in the server response to Slack stagger the responses
 * so that blocks land as individual messages.
 * @param reviews
 * @returns
 */
async function makeReviewBlocks(reviews: string[]): Promise<any[]> {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🍽️ Here we go! 🍽️",
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `🕒 *${reviews.length} commits* in the last few hours`,
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
        text: reviews,
      },
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "💚🍳💚 Yum Yum! 💚😍💚",
        emoji: true,
      },
    },
    // {
    //   type: "divider",
    // },
    // {
    //   type: "header",
    //   text: {
    //     type: "plain_text",
    //     text: "🏆 Top Cooks of the Day 🏆",
    //     emoji: true,
    //   },
    // },
    // {
    //   type: "section",
    //   text: {
    //     type: "mrkdwn",
    //     text: "*:first_place_medal: DCsan*\n5 PRs & 55 commits!",
    //   },
    // },
    // {
    //   type: "section",
    //   text: {
    //     type: "mrkdwn",
    //     text: "*:second_place_medal: yabCommits*\n3 PRs & 33 commits!",
    //   },
    // },
    // {
    //   type: "section",
    //   text: {
    //     type: "mrkdwn",
    //     text: "*:third_place_medal: Hedeaux*\n2 PRs & 2 commits!",
    //   },
    // },
  ];
}
