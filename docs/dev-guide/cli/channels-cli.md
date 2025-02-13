---
title: Channels
---

Magistrala CLI provides a simple and efficient way to manage channels. Below are the key commands to create, connect, assign and manage channels within your system.

### Create Channel

To create a new channel:

```bash
magistrala-cli channels create '{"name":"myChannel"}' <domain_id> <user_token>
```

Example usage:

```bash
magistrala-cli channels create '{"name":"myChannel"}' 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T17:25:02.063072Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "41a64d0c-5ac6-42d7-bff6-0d4d2828416e",
  "name": "myChannel",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Bulk Provision Channels

Easily provision multiple channels using:

- `file` - A CSV or JSON file containing channel names (must have extension `.csv` or `.json`)
- `user_token` - A valid user auth token for the current system

```bash
magistrala-cli provision channels <file> <domain_id> <user_token>
```

An example CSV file might be:

```csv
<channel1_name>,
<channel2_name>,
<channel3_name>,
```

in which the first column is channel names.

A comparable JSON file would be

```json
[
  {
    "name": "<channel1_name>",
    "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
    "description": "<channel1_description>",
    "status": "enabled"
  },
  {
    "name": "<channel2_name>",
    "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
    "description": "<channel2_description>",
    "status": "disabled"
  },
  {
    "name": "<channel3_name>",
    "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
    "description": "<channel3_description>",
    "status": "enabled"
  }
]
```

With JSON you can be able to specify more fields of the channels you want to create

### Update Channel Information

Using the update flag can update the channel.

```bash
magistrala-cli update <channel_id> '{"id":"<channel_id>","name":"myNewName"}' <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli channels update 41a64d0c-5ac6-42d7-bff6-0d4d2828416e '{"name":"Lights"}' 9879f314-8b0a-4a11-b157-8523491ffa81 <user_token>
```

Expected result:

```json
{
  "created_at": "2025-02-12T17:25:02.063072Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "41a64d0c-5ac6-42d7-bff6-0d4d2828416e",
  "name": "Lights",
  "updated_at": "2025-02-12T18:01:51.27765Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}

```

### Enable Channel

To enabke a channel:

```bash
magistrala-cli channels enable <channel_id> <domain_id> <user_token>
```

Example usage:

```bash
magistrala-cli channels enable 41a64d0c-5ac6-42d7-bff6-0d4d2828416e 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T17:25:02.063072Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "41a64d0c-5ac6-42d7-bff6-0d4d2828416e",
  "name": "Lights",
  "updated_at": "2025-02-12T18:02:51.127089Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Disable Channel

To change a channel's status from enabled to disabled:

```bash
magistrala-cli channels disable <channel_id> <domain_id> <user_token>
```

Example usage:

```bash
magistrala-cli channels disable 41a64d0c-5ac6-42d7-bff6-0d4d2828416e 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T17:25:02.063072Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "41a64d0c-5ac6-42d7-bff6-0d4d2828416e",
  "name": "Lights",
  "status": "disabled",
  "updated_at": "2025-02-12T18:02:51.127089Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Get Channel

To view a specific channel:

```bash
magistrala-cli channels get <channel_id> <domain_id> <user_token>
```

Example usage:

```bash
magistrala-cli channels get 41a64d0c-5ac6-42d7-bff6-0d4d2828416e 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T17:25:02.063072Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "41a64d0c-5ac6-42d7-bff6-0d4d2828416e",
  "name": "Lights",
  "updated_at": "2025-02-12T18:04:58.941926Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Get Channels

To list all the channels in the system:

```bash
magistrala-cli channels get all  <domain_id> <user_token>
```

### Get a subset list of provisioned Channels

To list clients based on a set of parameters:

```bash
magistrala-cli channels get all --offset=1 --limit=5  <domain_id> <user_token>
```

### Connect Client to Channel

To connect a client to a channel:

```bash
magistrala-cli clients connect <client_id> <channel_id> <conn_types_json_list> <domain_id> <user_auth_token>
```

### Bulk Connect Clients to Channels

To connect multiple clients to channels use:

- `file` - A CSV or JSON file containing client and channel ids (must have extension `.csv` or `.json`)
- `user_token` - A valid user auth token for the current system

```bash
magistrala-cli provision connect <file>  <domain_id> <user_token>
```

An example CSV file might be

```csv
<client_id1>,<channel_id1>
<client_id2>,<channel_id2>
```

in which the first column is client IDs and the second column is channel IDs. A connection will be created for each client to each channel. This example would result in 4 connections being created.

A comparable JSON file would be

```json
{
  "subjects": ["<client_id1>", "<client_id2>"],
  "objects": ["<channel_id1>", "<channel_id2>"]
}
```

### Disconnect Client from Channel

To disconnect a client from a channel:

```bash
magistrala-cli clients disconnect <client_id> <channel_id> <domain_id> <user_token>
```
