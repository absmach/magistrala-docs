---
title: Consumers
---


Magistrala CLI provides a simple and efficient way to manage subscriptions within your system. This guide covers the key commands for **creating**, **retrieving**, and **deleting subscriptions**.

### Create Subscription

To create a new subscription:

```bash
magistrala-cli consumers create <topic> <contact> <user_auth_token>
```

> ⚠️ **Note:** Ensure the topic and contact are valid for successful subscription creation.

### Retrieve Subscription Information

#### **Get Subscription**

To fetch the details of a specific subscription using its unique ID:

```bash
magistrala-cli consumers get <sub_id> <user_auth_token>
```

#### **Get All Subscriptions**

To retrieve a list of all existing subscriptions associated with the authenticated user.

```bash
magistrala-cli consumers get all
```

### Remove Subscription

To delete an existing subscription:

```bash
magistrala-cli consumers remove <sub_id> <user_auth_token>
```

> ℹ️ For more details, run:
magistrala-cli subscription --help
