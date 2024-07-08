// keys for this object...
//
// [
// "sha",
//  "node_id",
//  "commit",
//        commit.author
//                commit.author.name
//        commit.committer
//                commit.committer.name
//        commit.message
//        commit.tree
//        commit.url
//        commit.comment_count
//        commit.verification
//  "url",
//  "html_url",
//  "comments_url",
//  "author",
//  "committer",
//  "parents"
// ]

const obj = {
  sha: "68ca7d9dbf45e9331d39a6ad979da68720514927",
  node_id:
    "C_kwDOMEZTWtoAKDY4Y2E3ZDlkYmY0NWU5MzMxZDM5YTZhZDk3OWRhNjg3MjA1MTQ5Mjc",
  commit: {
    author: {
      name: "yab",
      email: "6627294+yablochko8@users.noreply.github.com",
      date: "2024-07-04T18:53:13Z",
    },
    committer: {
      name: "yab",
      email: "6627294+yablochko8@users.noreply.github.com",
      date: "2024-07-04T18:53:13Z",
    },
    message: "tiny change",
    tree: {
      sha: "7dc8053d62702c72ff2c820a0cdefe6894bc0ba1",
      url: "https://api.github.com/repos/fractal-bootcamp/lui.personal-site/git/trees/7dc8053d62702c72ff2c820a0cdefe6894bc0ba1",
    },
    url: "https://api.github.com/repos/fractal-bootcamp/lui.personal-site/git/commits/68ca7d9dbf45e9331d39a6ad979da68720514927",
    comment_count: 0,
    verification: {
      verified: false,
      reason: "unsigned",
      signature: null,
      payload: null,
    },
  },
  url: "https://api.github.com/repos/fractal-bootcamp/lui.personal-site/commits/68ca7d9dbf45e9331d39a6ad979da68720514927",
  html_url:
    "https://github.com/fractal-bootcamp/lui.personal-site/commit/68ca7d9dbf45e9331d39a6ad979da68720514927",
  comments_url:
    "https://api.github.com/repos/fractal-bootcamp/lui.personal-site/commits/68ca7d9dbf45e9331d39a6ad979da68720514927/comments",
  author: {
    login: "yablochko8",
    id: 6627294,
    node_id: "MDQ6VXNlcjY2MjcyOTQ=",
    avatar_url: "https://avatars.githubusercontent.com/u/6627294?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/yablochko8",
    html_url: "https://github.com/yablochko8",
    followers_url: "https://api.github.com/users/yablochko8/followers",
    following_url:
      "https://api.github.com/users/yablochko8/following{/other_user}",
    gists_url: "https://api.github.com/users/yablochko8/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/yablochko8/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/yablochko8/subscriptions",
    organizations_url: "https://api.github.com/users/yablochko8/orgs",
    repos_url: "https://api.github.com/users/yablochko8/repos",
    events_url: "https://api.github.com/users/yablochko8/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/yablochko8/received_events",
    type: "User",
    site_admin: false,
  },
  committer: {
    login: "yablochko8",
    id: 6627294,
    node_id: "MDQ6VXNlcjY2MjcyOTQ=",
    avatar_url: "https://avatars.githubusercontent.com/u/6627294?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/yablochko8",
    html_url: "https://github.com/yablochko8",
    followers_url: "https://api.github.com/users/yablochko8/followers",
    following_url:
      "https://api.github.com/users/yablochko8/following{/other_user}",
    gists_url: "https://api.github.com/users/yablochko8/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/yablochko8/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/yablochko8/subscriptions",
    organizations_url: "https://api.github.com/users/yablochko8/orgs",
    repos_url: "https://api.github.com/users/yablochko8/repos",
    events_url: "https://api.github.com/users/yablochko8/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/yablochko8/received_events",
    type: "User",
    site_admin: false,
  },
  parents: [
    {
      sha: "efb69b7de957126a16e5eadf8f896578d299fad9",
      url: "https://api.github.com/repos/fractal-bootcamp/lui.personal-site/commits/efb69b7de957126a16e5eadf8f896578d299fad9",
      html_url:
        "https://github.com/fractal-bootcamp/lui.personal-site/commit/efb69b7de957126a16e5eadf8f896578d299fad9",
    },
  ],
};

console.log(Object.keys(obj));
