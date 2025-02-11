---
title: Users
---


Magistrala CLI provides a simple and efficient way to manage users. Below are the key commands to create, authenticate, and manage users within your system.

### Create User

To create a user using `Magistrala-CLI`, run the following command:

```bash

magistrala-cli users create <first_name> <last_name> <email> <username> <password>

```

This command registers a new user with the provided details.

Example usage:

```bash
 magistrala-cli users create jane doe janedoe@example.com janedoe 12345678 
```

Expected response:

```json
{
  "created_at": "2025-02-11T00:25:52.252742Z",
  "credentials": {
    "username": "janedoe"
  },
  "email": "janedoe@example.com",
  "first_name": "jane",
  "id": "32632742-87e8-4ce1-b8ef-ace23b3683aa",
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
To authenticate within a specific domain, use:

```bash
magistrala-cli users token <user_email> <user_password> <domain_id>
```

Example usage:

Expected response:

### Refresh User Token

If the access token has expired, you can obtain a new one using the refresh token:

```bash
magistrala-cli users refreshtoken <refresh_token>
```

Example usage:

Expected response:

### Retrieve a Specific User

To get details of a specific user:

```bash
magistrala-cli users get <user_id> <user_token>
```

Example usage:

Expected response:

### Retrieve All Users

To list all users:

```bash
magistrala-cli users get all <user_token>
```

Example usage:

Expected response:

### Update User Information

Using the update flag can update the user's names, tags, metadata, email as well as username.

#### **Update User Names**

To update a user's names:

```bash
magistrala-cli users update <user_id> '{"first_name":"new first_name", "last_name":"new last_name"}' <user_token>
```

Example usage:

Expected response:

#### **Update User Metadata**

To update a user's metadata:

```bash
magistrala-cli users update <user_id> '{"metadata":{"value2": "value3"}}' <user_token>
```

Example usage:

Expected response:

#### **Update User Tags**

To update a user's tags:

```bash
magistrala-cli users update tags <user_id> '["tag1", "tag2"]' <user_token>
```

Example usage:

Expected response:

#### **Update User Email**

To update a user's email:

```bash
magistrala-cli users update email <user_id> <user_email> <user_token>
```

Example usage:

Expected response:

#### **Update Username**

To update a user's username:

```bash
magistrala-cli users update username <user_id> <new_username> <user_token>
```

Example usage:

Expected response:

#### **Update Profile Picture**

To update the user's profile-picture string `URL`:

```bash
magistrala-cli users update <user_id> <new_pictrure_url> <user_token>
```

Example usage:

Expected response:

### Update User Password

To update a user's password:

```bash
magistrala-cli users password <old_password> <password> <user_token>
```

Example usage:

Expected response:

### Reset User Password Request

To send a request to reset a user's password:

```bash
magistrala-cli users resetpasswordrequest <email>
```

Example usage:

Expected response:

### Reset User Password

To reset a user's password:

```bash
magistrala-cli users resetpassword <password> <confpass> <password_request_token>
```

Example usage:

Expected response:

### Enable User

To enable a user's status:

```bash
magistrala-cli users enable <user_id> <user_token>
```

Example usage:

Expected response:

### Disable User

To disable a user:

```bash
magistrala-cli users disable <user_id> <user_token>
```

Example usage:

Expected response:

### Delete User

To delete a user:

```bash
magistrala-cli users delete <user_id> <user_token>
```

Example usage:

Expected response:

### Get Profile of the User

To get the profile details of the currently authenticated user:

```bash
magistrala-cli users profile <user_token>
```

Example usage:

Expected response:

### Search User

To search for a specific user using queries:

```bash
magistrala-cli users search <query> <user_token>
```

Example usage:

Expected response:
