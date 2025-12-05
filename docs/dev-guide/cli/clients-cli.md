---
title: Clients
description: Manage clients in Magistrala using the CLI.
keywords:
  - CLI
  - Clients
  - Devices
  - Management
  - Magistrala
  - Channels
  - Connection
  - Provisioning
image: /img/mg-preview.png
---

[Magistrala CLI](./introduction-to-cli.md) provides a simple and efficient way to manage clients or devices. Below are the key commands to create, connect, assign and manage clients within your system.

### Create Client

To create a client using `Magistrala-CLI`, run the following command:

```bash
magistrala-cli clients <client_id> create <JSON_client> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli clients create '{"name":"myClient"}' 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Example response:

```json
{
  "created_at": "2025-02-12T15:49:38.170333Z",
  "credentials": {
    "secret": "d2c4cb45-2ef6-4fca-95c7-e293596d322b"
  },
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "baff9fe7-2673-499f-a23c-a209836174b8",
  "name": "myClient",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Bulk Provision Clients

Easily provision multiple clients using:

- `file` - A CSV or JSON file containing client names (must have extension `.csv` or `.json`)
- `user_token` - A valid user auth token for the current system

```bash
magistrala-cli clients <clients_file> <domain_id> <user_token>
```

An example CSV file might be:

```csv
client1,
client2,
client3,
```

in which the first column is client names.

A comparable JSON file would be

```json
[
  {
    "name": "<client1_name>",
    "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
    "status": "enabled"
  },
  {
    "name": "<client2_name>",
    "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
    "status": "disabled"
  },
  {
    "name": "<client3_name>",
    "status": "enabled",
    "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
    "credentials": {
      "identity": "<client3_identity>",
      "secret": "<client3_secret>"
    }
  }
]
```

With JSON you can be able to specify more fields of the channels you want to create.

### Update Client Information

Using the update flag can update the client's name, tags, metadata and secret.

```bash
magistrala-cli clients <client_id> update <JSON_string> <domain_id> <user_auth_token>
```

#### Update Client Name and Metadata

To update a client's name and metadata:

```bash
magistrala-cli clients <client_id> update '{"name":"value1", "metadata":{"key1": "value2"}}' <user_token>
```

Example usage:

```bash
magistrala-cli clients 54d6e225-994b-4dcf-8487-58abc5557bd3  update '{"name":"LightBulb"}' 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T15:54:48.14268Z",
  "credentials": {
    "secret": "7f65b0e5-bf3c-41d9-bd8a-70263320b9ab"
  },
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "54d6e225-994b-4dcf-8487-58abc5557bd3",
  "name": "LightBulb",
  "status": "enabled",
  "updated_at": "2025-02-12T16:34:44.495969Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

#### Update Client Tags

To update a client's tags:

```bash
magistrala-cli clients <client_id> update tags '["tag1", "tag2"]' <user_token>
```

Example usage:

```bash
magistrala-cli clients 54d6e225-994b-4dcf-8487-58abc5557bd3 update tags '["tag1", "tag2"]' 9879f314-8b0a-4a11-b157-8523491ffa81  token
```

Expected result:

```json
{
  "created_at": "2025-02-12T15:54:48.14268Z",
  "credentials": {},
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "54d6e225-994b-4dcf-8487-58abc5557bd3",
  "name": "LightBulb",
  "status": "enabled",
  "tags": ["tag1", "tag2"],
  "updated_at": "2025-02-12T16:37:11.215478Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

#### Update Client Secret

To update a client's secret:

```bash
magistrala-cli clients <client_id> update secret <secret> <domain_id> <user_token>
```

Example usage:

```bash
magistrala-cli clients  54d6e225-994b-4dcf-8487-58abc5557bd3 update secret 12345678  9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T15:54:48.14268Z",
  "credentials": {},
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "54d6e225-994b-4dcf-8487-58abc5557bd3",
  "name": "LightBulb",
  "status": "enabled",
  "tags": ["tag1", "tag2"],
  "updated_at": "2025-02-12T16:40:37.734493Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Enable Client

To change a client status:

```bash
magistrala-cli clients <client_id> enable <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli clients  54d6e225-994b-4dcf-8487-58abc5557bd3 enable 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T15:54:48.14268Z",
  "credentials": {},
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "54d6e225-994b-4dcf-8487-58abc5557bd3",
  "name": "LightBulb",
  "status": "enabled",
  "tags": ["tag1", "tag2"],
  "updated_at": "2025-02-12T16:45:35.913837Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Disable Client

To change a clients status from enabled to disabled:

```bash
magistrala-cli clients <client_id> disable <domain_id> <user_token>
```

Example usage:

```bash
magistrala-cli clients 54d6e225-994b-4dcf-8487-58abc5557bd3 disable 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T15:54:48.14268Z",
  "credentials": {},
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "54d6e225-994b-4dcf-8487-58abc5557bd3",
  "name": "LightBulb",
  "status": "disabled",
  "tags": ["tag1", "tag2"],
  "updated_at": "2025-02-12T16:44:24.716324Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Get Client

To view a specific client:

```bash
magistrala-cli clients <client_id> get <domain_id> <user_token>
```

Eample usage:

```bash
magistrala-cli clients 54d6e225-994b-4dcf-8487-58abc5557bd3 get 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected result:

```json
{
  "created_at": "2025-02-12T15:54:48.14268Z",
  "credentials": {
    "secret": "12345678"
  },
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "54d6e225-994b-4dcf-8487-58abc5557bd3",
  "name": "LightBulb",
  "status": "enabled",
  "tags": ["tag1", "tag2"],
  "updated_at": "2025-02-12T16:45:35.913837Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Get Clients

To list clients present in the system:

```bash
magistrala-cli clients all get <domain_id> <user_token>
```

### Get a subset list of provisioned Clients

To list clients based on a set of parameters:

```bash
magistrala-cli clients all get --offset=1 --limit=5  <domain_id> <user_token>
```

### Connect Client

To connect a client to a channel:

```bash
magistrala-cli clients <client_id> connect <channel_id> <conn_types_json_list> <domain_id> <user_auth_token>
```

### Disconnect Client

To disconnect a client from a channel:

```bash
magistrala-cli clients <client_id>  disconnect <channel_id> <conn_types_json_list> <domain_id> <user_auth_token>
```

### Delete Client

To permenently delete a client from the system:

```bash
magistrala-cli clients <client_id> delete  <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli clients 54d6e225-994b-4dcf-8487-58abc5557bd3  delete 9879f314-8b0a-4a11-b157-8523491ffa81token
```

Expected result is a short `ok` response.
