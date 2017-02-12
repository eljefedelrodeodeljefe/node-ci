# Incoming Webhooks

Depending on the `git` service we need to anticipate and handle different webhook
payloads.

## GitHub

### Push Event

A full description can be found at [GitHub](https://developer.github.com/v3/activity/events/types/#pushevent).
However, for us only the following will be interesing to translate into features.

```json
{
  "ref": "refs/heads/changes",
  "before": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
  "after": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/baxterthehacker/public-repo/compare/9049f1265b7d...0d1a26e67d8f",
  "commits": [
    {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "committer": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    }
  ],
  "head_commit": {
    "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
    "distinct": true,
    "message": "Update README.md",
    "timestamp": "2015-05-05T19:40:15-04:00",
    "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "author": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com",
      "username": "baxterthehacker"
    },
    "committer": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com",
      "username": "baxterthehacker"
    },
    "added": [

    ],
    "removed": [

    ],
    "modified": [
      "README.md"
    ]
  },
  "repository": {
    "id": 35129377,
    "name": "public-repo",
    "full_name": "baxterthehacker/public-repo",
    "owner": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com"
    },
    "private": false,
    "html_url": "https://github.com/baxterthehacker/public-repo",
    "description": "",
    "fork": false,
    "url": "https://github.com/baxterthehacker/public-repo",
    "releases_url": "https://api.github.com/repos/baxterthehacker/public-repo/releases{/id}",
    "created_at": 1430869212,
    "updated_at": "2015-05-05T23:40:12Z",
    "pushed_at": 1430869217,
    "git_url": "git://github.com/baxterthehacker/public-repo.git",
    "ssh_url": "git@github.com:baxterthehacker/public-repo.git",
    "clone_url": "https://github.com/baxterthehacker/public-repo.git",
    "svn_url": "https://github.com/baxterthehacker/public-repo",
    "homepage": null,
    "mirror_url": null,
    "default_branch": "master",
    "master_branch": "master"
  },
  "pusher": {
    "name": "baxterthehacker",
    "email": "baxterthehacker@users.noreply.github.com"
  },
  "sender": {
    "login": "baxterthehacker",
    "id": 6752317,
    "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/baxterthehacker",
    "html_url": "https://github.com/baxterthehacker",
    "type": "User"
  }
}
```

## Gitlab

Gitlab may be identified by the `X-Gitlab-Event: Push Hook` header.

### Push Event

A full description can be found at [Gitlab](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/project/integrations/webhooks.md).

```json
{
  "object_kind": "tag_push",
  "before": "0000000000000000000000000000000000000000",
  "after": "82b3d5ae55f7080f1e6022629cdb57bfae7cccc7",
  "ref": "refs/tags/v1.0.0",
  "checkout_sha": "82b3d5ae55f7080f1e6022629cdb57bfae7cccc7",
  "user_id": 1,
  "user_name": "John Smith",
  "user_avatar":   "https://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=8://s.gravatar.com/avatar/d4c74594d841139328695756648b6bd6?s=80",
  "project_id": 1,
  "project":{
    "name":"Example",
    "description":"",
    "web_url":"http://example.com/jsmith/example",
    "avatar_url":null,
    "git_ssh_url":"git@example.com:jsmith/example.git",
    "git_http_url":"http://example.com/jsmith/example.git",
    "namespace":"Jsmith",
    "visibility_level":0,
    "path_with_namespace":"jsmith/example",
    "default_branch":"master",
    "url":"git@example.com:jsmith/example.git",
    "ssh_url":"git@example.com:jsmith/example.git",
    "http_url":"http://example.com/jsmith/example.git"
  },
  "repository":{
    "name": "Example",
    "url": "ssh://git@example.com/jsmith/example.git",
    "description": "",
    "homepage": "http://example.com/jsmith/example",
    "git_http_url":"http://example.com/jsmith/example.git",
    "git_ssh_url":"git@example.com:jsmith/example.git",
  },
  "commits": []
}
```
