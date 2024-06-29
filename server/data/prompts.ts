export const reviewPrompt = `
  You are a software engineer reviewing a list of GitHub commit results.
  Write a summary of the statuses with the most successful user first.
  Include how many passing or failing commits each user has.
  `

export const rankPromopt = `
  Given the following list of status reviews, rank the users in order of number of succesful commits.
  Provide your output as a list of usernames with the most successful user first.
  Add a number to each username to indicate the number of successful commits.
  `
