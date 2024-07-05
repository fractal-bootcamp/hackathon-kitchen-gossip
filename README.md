# TO DO LISTS

# Server and and Slack integration

1. Get boltServer.ts working on a remote host
1. Update boltServer to be calling the same functions as the expressServer
1. Tidy up /server/slack files - currently lots of obsolete commentcode
1. Test with Slack in Prod so that it calls the actual boltServer

# Better more usable gossip output

1. Add in aggregated counts under each review, e.g.
   @Alex has done great blah blah blah emoji emoji
   (5 commits)
1. Add in files touched and lines changed to the aggregate counts, e.g.
   @Alex has done great blah blah blah emoji emoji
   (5 commits, 25 files, +100 net lines)
1. Add in PR count to the aggregate counts
1. Update the CommitSummary type across the repo
   add in a branch:string value
   Nest an object of all the github standardized info where we can use github terminology where it's defined, see this comment for details: https://github.com/fractal-bootcamp/hackathon-kitchen-gossip/pull/11#discussion_r1666100257

# Improvements to FE App debug tool

1. Move the serverPath that currently lives in frontend/src/App.tsx into an env file
1. Get Tailwind working on the App.tsx page and make it pretty
1. Give the FE a more clear way of indicating that a request is being processed
1. Add another input box to the FE App that lets you specific a number. Pass that number all the way through as the maxAgeHrs value.

# Getting access to private repos

1. Work out how to get approved private repos showing in responses from GraphQL.
   Current query is efficient but omits private repos (even when a project owner
   is allowing OAuth scraping)
1. Longer term but much bigger execise: Migrate from OAuth to a Github App. More details [here](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps).
   Until this happens, the tool will only see: public repos, and private repos of orgs that have not blocked OAuth access to their private repos [read more on this](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data).

# How this code is organized:

## /server

Almost everything that matters for now is in here.

## /frontend

Lightweight web app for interacting with server, especially in dev/local environment.

## /database & /docs

Adventures for another day.

==================

# To test using FE interface

```sh
cd /frontend
npm install
npm run dev
```

and open up Vite localhost, and then for the server...

```sh
cd /server
bun --watch expressServer.ts
```

# To test using command line

E.g. to test getCommits:

```sh
cd /server
bun cli.ts getCommits
```

etc

See `/server/cli.ts` for all options

Tool comes from https://just.systems/

==================

Sample API response from Github:

```json
{
  "sha": "abcdef1234567890 - Unique identifier for the commit",
  "commit": {
    "author": {
      "name": "Name of the author",
      "email": "email@of-the-author.com",
      "date": "2024-06-28T10:00:00Z"
    },
    "committer": {
      "name": "Name of the Committer",
      "email": "committer.email@maybeSameAsAuthorOrDiff.com",
      "date": "2024-06-28T10:00:00Z"
    },
    "message": "Commit message describing changes",

    "tree": {
      "sha": "treeSHA1234567890-SHA-of-tree-object-associated-with-commit"
    },
    "url": "https://api.github.com/repos/yourusername/repository/commits/abcdef1234567890/url-to-view-commit-on-github",
    "moreFieldsMayExistHere": "more-information-like-parents-verification-details-etc"
  }
}
```
