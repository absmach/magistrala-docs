---
title: Groups
description: Manage groups in Magistrala using the CLI.
keywords:
  - CLI
  - Groups
  - Management
  - Magistrala
  - Entities
  - Members
  - Enable
  - Disable
image: /img/mg-preview.png
---

[Magistrala CLI](./introduction-to-cli.md) provides an efficient way to manage groups within your system. This guide covers the key commands for **creating**, **retrieving**, **updating**, and **managing groups**.

## Group Management

### Create Group

To create a new group, run the following command:

```bash
magistrala-cli groups  '{"name":"<group_name>","description":"<description>","metadata":"<metadata>"}' create  <domain_id> <user_token>
```

This command registers a new group with the provided details.

Example usage:

```bash
magistrala-cli groups '{"name":"group 1"}'  create 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected response:

```json
{
  "created_at": "2025-02-12T09:48:21.886997Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "a90eced3-daaa-4f51-a031-0103ff00e746",
  "level": 1,
  "name": "group 1",
  "path": "a90eced3-daaa-4f51-a031-0103ff00e746",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Retrieve a Specific Group

To get the details of group:

```bash
magistrala-cli groups <group_id> get <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups  8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 get e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "created_at": "2025-11-28T10:09:25.807353Z",
  "domain_id": "e45f002b-8e55-4264-be27-deaf2643b055",
  "id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
  "name": "group 1",
  "path": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Retrieve all Groups

To list all groups:

```bash
magistrala-cli groups all get <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups all get  e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "groups": [
    {
      "access_type": "direct",
      "actions": [
        "update",
        "read",
        "membership",
        "delete",
        "set_child",
        "set_parent",
        "manage_role",
        "add_role_users",
        "remove_role_users",
        "view_role_users",
        "client_create",
        "channel_create",
        "subgroup_create",
        "subgroup_client_create",
        "subgroup_channel_create",
        "client_update",
        "client_read",
        "client_delete",
        "client_set_parent_group",
        "client_connect_to_channel",
        "client_manage_role",
        "client_add_role_users",
        "client_remove_role_users",
        "client_view_role_users",
        "channel_update",
        "channel_read",
        "channel_delete",
        "channel_set_parent_group",
        "channel_connect_to_client",
        "channel_publish",
        "channel_subscribe",
        "channel_manage_role",
        "channel_add_role_users",
        "channel_remove_role_users",
        "channel_view_role_users",
        "subgroup_update",
        "subgroup_read",
        "subgroup_membership",
        "subgroup_delete",
        "subgroup_set_child",
        "subgroup_set_parent",
        "subgroup_manage_role",
        "subgroup_add_role_users",
        "subgroup_remove_role_users",
        "subgroup_view_role_users",
        "subgroup_client_update",
        "subgroup_client_read",
        "subgroup_client_delete",
        "subgroup_client_set_parent_group",
        "subgroup_client_connect_to_channel",
        "subgroup_client_manage_role",
        "subgroup_client_add_role_users",
        "subgroup_client_remove_role_users",
        "subgroup_client_view_role_users",
        "subgroup_channel_update",
        "subgroup_channel_read",
        "subgroup_channel_delete",
        "subgroup_channel_set_parent_group",
        "subgroup_channel_connect_to_client",
        "subgroup_channel_publish",
        "subgroup_channel_subscribe",
        "subgroup_channel_manage_role",
        "subgroup_channel_add_role_users",
        "subgroup_channel_remove_role_users",
        "subgroup_channel_view_role_users"
      ],
      "created_at": "2025-11-28T10:09:25.807353Z",
      "domain_id": "e45f002b-8e55-4264-be27-deaf2643b055",
      "id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
      "name": "group 1",
      "path": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
      "role_id": "group_Z737oMrW1Wwu6Vr18E5Amggm",
      "role_name": "admin",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ],
  "limit": 10,
  "offset": 0,
  "total": 1
}
```

### Update Group Information

To update a group's details:

```bash
magistrala-cli groups <group_id> update '{name":"<group_name>","description":"<description>","metadata":"<metadata>"}' <domain_id>  <user_token>
```

This command allows you to modify the group name, description, and metadata.

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 update '{"name":"Group duo"}' e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "created_at": "2025-11-28T10:09:25.807353Z",
  "domain_id": "e45f002b-8e55-4264-be27-deaf2643b055",
  "id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
  "name": "Group duo",
  "status": "enabled",
  "updated_at": "2025-11-28T11:28:36.335419Z",
  "updated_by": "8406eafa-eb9b-430a-8ec0-869b2e3bc69e"
}
```

### Enable Group

To change group status to enabled:

```bash
magistrala-cli  groups <group_id> enable <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups a90eced3-daaa-4f51-a031-0103ff00e746 enable 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected response:

```json
{
  "created_at": "2025-02-12T09:48:21.886997Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "a90eced3-daaa-4f51-a031-0103ff00e746",
  "name": "group 1",
  "status": "enabled",
  "updated_at": "2025-02-12T10:08:37.864362Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Disable Group

To change group status to disabled:

```bash
magistrala-cli  groups <group_id> disable <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups a90eced3-daaa-4f51-a031-0103ff00e746 disable 9879f314-8b0a-4a11-b157-8523491ffa81 token
```

Expected response:

```json
{
  "created_at": "2025-02-12T09:48:21.886997Z",
  "domain_id": "9879f314-8b0a-4a11-b157-8523491ffa81",
  "id": "a90eced3-daaa-4f51-a031-0103ff00e746",
  "name": "group 1",
  "status": "disabled",
  "updated_at": "2025-02-12T10:07:04.741721Z",
  "updated_by": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b"
}
```

### Delete Group

To delete a group from the system:

```bash
magistrala-cli groups <group_id> delete <domain_id> <user_auth_token>
```

### Create Group Role

To create a new role within a group:

```bash
magistrala-cli groups <group_id> roles create <JSON_role> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles create '{"role_name":"editor","description":"Editor role with modify permissions"}' e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "created_at": "2025-11-28T12:23:44.64544705Z",
  "created_by": "8406eafa-eb9b-430a-8ec0-869b2e3bc69e",
  "entity_id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
  "id": "group_fm8nUmKZOjuPknUQNm8QxDQa",
  "name": "editor",
  "updated_at": "0001-01-01T00:00:00Z",
  "updated_by": ""
}
```

### Get Group Role

To retrieve a specific role or all roles in a group:

```bash
magistrala-cli groups <group_id> roles get <role_id|all> <domain_id> <user_auth_token>
```

Example usage (specific role):

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles get group_fm8nUmKZOjuPknUQNm8QxDQa e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "id": "group_fm8nUmKZOjuPknUQNm8QxDQa",
  "name": "editor",
  "entity_id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
  "created_at": "2025-11-28T12:23:44.64544705Z",
  "created_by": "8406eafa-eb9b-430a-8ec0-869b2e3bc69e"
}
```

Example usage (all roles):

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles get all e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "total": 2,
  "roles": [
    {
      "id": "group_fm8nUmKZOjuPknUQNm8QxDQa",
      "name": "editor",
      "entity_id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86"
    },
    {
      "id": "group_abc123xyz789",
      "name": "viewer",
      "entity_id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86"
    }
  ]
}
```

### Update Group Role

To update a role's name:

```bash
magistrala-cli groups <group_id> roles update <role_id> <new_name> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles update group_fm8nUmKZOjuPknUQNm8QxDQa "senior-editor" e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "id": "group_fm8nUmKZOjuPknUQNm8QxDQa",
  "name": "senior-editor",
  "entity_id": "8a69f06c-99a6-4b06-bf42-9fe5da5b9b86",
  "created_at": "2025-11-28T12:23:44.64544705Z",
  "updated_at": "2025-11-28T13:15:30.123456Z",
  "updated_by": "8406eafa-eb9b-430a-8ec0-869b2e3bc69e"
}
```

### Delete Group Role

To delete a role from a group:

```bash
magistrala-cli groups <group_id> roles delete <role_id> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles delete group_fm8nUmKZOjuPknUQNm8QxDQa e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "deleted": true,
  "id": "group_fm8nUmKZOjuPknUQNm8QxDQa"
}
```

## Group Role Actions Operations

### Add Role Actions

To add actions/permissions to a role:

```bash
magistrala-cli groups <group_id> roles actions add <role_id> <JSON_actions> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles actions add group_fm8nUmKZOjuPknUQNm8QxDQa '{"actions":["read","write","delete"]}' e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
{
  "role_id": "group_fm8nUmKZOjuPknUQNm8QxDQa",
  "actions": ["read", "write", "delete"],
  "added_at": "2025-11-28T13:20:15.456789Z"
}
```

### List Role Actions

To list all actions assigned to a role:

```bash
magistrala-cli groups <group_id> roles actions list <role_id> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles actions list group_fm8nUmKZOjuPknUQNm8QxDQa e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
["read"]
```

### Delete Role Actions

To delete specific actions or all actions from a role:

```bash
magistrala-cli groups <group_id> roles actions delete <role_id> <JSON_actions|all> <domain_id> <user_auth_token>
```

Example usage (specific actions):

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles actions delete group_fm8nUmKZOjuPknUQNm8QxDQa '{"actions":["update"]}' e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```bash
ok
```

Example usage (all actions):

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles actions delete group_fm8nUmKZOjuPknUQNm8QxDQa all e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```bash
ok
```

### List Available Actions

To list all available actions that can be assigned to roles:

```bash
magistrala-cli groups <group_id> roles actions available-actions <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups group_fm8nUmKZOjuPknUQNm8QxDQa roles actions available-actions e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

```json
[
  "update",
  "read",
  "membership",
  "delete",
  "set_child",
  "set_parent",
  "manage_role",
  "add_role_users",
  "remove_role_users",
  "view_role_users",
  "client_create",
  "channel_create",
  "subgroup_create",
  "subgroup_client_create",
  "subgroup_channel_create",
  "client_update",
  "client_read",
  "client_delete",
  "client_set_parent_group",
  "client_connect_to_channel",
  "client_manage_role",
  "client_add_role_users",
  "client_remove_role_users",
  "client_view_role_users",
  "channel_update",
  "channel_read",
  "channel_delete",
  "channel_set_parent_group",
  "channel_connect_to_client",
  "channel_publish",
  "channel_subscribe",
  "channel_manage_role",
  "channel_add_role_users",
  "channel_remove_role_users",
  "channel_view_role_users",
  "subgroup_update",
  "subgroup_read",
  "subgroup_membership",
  "subgroup_delete",
  "subgroup_set_child",
  "subgroup_set_parent",
  "subgroup_manage_role",
  "subgroup_add_role_users",
  "subgroup_remove_role_users",
  "subgroup_view_role_users",
  "subgroup_client_update",
  "subgroup_client_read",
  "subgroup_client_delete",
  "subgroup_client_set_parent_group",
  "subgroup_client_connect_to_channel",
  "subgroup_client_manage_role",
  "subgroup_client_add_role_users",
  "subgroup_client_remove_role_users",
  "subgroup_client_view_role_users",
  "subgroup_channel_update",
  "subgroup_channel_read",
  "subgroup_channel_delete",
  "subgroup_channel_set_parent_group",
  "subgroup_channel_connect_to_client",
  "subgroup_channel_publish",
  "subgroup_channel_subscribe",
  "subgroup_channel_manage_role",
  "subgroup_channel_add_role_users",
  "subgroup_channel_remove_role_users",
  "subgroup_channel_view_role_users"
]
```

## Add Members to Domain Role

To add members (users) to a domain role:

```bash
magistrala-cli domains <domain_id> roles members add <role_id> <JSON_members> <user_auth_token>
```

Example usage:

```bash
magistrala-cli domains e45f002b-8e55-4264-be27-deaf2643b055 roles members add domain_9SfeIxEalY7HUx7EknD1bGci '{"members":["1e4b7a26-25f2-4040-8c75-04fe52381e87"]}' token
```

Expected response:

```json
["1e4b7a26-25f2-4040-8c75-04fe52381e87"]
```

### Adding Multiple Members

To add multiple users to a role at once:

```bash
magistrala-cli domains e45f002b-8e55-4264-be27-deaf2643b055 roles members add domain_9SfeIxEalY7HUx7EknD1bGci '{"members":["1e4b7a26-25f2-4040-8c75-04fe52381e87","8406eafa-eb9b-430a-8ec0-869b2e3bc69e"]}' token
```

Expected response:

```json
["1e4b7a26-25f2-4040-8c75-04fe52381e87", "8406eafa-eb9b-430a-8ec0-869b2e3bc69e"]
```

### List Role Members

To list all members assigned to a role:

```bash
magistrala-cli groups <group_id> roles members list <role_id> <domain_id> <user_auth_token>
```

Example usage:

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles members list group_fm8nUmKZOjuPknUQNm8QxDQa e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

### Delete Role Members

To remove specific members or all members from a role:

```bash
magistrala-cli groups <group_id> roles members delete <role_id> <JSON_members|all> <domain_id> <user_auth_token>
```

Example usage (specific members):

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles members delete group_fm8nUmKZOjuPknUQNm8QxDQa '{"members":["8406eafa-eb9b-430a-8ec0-869b2e3bc69e"]}' e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:

Example usage (all members):

```bash
magistrala-cli groups 8a69f06c-99a6-4b06-bf42-9fe5da5b9b86 roles members delete group_fm8nUmKZOjuPknUQNm8QxDQa all e45f002b-8e55-4264-be27-deaf2643b055 token
```

Expected response:
