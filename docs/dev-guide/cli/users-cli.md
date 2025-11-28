---
title: Users
description: Manage users in Magistrala using the CLI.
keywords:
  - CLI
  - Users
  - Authentication
  - Management
  - Magistrala
  - Accounts
  - Tokens
image: /img/mg-preview.png
---

[Magistrala CLI](./introduction-to-cli.md) provides a simple and efficient way to manage users. Below are the key commands to create, authenticate, and manage users within your system.

### Create User

To create a user using `Magistrala-CLI`, run the following command:

```bash

magistrala-cli users create <first_name> <last_name> <email> <username> <password>

```

This command registers a new user with the provided details.

Example usage:

```bash
 magistrala-cli users create jane doe janicedoe@example.com janicedoe 12345678
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "janicedoe"
  },
  "email": "janicedoe@example.com",
  "first_name": "jane",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "doe",
  "role": "user",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

> ⚠️ **Note:** Ensure that usernames are unique to prevent conflicts.

### Login User

To log in and obtain an access token:

```bash
magistrala-cli users token [<user_email>|<username>] <user_password>
```

Since v0.14.0, Magistrala supports domains. **Domains** are used to separate different tenants, and almost all the activities in Magistrala happen under a particular domain.
Only three major types of actions do not happen within a domain: login where you get to list domains and log in to them, and invitations management to accept domain membership sent by other users as well the creation of new users.
An access token with a domain is required for all the other actions on Clients, Channels, and Groups.

For you to create a domain and obtain a domain id please check [here](./domains-cli.md#create-domain)

Example usage:

```bash
magistrala-cli users token admin 12345678
```

Expected response:

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkyOTQxMjcsImlhdCI6MTczOTI5MDUyNywiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MCwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.Qot3ZoqC1enhAS3YEJY3WJioMAJnr98laBGsJzSgF2Zege5pVqILVLcPZzRBmHdIPys4diAGbqRQQzfW_k_Huw",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkzNzY5MjcsImlhdCI6MTczOTI5MDUyNywiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.EcRH3DUZcplHz-9Ry_90kSQKLwAWXPww9XfMZ9beoEJItpY39g5-n7vnTyLkRhOp6Pw6aZbfuhOL3TWIE-Q13A"
}
```

### Refresh User Token

If the access token has expired, you can obtain a new one using the refresh token:

```bash
magistrala-cli users refreshtoken <refresh_token>
```

Example usage:

```bash
magistrala-cli users refreshtoken eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkzNzY5MjcsImlhdCI6MTczOTI5MDUyNywiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.EcRH3DUZcplHz-9Ry_90kSQKLwAWXPww9XfMZ9beoEJItpY39g5-n7vnTyLkRhOp6Pw6aZbfuhOL3TWIE-Q13A
```

Expected response:

```json
{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkyOTQ2MTQsImlhdCI6MTczOTI5MTAxNCwiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MCwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.MlAUDZYNg2D5Bj9m6IAaXe6wo-U1-q4OpLjrB9TMfg30W1J0ybp2KE_cMfAzMyLUY-Kk_d1e0WYGgIUg7Rgm-Q",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkzNzc0MTQsImlhdCI6MTczOTI5MTAxNCwiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjZjY2FmMTNjLWVmODgtNGNmMi04ZTNhLWM3YzA0YzVlYWY5YiJ9.FQNUwTQPVxas9l1p6ywy7UYO4Dc4rpgbkyMhzPSY20A9JMXFWYh43bxQugu4CsE3eAnp5Zxk9QXxKjmrKIMGiA"
}
```

### Retrieve a Specific User

To get details of a specific user:

```bash
magistrala-cli users <user_id> get <user_auth_token>
```

Example usage:

```bash
 users 8406eafa-eb9b-430a-8ec-869b2e3bc69e get eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9eyJleHAiOjE3NjQzMTg5ODUsImlhdCI6MTc2NDMxNTM4NSwiaXNzIjoic3VwZXJtcS5hdXRoIiwicm9sZSI6MSwic3ViIjoiODQwNmVhZmEtZWI5Yi00MzBhL
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "janicedoe"
  },
  "email": "janicedoe@example.com",
  "first_name": "jane",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "doe",
  "role": "user",
  "status": "enabled",
  "updated_at": "0001-01-01T00:00:00Z"
}
```

### Retrieve All Users

To list all users:

```bash
magistrala-cli users all get <user_token>
```

Example usage:

```bash
magistrala-cli users all get token
```

Expected response:

```json
{
  "limit": 10,
  "offset": 0,
  "total": 2,
  "users": [
    {
      "created_at": "2025-02-11T16:14:03.503217Z",
      "credentials": {
        "username": "admin"
      },
      "email": "admin@example.com",
      "first_name": "super",
      "id": "6ccaf13c-ef88-4cf2-8e3a-c7c04c5eaf9b",
      "last_name": "admin",
      "metadata": {
        "role": "admin"
      },
      "role": "admin",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    },
    {
      "created_at": "2025-02-11T16:15:12.607701Z",
      "credentials": {
        "username": "janicedoe"
      },
      "email": "janicedoe@example.com",
      "first_name": "jane",
      "id": "26ae3198-6060-4308-824c-c846953b9898",
      "last_name": "doe",
      "role": "user",
      "status": "enabled",
      "updated_at": "0001-01-01T00:00:00Z"
    }
  ]
}
```

### Update User Information

Using the update flag can update the user's names, tags, metadata, email as well as username.

#### **Update User Names**

To update a user's names:

```bash
magistrala-cli users <user_id> update '{"first_name":"new first_name", "last_name":"new last_name"}' <user_token>
```

Example usage:

```bash
magistrala-cli users 26ae3198-6060-4308-824c-c846953b9898 update '{"first_name":"Janice", "last_name":"Doe"}' token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "janicedoe"
  },
  "email": "janicedoe@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "role": "user",
  "status": "enabled",
  "updated_at": "2025-02-11T16:34:52.377144Z"
}
```

#### **Update User Metadata**

To update a user's metadata:

```bash
magistrala-cli users <user_id> update '{"metadata":{"value2": "value3"}}' <user_token>
```

Example usage:

```bash
magistrala-cli users 26ae3198-6060-4308-824c-c846953b9898  update '{"metadata":{"aoty": "1"}}'  token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "janicedoe"
  },
  "email": "janicedoe@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "updated_at": "2025-02-11T16:36:56.188559Z"
}
```

#### **Update User Tags**

To update a user's tags:

```bash
magistrala-cli users <user_id> update tags '["tag1", "tag2"]' <user_token>
```

Example usage:

```bash
magistrala-cli users  26ae3198-6060-4308-824c-c846953b9898 update tags '["light 1", "light 2"]' token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "janicedoe"
  },
  "email": "janicedoe@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "tags": ["light 1", "light 2"],
  "updated_at": "2025-02-11T16:44:11.670547Z"
}
```

#### **Update User Email**

To update a user's email:

```bash
magistrala-cli users <user_id> update email <user_email> <user_token>
```

Example usage:

```bash
magistrala-cli users 26ae3198-6060-4308-824c-c846953b9898 update email Janice@example.com  token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "janicedoe"
  },
  "email": "Janice@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "tags": ["lemonade", "renaissance"],
  "updated_at": "2025-02-11T16:45:36.288667Z"
}
```

#### **Update Username**

To update a user's username:

```bash
magistrala-cli users <user_id> update username <new_username> <user_token>
```

Example usage:

```bash
magistrala-cli users  26ae3198-6060-4308-824c-c846953b9898 update username Janice  token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "Janice"
  },
  "email": "Janice@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "tags": ["lemonade", "renaissance"],
  "updated_at": "2025-02-11T16:46:55.951208Z"
}
```

### Update User Password

To update a user's password:

```bash
magistrala-cli users password <old_password> <password> <user_token>
```

Example usage:

```bash
magistrala-cli users password 12345678 123456789 token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "Janice"
  },
  "email": "Janice@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "tags": ["lemonade", "renaissance"],
  "updated_at": "2025-02-11T17:12:50.101988Z"
}
```

### Reset User Password Request

To send a request to reset a user's password:

```bash
magistrala-cli users resetpasswordrequest <email>
```

### Reset User Password

To reset a user's password:

```bash
magistrala-cli users resetpassword <password> <confpass> <password_request_token>
```

### Enable User

To enable a user's status:

```bash
magistrala-cli users <user_id> enable <user_auth_token>
```

Example usage:

```bash
magistrala-cli users 26ae3198-6060-4308-824c-c846953b9898 enable token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "Janice"
  },
  "email": "Janice@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "tags": ["lemonade", "renaissance"],
  "updated_at": "2025-02-11T17:16:50.323734Z"
}
```

### Disable User

To disable a user:

```bash
magistrala-cli users <user_id> disable <user_auth_token>
```

Example usage:

```bash
magistrala-cli users 26ae3198-6060-4308-824c-c846953b9898 disable token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "Janice"
  },
  "email": "Janice@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "disabled",
  "tags": ["lemonade", "renaissance"],
  "updated_at": "2025-02-11T17:15:17.096604Z"
}
```

### Delete User

To delete a user:

```bash
magistrala-cli users <user_id> delete <user_auth_token>
```

Example usage:

```bash
magistrala-cli users 28a8be12-f3eb-4917-851b-30bf04ea04a0 delete token
```

This will return an `OK` response.

### Get Profile of the User

To get the profile details of the currently authenticated user:

```bash
magistrala-cli users profile <user_token>
```

Example usage:

```bash
magistrala-cli users profile token
```

Expected response:

```json
{
  "created_at": "2025-02-11T16:15:12.607701Z",
  "credentials": {
    "username": "Janice"
  },
  "email": "Janice@example.com",
  "first_name": "Janice",
  "id": "26ae3198-6060-4308-824c-c846953b9898",
  "last_name": "Doe",
  "metadata": {
    "aoty": "1"
  },
  "role": "user",
  "status": "enabled",
  "tags": ["lemonade", "renaissance"],
  "updated_at": "2025-02-11T17:16:50.323734Z"
}
```

### Search User

To search for a specific user using queries:

```bash
magistrala-cli users search <query> <user_token>
```
