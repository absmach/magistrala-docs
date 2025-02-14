---
title: Bootstrap
---



### Add configuration

To create a config:

```bash
magistrala-cli bootstrap create '{"external_id": "myExtID", "external_key": "myExtKey", "name": "myName", "content": "myContent"}' <domain_id> <user_auth_token>
```

### View configuration

To retrieve a specific config:

```bash
magistrala-cli bootstrap get <client_id> <domain_id> <user_auth_token>
```

### Retrieve all configurations

To get a list of all configs:

```bash
magistrala-cli bootstrap get all <domain_id> <user_auth_token>
```

### Update Bootstrap

#### **Update configuration**

To update the editable fields of a provided config:

```bash
magistrala-cli bootstrap update config '{"magistrala_id":"<client_id>", "name": "newName", "content": "newContent"}' <domain_id> <user_auth_token>
```

#### **Update connection**

To update the channel list corresponding Client is connected to:

```bash
magistrala-cli bootstrap update connection <id> <channel_ids> <domain_id> <user_auth_token>
```

#### **Update certs**

To update the bootstrap config certificates:

```bash
magistrala-cli bootstrap update certs <id>   <id> <client_cert> <client_key> <ca> <domain_id> <user_auth_token>
```

### Remove configuration

To remove a config:

```bash
magistrala-cli bootstrap remove <client_id> <domain_id> <user_auth_token>
```

### Bootstrap configuration

To return a config to the Client with provided external ID using an external key:

```bash
magistrala-cli bootstrap bootstrap [<external_id> <external_key> | secure <external_id> <external_key> <crypto_key> ]
```

### Whitelist Configuration

To update the client state config with a given id from the authenticated user:

```bash
magistrala-cli bootstrap whitelist <JSON_config> <domain_id> <user_auth_token>
```

## Config

Magistrala CLI tool supports configuration files that contain some of the basic settings so you don't have to specify them through flags. Once you set the settings, they remain stored locally.

```bash
magistrala-cli config <parameter> <value>
```

The response should look like this:

```bash
  ok
```

This command is used to set the flags to be used by CLI in a local TOML file. The default location of the TOML file is in the same directory as the CLI binary. To change the location of the TOML file you can run the command:

```bash
  magistrala-cli config <parameter> <value> -c "cli/file_name.toml"
```

The possible parameters that can be set using the config command are:

| Flag             | Description                                          | Default                  |
| ---------------- | ---------------------------------------------------- | ------------------------ |
| bootstrap_url    | Bootstrap service URL                                |   [bootstrap_url][bootstrap]|
| certs_url        | Certs service URL                                    | [certs_url][certs]  |
| http_adapter_url | HTTP adapter URL                                     |  [http_adapter_url][http_adapter] |
| msg_content_type | Message content type                                 | "application/senml+json" |
| reader_url       | Reader URL                                           | [reader_url][reader]       |
| clients_url       | Clients service URL                                   | [clients_url][clients]  |
| tls_verification | Do not check for TLS cert                            |                          |
| users_url        | Users service URL                                    | [users_url][users]  |
| state            | Bootstrap state query parameter                      |                          |
| status           | User status query parameter                          |                          |
| topic            | Subscription topic query parameter                   |                          |
| contact          | Subscription contact query parameter                 |                          |
| email            | User email query parameter                           |                          |
| limit            | Limit query parameter                                | 10                       |
| metadata         | Metadata query parameter                             |                          |
| name             | Name query parameter                                 |                          |
| offset           | Offset query parameter                               |                          |
| raw_output       | Enables raw output mode for easier parsing of output |                          |

[bootstrap]: http://localhost:9013
[certs]: http://localhost:9019
[http_adapter]:http://localhost/http
[reader]: http://localhost
[clients]: http://localhost:9000
[users]:http://localhost:9002
