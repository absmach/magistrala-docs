---
title: Domains
description: Manage domains in Magistrala using the CLI.
keywords:
  - CLI
  - Domains
  - Management
  - Magistrala
  - Namespace
  - Users
  - Enable
  - Disable
image: /img/mg-preview.png
---

[Magistrala CLI](./introduction-to-cli.md) provides a simple and efficient way to manage domains. Below are the key commands to manage domains within your system.

### Create Domain

To create a new domain:

```bash
magistrala-cli domains <domain_name> create <route> <user_auth_token>
```

In this command:

- `<domain_name>` is the name you want to give to the new domain.
- `<route>` is the unique alias for the new domain.
- `<user_token>` is your user token.

Here's an example creating a new domain with the name `mydomain` and the alias `myalias` with the user access token stored in the `token` environment variable:

```bash
magistrala-cli domains "mydomain" create "myalias" token
```

After running the command, you should see output similar to this:

```bash
{
  "created_at": "2025-02-12T18:36:44.284205Z",
  "created_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b",
  "id": "16a4ad70-a385-45c5-b50a-6d7e48d768d7",
  "name": "mydomain",
  "alias": "myalias",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Get Domain

To view a single domain:

```bash
magistrala-cli domains <domain_id> get <user_auth_token>
```

where:

- `<domain_id>` is the unique identifier of the domain you want to retrieve information about.
- `<user_token>` is your user token.

For example

```bash
magistrala-cli domains  16a4ad70-a385-45c5-b50a-6d7e48d768d7 get token
```

The ouptut should look like:

```bash
{
  "alias": "myalias",
  "created_at": "2025-02-12T18:36:44.284205Z",
  "created_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b",
  "id": "16a4ad70-a385-45c5-b50a-6d7e48d768d7",
  "name": "mydomain",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Get Domains

To list all domains:

```bash
magistrala-cli domains all get <user_token>
```

For example

```bash
magistrala-cli domains all get token
```

After running this command, you will receive information about all domains. The output should look something like this:

```bash
{
  "domains": [
    {
      "alias": "Domain1",
      "created_at": "2025-02-12T09:45:58.269568Z",
      "created_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b",
      "id": "9879f314-8b0a-4a11-b157-8523491ffa81",
      "name": "domain1",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    },
    {
      "alias": "myalias",
      "created_at": "2025-02-12T18:36:44.284205Z",
      "created_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b",
      "id": "16a4ad70-a385-45c5-b50a-6d7e48d768d7",
      "name": "mydomain",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ],
  "limit": 10,
  "offset": 0,
  "total": 2
}
```

### Update Domain

To update a domain’s name, alias, and metadata:

```bash
magistrala-cli domains <domain_id> update '{"name" : "<new_domain_name>", "metadata" : "<new_metadata>"}' <user_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to update.
- `<new_domain_name>` is the new name you want to give to the domain.
- `<new_metadata>` is the new metadata for the domain.
- `<user_token>` is your user token.

Here's an example in which we're updating the domain with the ID `16a4ad70-a385-45c5-b50a-6d7e48d768d7` to have the name `domain_name` instead of `mydomain`, and adding new metadata `{"location" : "london"}`.

```bash
magistrala-cli domains 16a4ad70-a385-45c5-b50a-6d7e48d768d7 update '{"name" : "domain_name", "metadata" : {"location" : "london"}}' token
```

After running the command, you should see an output similar to this:

```bash
{
  "created_at": "2025-02-12T18:36:44.284205Z",
  "created_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b",
  "id": "16a4ad70-a385-45c5-b50a-6d7e48d768d7",
  "metadata": {
    "location": "london"
  },
  "name": "domain_name",
  "route": "domain_alias",
  "status": "enabled",
  "updated_at": "2025-02-12T18:44:12.799923Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Disable domain

To change a domain status from enabled to disabled:

```bash
magistrala-cli domains disable <domain_id> <user_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to disable.
- `<user_token>` is your user token.

For example,

```bash
magistrala-cli domains disable 16a4ad70-a385-45c5-b50a-6d7e48d768d7 token
```

Expect the result to be an `ok` response.

### Enable domain

To enable a domain:

```bash
magistrala-cli domains <domain_id> enable <user_auth_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to enable.
- `<user_token>` is your user token.

For example,

```bash
magistrala-cli domains enable 16a4ad70-a385-45c5-b50a-6d7e48d768d7 token
```

### Freeze domain

To freeze a domain:

```bash
magistrala-cli domains <domain_id> freeze <user_auth_token>
```

In this command:

- `<domain_id>` is the unique identifier of the domain you want to enable.
- `<user_token>` is your user token.

For example,

```bash
magistrala-cli domains freeze 16a4ad70-a385-45c5-b50a-6d7e48d768d7 token
```

### List Domain users

```bash
magistrala-cli domains <domain_id>  users   <user_token>
```

For example, if your domain ID is `16a4ad70-a385-45c5-b50a-6d7e48d768d7` and your user token is stored in the `token` environment variable, you would type:

```bash
magistrala-cli domains 16a4ad70-a385-45c5-b50a-6d7e48d768d7   users  token
```

After you run this command, the system will show you a list of users in the domain, like this:

```bash
{
  "limit": 10,
  "offset": 0,
  "total": 2,
  "users": [
    {
      "created_at": "2024-03-21T08:06:55.232067Z",
      "credentials": {
        "identity": "user1@email.com"
      },
      "id": "6a8c0864-1d95-4053-a335-a6399c0ccb0a",
      "metadata": {
        "location": "london"
      },
      "name": "user1",
      "status": "enabled",
      "tags": [
        "male",
        "developer"
      ],
      "updated_at": "2024-03-25T10:31:26.557439Z"
    },
    {
      "created_at": "2024-03-25T09:21:03.821017Z",
      "credentials": {
        "identity": "user3@example.com"
      },
      "id": "78411c55-adfe-4940-bbbf-e973d60a4e14",
      "name": "user3",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ]
}
```

This output tells you that there are currently 2 users in the domain.
