---
title: CLI
---


Magistrala CLI makes it easy to manage users, things, channels and messages.

CLI can be downloaded as separate asset from [project realeses][releases] or it can be built with `GNU Make` tool:

Get the Magistrala code

```bash
go get github.com/absmach/magistrala
```

Build the magistrala-cli

```bash
make cli
```

which will build `magistrala-cli` in `<project_root>/build` folder.

Executing `build/magistrala-cli` without any arguments will output help with all available commands and flags:

```bash
Usage:
  magistrala-cli [command]

Available Commands:
  bootstrap    Bootstrap management
  certs        Certificates management
  channels     Channels management
  completion   Generate the autocompletion script for the specified shell
  config       CLI local config
  domains      Domains management
  groups       Groups management
  health       Health Check
  help         Help about any command
  invitations  Invitations management
  journal      journal log
  messages     Send or read messages
  provision    Provision things and channels from a config file
  subscription Subscription management
  things       Things management
  users        Users management

Flags:
  -b, --bootstrap-url string     Bootstrap service URL
  -s, --certs-url string         Certs service URL
  -c, --config string            Config path
  -C, --contact string           Subscription contact query parameter
  -y, --content-type string      Message content type (default "application/senml+json")
  -x, --curl                     Convert HTTP request to cURL command
  -d, --domains-url string       Domains service URL
  -h, --help                     help for magistrala-cli
  -H, --host-url string          Host URL
  -p, --http-url string          HTTP adapter URL
  -I, --identity string          User identity query parameter
  -i, --insecure                 Do not check for TLS cert
  -v, --invitations-url string   Inivitations URL
  -a, --journal-url string       Journal Log URL
  -l, --limit uint               Limit query parameter (default 10)
  -m, --metadata string          Metadata query parameter
  -n, --name string              Name query parameter
  -o, --offset uint              Offset query parameter
  -r, --raw                      Enables raw output mode for easier parsing of output
  -R, --reader-url string        Reader URL
  -z, --state string             Bootstrap state query parameter
  -S, --status string            User status query parameter
  -t, --things-url string        Things service URL
  -T, --topic string             Subscription topic query parameter
  -u, --users-url string         Users service URL

Use "magistrala-cli [command] --help" for more information about a command.
```

It is also possible to use the docker image `magistrala/cli` to execute CLI command:

```bash
docker run -it --rm magistrala/cli -u http://<IP_SERVER> [command]
```

For example:

```bash
docker run -it --rm magistrala/cli -u http://192.168.160.1 users token admin@example.com 12345678

{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA2MjEzMDcsImlhdCI6MTY4MDYyMDQwNywiaWRlbnRpdHkiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6ImYxZTA5Y2YxLTgzY2UtNDE4ZS1iZDBmLWU3M2I3M2MxNDM2NSIsInR5cGUiOiJhY2Nlc3MifQ.iKdBv3Ko7PKuhjTC6Xs-DvqfKScjKted3ZMorTwpXCd4QrRSsz6NK_lARG6LjpE0JkymaCMVMZlzykyQ6ZgwpA",
  "access_type": "Bearer",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODA3MDY4MDcsImlhdCI6MTY4MDYyMDQwNywiaWRlbnRpdHkiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzcyI6ImNsaWVudHMuYXV0aCIsInN1YiI6ImYxZTA5Y2YxLTgzY2UtNDE4ZS1iZDBmLWU3M2I3M2MxNDM2NSIsInR5cGUiOiJyZWZyZXNoIn0.-0tOtXFZi48VS-FxkCnVxnW2RUkJvqUmzRz3_EYSSKFyKealoFrv7sZIUvrdvKomnUFzXshP0EygL8vjWP1SFw"
}
```

You can execute each command with `-h` flag for more information about that command, e.g.

```bash
magistrala-cli bootstrap -h
```

Response should look like this:

```bash
Bootstrap management: create, get, update, delete or whitelist Bootstrap config

Usage:
  magistrala-cli bootstrap [command]

Available Commands:
  bootstrap   Bootstrap config
  create      Create config
  get         Get config
  remove      Remove config
  update      Update config
  whitelist   Whitelist config

Flags:
  -h, --help   help for bootstrap

Global Flags:
  -b, --bootstrap-url string     Bootstrap service URL
  -s, --certs-url string         Certs service URL
  -c, --config string            Config path
  -C, --contact string           Subscription contact query parameter
  -y, --content-type string      Message content type (default "application/senml+json")
  -x, --curl                     Convert HTTP request to cURL command
  -d, --domains-url string       Domains service URL
  -H, --host-url string          Host URL
  -p, --http-url string          HTTP adapter URL
  -I, --identity string          User identity query parameter
  -i, --insecure                 Do not check for TLS cert
  -v, --invitations-url string   Inivitations URL
  -a, --journal-url string       Journal Log URL
  -l, --limit uint               Limit query parameter (default 10)
  -m, --metadata string          Metadata query parameter
  -n, --name string              Name query parameter
  -o, --offset uint              Offset query parameter
  -r, --raw                      Enables raw output mode for easier parsing of output
  -R, --reader-url string        Reader URL
  -z, --state string             Bootstrap state query parameter
  -S, --status string            User status query parameter
  -t, --things-url string        Things service URL
  -T, --topic string             Subscription topic query parameter
  -u, --users-url string         Users service URL

Use "magistrala-cli bootstrap [command] --help" for more information about a command.
```

## Service

### Get Magistrala services health check

```bash
magistrala-cli health <service>
```

For "boostrap" service, the response should look like this:

```json
{
  "build_time": "2025-02-04_10:04:48",
  "commit": "cff6e7f0858c07fffdeafccf6a73f8a87c7d9e45",
  "description": "boostrap service",
  "status": "pass",
  "version": "v0.15.1"
}
```

[releases]: https://github.com/absmach/magistrala/releases
