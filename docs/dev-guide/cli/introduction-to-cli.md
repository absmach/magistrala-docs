---
title: Introduction
description: Get started with Magistrala CLI to manage users, clients, channels and messages directly from your terminal or Docker.
keywords:
  - CLI
  - Command Line
  - Magistrala
  - Users
  - Clients
  - Channels
  - Messages
  - Automation
image: /img/mg-preview.png
---

The **Magistrala CLI** provides a powerful command-line interface for managing users, clients, channels, domains, and messages without relying on the web UI.  
It can be installed as a standalone binary, built from source, or run via Docker.

## Installation

### Option 1 — Download Latest Release

The latest tagged version of **magistrala-cli** is available for download from the Magistrala releases page:

[Download the latest Magistrala CLI release](https://github.com/absmach/magistrala/releases)

When a new version of Magistrala is released, a new `magistrala-cli` binary will also be available under the release assets.

### Option 2 — Build from Source

Alternatively, **magistrala-cli** can be built directly from source.

1. Clone the Magistrala repository.

  ```bash
   git clone https://github.com/absmach/magistrala.git
   cd magistrala
  ```

2. Build the CLI binary using the provided Makefile.

  ```bash
  make cli
  ```

  This command will compile the CLI and place the executable in the `./build` directory.

3. Optionally install it system-wide by copying it to `/usr/local/bin/` for global access from any terminal.

  ```bash
  sudo cp ./build/cli /usr/local/bin/mg
  ```

> *Tip:* Running `make cli` automatically checks for an existing binary and rebuilds only if necessary.

### **Option 3 — Run via Docker**

The CLI can also be executed through the official **`magistrala/cli`** Docker image:

```bash
docker run -it --rm magistrala/cli -u http://<SERVER_URL> [command]
```

**For Example:**

```bash
docker run -it --rm magistrala/cli -u http://192.168.160.1 users token admin@example.com 12345678
```

The response should be:

```bash
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
}
```

This allows direct interaction with Magistrala services without installing the binary locally.

**Example:**  
Run `magistrala/cli` and connect it to a running Magistrala instance using the `-u` flag to specify the server URL.  
The CLI will return authentication tokens or perform other operations as requested.

## Usage

Running the CLI without arguments displays the list of available commands:

```bash
magistrala-cli --help
```

**Example Output:**

```bash
Usage:
  magistrala-cli [command]

Available Commands:
  bootstrap    Bootstrap management
  certs        Certificates management
  channels     Channels management
  clients      Clients management
  completion   Generate the autocompletion script for the specified shell
  config       CLI local config
  domains      Domains management
  groups       Groups management
  health       Health Check
  help         Help about any command
  invitations  Invitations management
  journal      journal log
  messages     Send messages
  provision    Provision clients and channels from a config file
  subscription Subscription management
  users        Users management

Flags:
  -b, --bootstrap-url string   Bootstrap service URL
  -s, --certs-url string       Certs service URL
  -t, --clients-url string     Clients service URL
  -c, --config string          Config path
  -C, --contact string         Subscription contact query parameter
  -y, --content-type string    Message content type (default "application/senml+json")
  -x, --curl                   Convert HTTP request to cURL command
  -d, --domains-url string     Domains service URL
  -h, --help                   help for magistrala-cli
  -H, --host-url string        Host URL
  -p, --http-url string        HTTP adapter URL
  -I, --identity string        User identity query parameter
  -i, --insecure               Do not check for TLS cert
  -a, --journal-url string     Journal Log URL
  -l, --limit uint             Limit query parameter (default 10)
  -m, --metadata string        Metadata query parameter
  -n, --name string            Name query parameter
  -o, --offset uint            Offset query parameter
  -r, --raw                    Enables raw output mode for easier parsing of output
  -R, --reader-url string      Reader URL
  -z, --state string           Bootstrap state query parameter
  -S, --status string          User status query parameter
  -T, --topic string           Subscription topic query parameter
  -u, --users-url string       Users service URL

Use "magistrala-cli [command] --help" for more information about a command.
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
  -b, --bootstrap-url string   Bootstrap service URL
  -s, --certs-url string       Certs service URL
  -t, --clients-url string     Clients service URL
  -c, --config string          Config path
  -C, --contact string         Subscription contact query parameter
  -y, --content-type string    Message content type (default "application/senml+json")
  -x, --curl                   Convert HTTP request to cURL command
  -d, --domains-url string     Domains service URL
  -H, --host-url string        Host URL
  -p, --http-url string        HTTP adapter URL
  -I, --identity string        User identity query parameter
  -i, --insecure               Do not check for TLS cert
  -a, --journal-url string     Journal Log URL
  -l, --limit uint             Limit query parameter (default 10)
  -m, --metadata string        Metadata query parameter
  -n, --name string            Name query parameter
  -o, --offset uint            Offset query parameter
  -r, --raw                    Enables raw output mode for easier parsing of output
  -R, --reader-url string      Reader URL
  -z, --state string           Bootstrap state query parameter
  -S, --status string          User status query parameter
  -T, --topic string           Subscription topic query parameter
  -u, --users-url string       Users service URL

Use "magistrala-cli bootstrap [command] --help" for more information about a command.
```

## Service

### Get Magistrala services health check

```bash
magistrala-cli health <service>
```

For "users" service, the response should look like this:

```json
{
  "build_time": "2025-10-24_15:59:36",
  "commit": "dc0df1c9558fe61d98cd477b312af6aa1bea2bbf",
  "description": "users service",
  "status": "pass",
  "version": "v0.18.1"
}
```

## Updating the CLI

When Magistrala is updated, a new Docker image of **`magistrala-cli`** is also published.  
Developers can update the CLI by either:

- Pulling the latest Docker image (`magistrala/cli:latest`), or

```bash
docker pull magistrala/cli:latest
```

- Downloading the newest binary from the [**Magistrala releases page**][releases].

[releases]: https://github.com/absmach/magistrala/releases
