# TO DO LIST

1. Update the CommitSummary type across the repo
   add in a branch:string value
   Nest an object of all the github standardized info where we can use github terminology where it's defined, see this comment for details: https://github.com/fractal-bootcamp/hackathon-kitchen-gossip/pull/11#discussion_r1666100257
1. Move the serverPath that currently lives in frontend/src/App.tsx into an env file

# How this code is organized:

## /server

Almost everything that matters for now is in here.

## /frontend

Lightweight web app for interacting with server, especially in dev/local environment.

## /database & /docs

Adventures for another day.

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
