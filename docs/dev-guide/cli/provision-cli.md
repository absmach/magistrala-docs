---
title: Provision
---


Magistrala CLI provides provision commands to quickly set up clients, channels, and their connections. This guide covers bulk creation processes and a test setup for rapid development.

### Provision Clients

Bulk create multiple clients by providing a configuration file (JSON or CSV format) along with the required domain ID and user authentication token.

```bash
magistrala-cli provision clients <clients_file> <domain_id> <user_token>
```

### Provision Channels

Bulk create channels using a configuration file with the domain ID and user token.

```bash
magistrala-cli provision channels <channels_file> <domain_id> <user_token>
```

### Provision Connections

Connect clients to channels in bulk using a connections file. This allows easy management of large IoT setups.

```bash
magistrala-cli provision connect <connections_file> <domain_id> <user_token>
```

## Quick Test Setup

The `test` command provisions a simple test environment, including:

- **One test user**
- **Two clients**
- **Two channels**

The setup connects:

- Both clients to one channel
- One client to the second channel

Additionally, it sends test messages to verify connectivity.

> 🔍 **Note:** This is ideal for quick validations in development environments.

```bash
magistrala-cli provision test
```

> ℹ️ For more details on provisioning commands, run:
magistrala-cli provision --help
