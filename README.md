How this code is organized:

# /server

Almost everything that matters for now is in here.

# /frontend

Lightweight web app for interacting with server, especially in dev/local environment.

# /database & /docs

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
