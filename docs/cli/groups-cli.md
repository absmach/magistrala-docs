---
title: Groups
---


Magistrala CLI provides an efficient way to manage groups within your system. This guide covers the key commands for **creating**, **retrieving**, **updating**, and **managing groups**.

## Group Management

### Create Group

To create a new group, run the following command:

```bash
magistrala-cli groups create '{"name":"<group_name>","description":"<description>","metadata":"<metadata>"}' <domain_id> <user_token>
```

This command registers a new group with the provided details.

Example usage:

Expected response:

### Retrieve a Specific Group

To get the details of group:

```bash
magistrala-cli groups get <group_id> <user_token>
```

Example usage:

Expected response:

### Retrieve all Groups

To list all groups:

```bash
magistrala-cli groups get all <user_token>
```

Example usage:

Expected response:

### Update Group Information

To update a group's details:

```bash
magistrala-cli groups update '{"id":"<group_id>","name":"<group_name>","description":"<description>","metadata":"<metadata>"}' <domain_id>  <user_token>
```

This command allows you to modify the group name, description, and metadata.

Example usage:

Expected response:

### Enable Group

To change group status to enabled:

```bash
magistrala-cli groups enable <group_id> <domain_id> <user_token>
```

Example usage:

Expected response:

### Disable Group

To change group status to disabled:

```bash
magistrala-cli groups disable <group_id> <domain_id> <user_token>
```

Example usage:

Expected response:

### Delete Group

To delete a group from the system:

```bash
magistrala-cli groups delete <group_id> <domain_id> <user_token>
```

Example usage:

Expected response:

### Get Group Members

```bash
magistrala-cli groups members <group_id> <user_token>
```

Example usage:

Expected response:

### Get Memberships

```bash
magistrala-cli groups membership <member_id> <user_token>
```

Example usage:

Expected response:

### Assign Members to Group

```bash
magistrala-cli groups assign <member_ids> <member_type> <group_id> <user_token>
```

Example usage:

Expected response:

### Unassign Members to Group

```bash
magistrala-cli groups unassign <member_ids> <group_id>  <user_token>
```

Example usage:

Expected response:
