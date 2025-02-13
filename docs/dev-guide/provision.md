---
title: Provision
---


Provisioning is a process of configuration of an IoT platform in which system operator creates and sets-up different entities used in the platform - users, groups, channels and clients.

## Users Management

### Create an Account

Use the Magistrala API to create user account:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" https://localhost/users -d '{"first_name": "Jane", "last_name":"Doe","email":"janedoe@example.com", "credentials": {"username": "janedoe", "secret": "12345678"}, "status": "enabled"}'
```

Response should look like this:

```json
HTTP/2 201 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:19:38 GMT
content-type: application/json
content-length: 263
location: /users/156005cc-df12-4809-aa93-842be168f2ab
access-control-expose-headers: Location

{"id":"156005cc-df12-4809-aa93-842be168f2ab","first_name":"Jane","last_name":"Doe","status":"enabled","role":"user","credentials":{"username":"janedoe"},"email":"janedoe@example.com","created_at":"2025-02-13T21:19:38.863268Z","updated_at":"0001-01-01T00:00:00Z"}
```

Note that when using official `docker-compose`, all services are behind `nginx` proxy and all traffic is `TLS` encrypted.

### Obtain an Authorization Token

In order for this user to be able to authenticate to the system, you will have to create an authorization token for them:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" https://localhost/users/tokens/issue -d '{"username":"admin", "password":"12345678"}'
```

Response should look like this:

```json
HTTP/2 201 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:30:06 GMT
content-type: application/json
content-length: 583
access-control-expose-headers: Location

{"access_token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk0ODU4MDYsImlhdCI6MTczOTQ4MjIwNiwiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MCwidXNlciI6IjBkNDA5NDgyLTA3MzctNDVlYS04Mjg0LTViZDg4MDU5ZjYyNSJ9.nFeihdM7KQJKr_2WQaKUFqBGWVw1qfjh0N6Uc5C6UXc2ugtm4LCf0sjDawi9ok_szk0fQeWWX8bqOsnEvhobZA","refresh_token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk1Njg2MDYsImlhdCI6MTczOTQ4MjIwNiwiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjBkNDA5NDgyLTA3MzctNDVlYS04Mjg0LTViZDg4MDU5ZjYyNSJ9.DbaMpgVPtL7ER5wlsFmVtC3izKgjB66qsl1beT0qnlcWcfp7NQyvBtT0EW3OyibcqG56SnqO0ye1mzaJLgViqg"}
```

For more information about the Users service API, please check out the [API documentation](https://absmach.github.io/magistrala/?urls.primaryName=users.yml).

## System Provisioning

Before proceeding, make sure that you have created a new account and obtained an authorization token. You can set your `access_token` in the `USER_TOKEN` environment variable:

```bash
USER_TOKEN=<access_token>
```

### Provision Clients

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint currently found at /clients/bulk.

Clients are created by executing request `POST /<domain_id>/clients` with a JSON payload. Note that you will need `user_token` in order to create clients that belong to this particular user. Ensure that you have an active domain. The created client will be part of that domain.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients -d '{"name":"weio"}'
```

Response will contain `Location` header whose value represents path to newly created client:

```json
HTTP/2 201 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:38:46 GMT
content-type: application/json
content-length: 273
location: /clients/78fbb74b-1a5f-4da2-a15d-3ef18c3cf418
access-control-expose-headers: Location

{"id":"78fbb74b-1a5f-4da2-a15d-3ef18c3cf418","name":"weio","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{"secret":"3436ee7d-f2a5-4af5-b670-f907918ff442"},"created_at":"2025-02-13T21:38:46.728996Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}
```

### Bulk Provision Clients

Multiple clients can be created by executing a `POST /clients/bulk` request with a JSON payload. The payload should contain a JSON array of the clients to be created. If there is an error any of the clients, none of the clients will be created.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients/bulk -d '[{"name":"lightbulb"},{"name":"humidifier"}]'
```

The response's body will contain a list of the created clients.

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:40:56 GMT
content-type: application/json
content-length: 592
access-control-expose-headers: Location

{"offset":0,"total":2,"clients":[{"id":"3dee7975-2347-464f-b0c4-baa534d77be4","name":"lightbulb","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{"secret":"9e669b34-c73b-4a87-b9b3-1d0e0a2a5594"},"created_at":"2025-02-13T21:40:56.868242Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"},{"id":"1d441e97-dff8-4db5-b822-3bab0a867284","name":"humidifier","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{"secret":"d260dc7d-65ee-43bd-a3ac-ef3a6ecdad6b"},"created_at":"2025-02-13T21:40:56.868245Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}]}
```

### Retrieve Provisioned Clients

In order to retrieve data of provisioned clients that are written in database, you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients
```

Notice that you will receive only those clients that were provisioned by `user_token` owner.

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:42:27 GMT
content-type: application/json
content-length: 570
access-control-expose-headers: Location

{
    "limit": 10,
    "total": 2,
    "clients": [{"id":"3dee7975-2347-464f-b0c4-baa534d77be4","name":"lightbulb","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{"secret":"9e669b34-c73b-4a87-b9b3-1d0e0a2a5594"},"created_at":"2025-02-13T21:40:56.868242Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"},
    {"id":"1d441e97-dff8-4db5-b822-3bab0a867284","name":"humidifier","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{"secret":"d260dc7d-65ee-43bd-a3ac-ef3a6ecdad6b"},"created_at":"2025-02-13T21:40:56.868245Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}
    ]
}
```

You can specify `offset` and `limit` parameters in order to fetch a specific subset of clients. In that case, your request should look like:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients?offset=0&limit=5
```

You can specify `name` and/or `metadata` parameters in order to fetch specific subset of clients. When specifying metadata you can specify just a part of the metadata JSON you want to match.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients?offset=0&limit=5&name="humidifier"
```

```json
HTTP/2 200
server: nginx/1.23.3
date: Tue, 04 Apr 2023 08:43:09 GMT
content-type: application/json
content-length: 302
access-control-expose-headers: Location

{
    "limit": 5,
    "total": 1,
    "clients": [
      {"id":"1d441e97-dff8-4db5-b822-3bab0a867284","name":"humidifier","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{"secret":"d260dc7d-65ee-43bd-a3ac-ef3a6ecdad6b"},"created_at":"2025-02-13T21:40:56.868245Z","updated_at":"0001-01-01T00:00:00Z","status":"enabled"}
    ]
}
```

If you don't provide them, default values will be used instead: 0 for `offset` and 10 for `limit`. Note that `limit` cannot be set to values greater than 100. Providing invalid values will be considered malformed request.

### Disable Clients

This is a special endpoint that allows you to disable a client, soft deleting it from the database. In order to disable you own client you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients/1d441e97-dff8-4db5-b822-3bab0a867284/disable
```

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:44:57 GMT
content-type: application/json
content-length: 292
access-control-expose-headers: Location

{"id":"1d441e97-dff8-4db5-b822-3bab0a867284","name":"humidifier","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{},"created_at":"2025-02-13T21:40:56.868245Z","updated_at":"2025-02-13T21:44:57.317573Z","updated_by":"0d409482-0737-45ea-8284-5bd88059f625","status":"disabled"}
```

### Enable Clients

This is a special endpoint that allows you to enable a client that was previously disabled. In order to enable you own client you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/clients/1d441e97-dff8-4db5-b822-3bab0a867284/enable
```

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:46:48 GMT
content-type: application/json
content-length: 290
access-control-expose-headers: Location

{"id":"1d441e97-dff8-4db5-b822-3bab0a867284","name":"humidifier","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","credentials":{},"created_at":"2025-02-13T21:40:56.868245Z","updated_at":"2025-02-13T21:46:48.41145Z","updated_by":"0d409482-0737-45ea-8284-5bd88059f625","status":"enabled"}
```

### Provision Channels

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint currently found at /channels/bulk.

Channels are created by executing request `POST /<domain_id>/channels`:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels -d '{"name":"mychan"}'
```

After sending request you should receive response with `Location` header that contains path to newly created channel:

```bash
HTTP/2 201 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:50:55 GMT
content-type: application/json
content-length: 192
location: /channels/bdf084ff-45ac-4f89-b003-09fe83326238
access-control-expose-headers: Location

{"id":"bdf084ff-45ac-4f89-b003-09fe83326238","name":"mychan","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:50:55.324198Z","updated_at":"0001-01-01T00:00:00Z"}
```

### Bulk Provision Channels

Multiple channels can be created by executing a `POST /<domain_id>/clients/bulk` request with a JSON payload. The payload should contain a JSON array of the channels to be created. If there is an error any of the channels, none of the channels will be created.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels/bulk -d '[{"name":"switch1"},{"name":"truck2"}]'
```

The response's body will contain a list of the created channels.

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:52:02 GMT
content-type: application/json
content-length: 421
access-control-expose-headers: Location

{"offset":0,"total":2,"channels":[{"id":"ce56033a-bbce-436a-9d56-bf85ec38f9b3","name":"switch1","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:52:02.210708Z","updated_at":"0001-01-01T00:00:00Z"},{"id":"940378c0-da80-4d29-be77-d80482bded70","name":"truck2","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:52:02.210709Z","updated_at":"0001-01-01T00:00:00Z"}]}
```

### Retrieve Provisioned Channels

In order to retrieve data of provisioned channels that are written in database, you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels
```

Notice that you will receive only those clients that were provisioned by `user_token` owner.

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:53:40 GMT
content-type: application/json
content-length: 624
access-control-expose-headers: Location

{"limit":10,"offset":0,"total":3,"channels":[{"id":"bdf084ff-45ac-4f89-b003-09fe83326238","name":"mychan","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:50:55.324198Z","updated_at":"0001-01-01T00:00:00Z"},{"id":"ce56033a-bbce-436a-9d56-bf85ec38f9b3","name":"switch1","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:52:02.210708Z","updated_at":"0001-01-01T00:00:00Z"},{"id":"940378c0-da80-4d29-be77-d80482bded70","name":"truck2","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:52:02.210709Z","updated_at":"0001-01-01T00:00:00Z"}]}
```

You can specify `offset` and `limit` parameters in order to fetch specific subset of channels. In that case, your request should look like:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels?offset=0&limit=5
```

If you don't provide them, default values will be used instead: 0 for `offset` and 10 for `limit`. Note that `limit` cannot be set to values greater than 100. Providing invalid values will be considered malformed request.

### Disable Channels

This is a special endpoint that allows you to disable a channel, soft deleting it from the database. In order to disable you own channel you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels/bdf084ff-45ac-4f89-b003-09fe83326238/disable
```

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:55:14 GMT
content-type: application/json
content-length: 271
access-control-expose-headers: Location

{"id":"bdf084ff-45ac-4f89-b003-09fe83326238","name":"mychan","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:50:55.324198Z","updated_at":"2025-02-13T21:55:14.577701Z","updated_by":"0d409482-0737-45ea-8284-5bd88059f625","status":"disabled"}
```

### Enable Channels

This is a special endpoint that allows you to enable a channel that was previously disabled. In order to enable you own channel you can send following request:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels/bdf084ff-45ac-4f89-b003-09fe83326238/enable
```

```json
HTTP/2 200 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:56:56 GMT
content-type: application/json
content-length: 251
access-control-expose-headers: Location

{"id":"bdf084ff-45ac-4f89-b003-09fe83326238","name":"mychan","domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516","created_at":"2025-02-13T21:50:55.324198Z","updated_at":"2025-02-13T21:56:56.255417Z","updated_by":"0d409482-0737-45ea-8284-5bd88059f625"}
```

## Access Control

Channel can be observed as a communication group of clients. Only clients that are connected to the channel can send and receive messages from other clients in this channel. Clients that are not connected to this channel are not allowed to communicate over it. Users may also be assigned to channels, thus sharing clients between users. With the necessary policies in place, users can be granted access to clients that are not owned by them.

A user who is the owner of a channel or a user that has been assigned to the channel with the required policy can connect clients to the channel. This is equivalent of giving permissions to these clients to communicate over given communication group.

To connect a client to the channel you should send following request:

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint found at /connect.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X PUT -H "Authorization: Bearer $USER_TOKEN" https://localhost/<domain_id>/channels/<channel_id>/connect {
    "client_ids": ["client_id"],
    "types": ["publish"]
}
```

For example:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X PUT -H "Authorization: Bearer $USER_TOKEN" https://localhost/cd992e16-f2b2-4f85-90c5-39bd7fc3e516/channels/bdf084ff-45ac-4f89-b003-09fe83326238/connect -d '{"client_ids": ["78fbb74b-1a5f-4da2-a15d-3ef18c3cf418"], "types": ["publish"]}'
```

```json
HTTP/2 405 
server: nginx/1.25.4
date: Thu, 13 Feb 2025 22:12:13 GMT
content-length: 0
allow: POST

```

You can observe which clients are connected to specific channel:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/<domain_id>/channels/<channel_id>/clients
```

You can observe to which channels is specified client connected:

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -H "Authorization: Bearer $USER_TOKEN" https://localhost/clients/<client_id>/channels
```

If you want to disconnect your client from the channel, send following request:

> This endpoint will be depreciated in 1.0.0. It will be replaced with the bulk endpoint found at /disconnect.

```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X DELETE -H "Authorization: Bearer $USER_TOKEN" https://localhost/<domain_id>/channels/<channel_id>/disconnect -d '{"client_ids": ["78fbb74b-1a5f-4da2-a15d-3ef18c3cf418"], "types": ["publish"]}'
```

Response that you'll get should look like this:

```json
HTTP/2 204
server: nginx/1.23.3
date: Tue, 04 Apr 2023 09:57:53 GMT
access-control-expose-headers: Location
```

For more information about the Clients service API, please check out the [API documentation](https://absmach.github.io/magistrala/?urls.primaryName=clients.yml).

## Provision Service

Provisioning is a process of configuration of an IoT platform in which system operator creates and sets-up different entities used in the platform - users, channels and clients. It is part of process of setting up IoT applications where we connect devices on edge with platform in cloud. For provisioning we can use [Magistrala CLI][cli] for creating users and for each node in the edge (eg. gateway) required number of clients, channels, connecting them and creating certificates if needed. Provision service is used to set up initial application configuration once user is created. Provision service creates clients, channels, connections and certificates. Once user is created we can use provision to create a setup for edge node in one HTTP request instead of issuing several CLI commands.

Provision service provides an HTTP API to interact with [Magistrala][provision-api].

For gateways to communicate with [Magistrala][magistrala] configuration is required (MQTT host, client, channels, certificates...). Gateway will send a request to [Bootstrap][bootstrap] service providing `<external_id>` and `<external_key>` in HTTP request to get the configuration. To make a request to [Bootstrap][bootstrap] service you can use [Agent][agent] service on a gateway.

To create bootstrap configuration you can use [Bootstrap][bootstrap] or `Provision` service. [Magistrala UI][mgui] uses [Bootstrap][bootstrap] service for creating gateway configurations. `Provision` service should provide an easy way of provisioning your gateways i.e creating bootstrap configuration and as many clients and channels that your setup requires.

Also, you may use provision service to create certificates for each client. Each service running on gateway may require more than one client and channel for communication.
If, for example, you are using services [Agent][agent] and [Export][exp] on a gateway you will need two channels for `Agent` (`data` and `control`) and one client for `Export`.
Additionally, if you enabled mTLS each service will need its own client and certificate for access to [Magistrala][magistrala].
Your setup could require any number of clients and channels, this kind of setup we can call `provision layout`.

Provision service provides a way of specifying this `provision layout` and creating a setup according to that layout by serving requests on `/mapping` endpoint. Provision layout is configured in [config.toml][conftoml].

### Configuration

The service is configured using the environment variables presented in the following [table][config]. Note that any unset variables will be replaced with their default values.

By default, call to `/mapping` endpoint will create one client and two channels (`control` and `data`) and connect it as this is typical setup required by [Agent](./edge.md#agent). If there is a requirement for different provision layout we can use [config][conftoml] file in addition to environment variables.

For the purposes of running provision as an add-on in docker composition environment variables seems more suitable. Environment variables are set in [.env][env].

Configuration can be specified in [config.toml][conftoml]. Config file can specify all the settings that environment variables can configure and in addition `/mapping` endpoint provision layout can be configured.

In `config.toml` we can enlist an array of clients and channels that we want to create and make connections between them which we call provision layout.

Clients Metadata can be whatever suits your needs. Client that has metadata with `external_id` will have bootstrap configuration created, `external_id` value will be populated with value from [request](#example)).
Bootstrap configuration can be fetched with [Agent][agent]. For channel's metadata `type` is reserved for `control` and `data` which we use with [Agent][agent].

Example of provision layout below

```toml
[bootstrap]
  [bootstrap.content]
    [bootstrap.content.agent.edgex]
      url = "http://localhost:48090/api/v1/"

    [bootstrap.content.agent.log]
      level = "info"

    [bootstrap.content.agent.mqtt]
      mtls = false
      qos = 0
      retain = false
      skip_tls_ver = true
      url = "localhost:1883"

    [bootstrap.content.agent.server]
      nats_url = "localhost:4222"
      port = "9000"

    [bootstrap.content.agent.heartbeat]
      interval = "30s"

    [bootstrap.content.agent.terminal]
      session_timeout = "30s"

    [bootstrap.content.export.exp]
      log_level = "debug"
      nats = "nats://localhost:4222"
      port = "8172"
      cache_url = "localhost:6379"
      cache_pass = ""
      cache_db = "0"

    [bootstrap.content.export.mqtt]
      ca_path = "ca.crt"
      cert_path = "client.crt"
      channel = ""
      host = "tcp://localhost:1883"
      mtls = false
      password = ""
      priv_key_path = "client.key"
      qos = 0
      retain = false
      skip_tls_ver = false
      username = ""

    [[bootstrap.content.export.routes]]
      mqtt_topic = ""
      nats_topic = "channels"
      subtopic = ""
      type = "mfx"
      workers = 10

    [[bootstrap.content.export.routes]]
      mqtt_topic = ""
      nats_topic = "export"
      subtopic = ""
      type = "default"
      workers = 10

[[clients]]
  name = "client"

  [clients.metadata]
    external_id = "xxxxxx"

[[channels]]
  name = "control-channel"

  [channels.metadata]
    type = "control"

[[channels]]
  name = "data-channel"

  [channels.metadata]
    type = "data"

[[channels]]
  name = "export-channel"

  [channels.metadata]
    type = "export"
```

`[bootstrap.content]` will be marshalled and saved into `content` field in bootstrap configs when request to `/mappings` is made, `content` field from bootstrap config is used to create `Agent` and `Export` configuration files upon `Agent` fetching bootstrap configuration.

### Authentication

In order to create necessary entities provision service needs to authenticate against Magistrala.
To provide authentication credentials to the provision service you can pass it in as an environment variable or in a config file as Magistrala user and password or as API token (that can be issued on `/users/tokens/issue` endpoint of [users service][users].

Additionally, users or API token can be passed in Authorization header, this authentication takes precedence over others.

- `username`, `password` - (`MG_PROVISION_USER`, `MG_PROVISION_PASSWORD` in [.env][env], `MG_user`, `MG_pass` in [config.toml][conftoml]
- API Key - (`MG_PROVISION_API_KEY` in [.env][env] or [config.toml][conftoml]
- `Authorization: Bearer Token|ApiKey` - request authorization header containing users token. Check [auth][auth].

### Running

Provision service can be run as a standalone or in docker composition as addon to the core docker composition.

Standalone:

```bash
MG_PROVISION_BS_SVC_URL=http://bootstrap:9013 \
MG_PROVISION_CLIENTS_LOCATION=http://clients:9006 \
MG_PROVISION_USERS_LOCATION=http://users:9002 \
MG_PROVISION_CONFIG_FILE=/configs/config.toml \
build/magistrala-provision
```

Docker composition:

```bash
docker-compose -f docker/addons/provision/docker-compose.yml up
```

### Provision

For the case that credentials or API token is passed in configuration file or environment variables, call to `/mapping` endpoint doesn't require `Authentication` header:

```bash
curl -s -S  -X POST  http://localhost:9016/mapping  -H 'Content-Type: application/json' -d '{"external_id": "33:52:77:99:43", "external_key": "223334fw2"}'
```

In the case that provision service is not deployed with credentials or API key or you want to use user other than one being set in environment (or config file):

```bash
curl -s -S  -X POST  http://localhost:9016/mapping -H "Authorization: Bearer <token|api_key>" -H 'Content-Type: application/json' -d '{"external_id": "<external_id>", "external_key": "<external_key>"}'
```

Or if you want to specify a name for client different than in `config.toml` you can specify post data as:

```json
{
  "name": "<name>",
  "external_id": "<external_id>",
  "external_key": "<external_key>"
}
```

Response contains created clients, channels and certificates if any:

```json
{
  "clients": [
    {
      "id": "c22b0c0f-8c03-40da-a06b-37ed3a72c8d1",
      "name": "client",
      "domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516",
      "credentials":{"secret":"9e669b34-c73b-4a87-b9b3-1d0e0a2a5594"},
      "metadata": {
        "external_id": "33:52:79:C3:43"
      }
    }
  ],
  "channels": [
    {
      "id": "064c680e-181b-4b58-975e-6983313a5170",
      "domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516",
      "name": "control-channel",
      "metadata": {
        "type": "control"
      }
    },
    {
      "id": "579da92d-6078-4801-a18a-dd1cfa2aa44f",
      "domain_id":"cd992e16-f2b2-4f85-90c5-39bd7fc3e516",
      "name": "data-channel",
      "metadata": {
        "type": "data"
      }
    }
  ],
  "whitelisted": {
    "c22b0c0f-8c03-40da-a06b-37ed3a72c8d1": true
  }
}
```

### Example

Deploy Magistrala UI docker composition as it contains all the required services for provisioning to work ( `certs`, `bootstrap` and Magistrala core)

```bash
git clone https://github.com/absmach/magistrala-ui
cd magistrala-ui
docker-compose -f docker/docker-compose.yml up
```

Create user and obtain access token

```bash
magistrala-cli users create john.doe@email.com 12345678

# Retrieve token
magistrala-cli users token john.doe@email.com 12345678

created: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTY1ODU3MDUsImlhdCI6MTU5NjU0OTcwNSwiaXNzIjoibWFpbmZsdXguYXV0aG4iLCJzdWIiOiJtaXJrYXNoQGdtYWlsLmNvbSIsInR5cGUiOjB9._vq0zJzFc9tQqc8x74kpn7dXYefUtG9IB0Cb-X2KMK8
```

Put a value of token into environment variable

```bash
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTY1ODU3MDUsImlhdCI6MTU5NjU0OTcwNSwiaXNzIjoibWFpbmZsdXguYXV0aG4iLCJzdWIiOiJtaXJrYXNoQGdtYWlsLmNvbSIsInR5cGUiOjB9._vq0zJzFc9tQqc8x74kpn7dXYefUtG9IB0Cb-X2KMK8
```

Make a call to provision endpoint

```bash
curl -s -S  -X POST  http://magistrala.com:9016/mapping -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json'   -d '{"name":"edge-gw",  "external_id" : "gateway", "external_key":"external_key" }'
```

To check the results you can make a call to bootstrap endpoint

```bash
curl -s -S -X GET http://magistrala.com:9013/clients/bootstrap/gateway -H "Authorization: Client external_key" -H 'Content-Type: application/json'
```

Or you can start `Agent` with:

```bash
git clone https://github.com/absmach/agent.git
cd agent
make
MG_AGENT_BOOTSTRAP_ID=gateway MG_AGENT_BOOTSTRAP_KEY=external_key MG_AGENT_BOOTSTRAP_URL=http://magistrala.ccom:9013/clients/bootstrap build/magistrala-agent
```

Agent will retrieve connections parameters and connect to Magistrala cloud.

For more information about the Provision service API, please check out the [API documentation](https://github.com/absmach/magistrala/blob/master/api/provision.yml).

[magistrala]: https://github.com/absmach/magistrala
[bootstrap]: https://github.com/absmach/magistrala/tree/main/bootstrap
[agent]: https://github.com/absmach/agent
[config]: https://github.com/absmach/magistrala/tree/main/provision#configuration
[env]: https://github.com/absmach/magistrala/blob/main/docker/.env
[mgui]: https://github.com/absmach/magistrala-ui-new
[conftoml]: https://github.com/absmach/magistrala/blob/main/docker/addons/provision/configs/config.toml
[users]: https://github.com/absmach/magistrala/blob/main/users/README.md
[exp]: https://github.com/absmach/export
[cli]: https://github.com/absmach/magistrala/tree/main/cli
[auth]: authentication.md
[provision-api]: https://absmach.github.io/magistrala/?urls.primaryName=provision.yml
