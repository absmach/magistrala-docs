---
title: API
---

## Reference

API reference in the Swagger UI can be found at: [https://api.magistrala.abstractmachines.fr][api]

## Users

### Create User

To start working with the Magistrala system, you need to create a user account.

This function registers a new user account with a unique email and username.

> The user's names, email and username must all be unique.

```bash
curl -X POST http://localhost:9002/users \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '{
  "first_name": "<first_name>",
  "last_name": "<last_name>",
  "email": "<email>",
  "tags": ["tag1", "tag2"],
  "credentials": {
    "username": "<username>",
    "secret": "<password>"
  },
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  },
  "profile_picture": "<profile_picture_url>",
  "status": "enabled"
}'
```

**Example Usage:**

```bash
curl -X POST http://localhost:9002/users \
-H "Content-Type: application/json" \
-d '{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com",
  "tags": ["developer", "backend"],
  "credentials": {
    "username": "janedoe",
    "secret": "securepassword"
  },
  "metadata": {
    "location": "Paris"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled"
}'

```

**Expected Create User Response:**

```json
{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["developer", "backend"],
  "metadata": {
    "location": "Paris"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "created_at": "2025-02-11T16:15:12Z",
  "updated_at": "2025-02-11T16:15:12Z"
}
```

### Create Token

To log in to the Magistrala system, you need to create a `user_token`.

```bash
curl -sSiX POST http://localhost/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "<user_name> | <useramen>",
  "secret": "<user_secret>"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/users/tokens/issue -H "Content-Type: application/json" -d @- << EOF
{
  "identity": "john.doe@email.com",
  "secret": "12345678"
}
EOF

HTTP/2 201
server: nginx/1.25.4
date: Thu, 13 Feb 2025 21:30:06 GMT
content-type: application/json
content-length: 583
access-control-expose-headers: Location
Access-Control-Expose-Headers: Location

{"access_token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk0ODU4MDYsImlhdCI6MTczOTQ4MjIwNiwiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MCwidXNlciI6IjBkNDA5NDgyLTA3MzctNDVlYS04Mjg0LTViZDg4MDU5ZjYyNSJ9.nFeihdM7KQJKr_2WQaKUFqBGWVw1qfjh0N6Uc5C6UXc2ugtm4LCf0sjDawi9ok_szk0fQeWWX8bqOsnEvhobZA","refresh_token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk1Njg2MDYsImlhdCI6MTczOTQ4MjIwNiwiaXNzIjoic3VwZXJtcS5hdXRoIiwidHlwZSI6MSwidXNlciI6IjBkNDA5NDgyLTA3MzctNDVlYS04Mjg0LTViZDg4MDU5ZjYyNSJ9.DbaMpgVPtL7ER5wlsFmVtC3izKgjB66qsl1beT0qnlcWcfp7NQyvBtT0EW3OyibcqG56SnqO0ye1mzaJLgViqg"}
```

### Refresh Token

To issue another `access_token` after getting expired, you need to use a `refresh_token`.

```bash
curl -sSiX POST http://localhost/users/tokens/refresh -H "Content-Type: application/json" -H "Authorization: Bearer <refresh_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/users/tokens/refresh -H "Content-Type: application/json" -H "Authorization: Bearer <refresh_token>"

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:49:45 GMT
Content-Type: application/json
Content-Length: 709
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "access_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY3NTE0ODUsImlhdCI6MTY4Njc1MDU4NSwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI5NDkzOTE1OS1kMTI5LTRmMTctOWU0ZS1jYzJkNjE1NTM5ZDciLCJ0eXBlIjoiYWNjZXNzIn0.zZcUH12x7Tlnecrc3AAFnu3xbW4wAOGifWZMnba2EnhosHWDuSN4N7s2S7OxPOrBGAG_daKvkA65mi5n1sxi9A",
  "refresh_token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODY4MzY5ODUsImlhdCI6MTY4Njc1MDU4NSwiaWRlbnRpdHkiOiJqb2huLmRvZUBlbWFpbC5jb20iLCJpc3MiOiJjbGllbnRzLmF1dGgiLCJzdWIiOiI5NDkzOTE1OS1kMTI5LTRmMTctOWU0ZS1jYzJkNjE1NTM5ZDciLCJ0eXBlIjoicmVmcmVzaCJ9.AjxJ5xlUUSjW99ECUAU19ONeCs8WlRl52Ost2qGTADxHGYBjPMqctruyoTYJbdORtL5f2RTxZsnLX_1vLKRY2A",
  "access_type": "Bearer"
}
```

### Get User Profile

You can always check the user profile that is logged-in by using the `user_token`.

```bash
curl -sSiX GET http://localhost/users/profile -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users/profile -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:51:59 GMT
Content-Type: application/json
Content-Length: 312
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["developer", "backend"],
  "metadata": {
    "location": "Paris"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "created_at": "2025-02-11T16:15:12Z",
  "updated_at": "2025-02-11T16:15:12Z"
}
```

### Get User

You can always check the user entity by entering the user ID and `user_token`.

```bash
curl -sSiX GET http://localhost/users/<user_id> -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281  -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:51:59 GMT
Content-Type: application/json
Content-Length: 312
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["developer", "backend"],
  "metadata": {
    "location": "Paris"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "created_at": "2025-02-11T16:15:12Z",
  "updated_at": "2025-02-11T16:15:12Z"
}

```

### Get Users

You can get all users in the database by querying `/users` endpoint.

```bash
curl -sSiX GET http://localhost/users -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:52:36 GMT
Content-Type: application/json
Content-Length: 285
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 5,
  "offset": 0,
  "total": 2,
  "users": [
    {
      "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "janedoe@example.com",
      "credentials": {
        "username": "janedoe"
      },
      "status": "enabled"
    },
    {
      "id": "c1adf32-3dac-4aad-bead-ae96fe071239",
      "first_name": "John",
      "last_name": "Smith",
      "email": "johnsmith@example.com",
      "credentials": {
        "username": "johnsmith"
      },
      "status": "disabled"
    }
  ]
}
```

If you want to paginate your results then use `offset`, `limit`, `metadata`, `last_name`,`first_name`, `email`, `tag`, `status` and `visbility` as query parameters.

```bash
curl -sSiX GET http://localhost/users?[offset=<offset>]&[limit=<limit>]&[identity=<identity>]&[name=<name>]&[tag=<tag>]&[status=<status>]&[visibility=<visibility>] -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users?offset=0&limit=5&email=janedoe@example.com -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:53:16 GMT
Content-Type: application/json
Content-Length: 284
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 5,
  "total": 1,
  "users": [
    ers": [
    {
      "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "janedoe@example.com",
      "credentials": {
        "username": "janedoe"
      },
      "status": "enabled"
    },
  ]
}
```

### Update User

Updating user's names and/or metadata

```bash
curl -sSiX PATCH http://localhost/users/<user_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "first_name": "<new_first_name>",
  "last_name": "<new_last_name>",
  "metadata": {
    "key": "value"
  }
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281 -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "first_name": "Janet",
  "last_name": "Doyle",
  "metadata": {
    "location": "Lyon"
  }
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:54:40 GMT
Content-Type: application/json
Content-Length: 354
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "janedoe@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["developer", "backend"],
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "updated_at": "2025-02-11T18:00:12Z"
}

```

### Update User Tags

Updating user's tags

```bash
curl -sSiX PATCH http://localhost/users/<user_id>/tags -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "tags": [
    "[tag_1]",
    ...
    "[tag_N]"
  ]
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/tags -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "tags": ["backend", "golang"]
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:55:18 GMT
Content-Type: application/json
Content-Length: 375
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "janedoe@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["backend", "golang"],
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "updated_at": "2025-02-11T18:00:12Z"
}
```

### Update User Profile Picture

Updates the profile picture URL of a user.

```bash
curl -X PATCH http://localhost:9002/users/<user_id>/picture \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '{
  "profile_picture": "<picture_url>"
}'
EOF
```

For example:

```bash
curl -X PATCH http://localhost:9002/users/b7edb32-2eac-4aad-aebe-ed96fe073879/picture \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "profile_picture": "https://example.com/newpic.jpg"
}'

EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:59:53 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "janedoe@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["backend", "golang"],
  "profile_picture": "https://example.com/newpic.jpg",
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "updated_at": "2025-02-11T18:00:12Z"
}
```

### Update User Email

Updating user's email

```bash
curl -sSiX PATCH http://localhost/users/<user_id>/email -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "email": "<user_email>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/email -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "email": "newemail@example.com"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:59:53 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "newemail@example.com",
  "credentials": {
    "username": "janedoe"
  },
  "tags": ["backend", "golang"],
  "profile_picture": "https://example.com/newpic.jpg",
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "updated_at": "2025-02-11T18:00:12Z"
}
```

### Update User Username

Updating user's username.

```bash
curl -sSiX PATCH http://localhost/users/<user_id>/username -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "username": "<username>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/email -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "username": "janedoe2025"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 13:59:53 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "newemail@example.com",
  "credentials": {
    "username": "janedoe2025"
  },
  "tags": ["backend", "golang"],
  "profile_picture": "https://example.com/newpic.jpg",
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "updated_at": "2025-02-11T18:00:12Z"
}
```

### Change Secret

Changing the user secret can be done by calling the update secret method

```bash
curl -sSiX PATCH http://localhost/users/secret -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "old_secret": "<old_secret>",
  "new_secret": "<new_secret>"
}
EOF
```

For example:

```bash
curl -sSiX PATCH http://localhost/users/secret -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "old_secret": "12345678",
  "new_secret": "12345678a"
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:00:35 GMT
Content-Type: application/json
Content-Length: 281
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Enable User

Changing the user status to enabled can be done by calling the enable user method

```bash
curl -sSiX POST http://localhost/users/<user_id>/enable -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/enable -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:25 GMT
Content-Type: application/json
Content-Length: 382
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "newemail@example.com",
  "credentials": {
    "username": "janedoe2025"
  },
  "tags": ["backend", "golang"],
  "profile_picture": "https://example.com/newpic.jpg",
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "enabled",
  "updated_at": "2025-02-11T18:00:12Z"
}
```

### Disable User

Changing the user status to disabled can be done by calling the disable user method

```bash
curl -sSiX POST http://localhost/users/<user_id>/disable -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/disable -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:23 GMT
Content-Type: application/json
Content-Length: 383
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
  "first_name": "Janet",
  "last_name": "Doyle",
  "email": "newemail@example.com",
  "credentials": {
    "username": "janedoe2025"
  },
  "tags": ["backend", "golang"],
  "profile_picture": "https://example.com/newpic.jpg",
  "metadata": {
    "location": "Lyon"
  },
  "profile_picture": "https://example.com/janedoe.jpg",
  "status": "disabled",
  "updated_at": "2025-02-11T18:00:12Z"
}
```

### Delete User

Delete a user from the system.

```bash
curl -X DELETE http://localhost:9002/users/<user_id> \
-H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -X DELETE http://localhost:9002/users/b7edb32-2eac-4aad-aebe-ed96fe073879 \
-H "Authorization: Bearer your_access_token"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:23 GMT
Content-Type: application/json
Content-Length: 383
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "message": "User deleted successfully"
}
```

### Search User

Searches for users by various parameters.

```bash
curl -X GET "http://localhost:9002/users/search?username=<username>&email=<email>" \
-H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -X GET "http://localhost:9002/users/search?username=janedoe2025&email=newemail@example.com" \
-H "Authorization: Bearer your_access_token"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Wed, 14 Jun 2023 14:01:23 GMT
Content-Type: application/json
Content-Length: 383
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "offset": 0,
  "total": 1,
  "users": [
    {
      "id": "b7edb32-2eac-4aad-aebe-ed96fe073879",
      "username": "janedoe2025",
      "email": "newemail@example.com"
    }
  ]
}
```

### Get User Memberships

You can get all groups a user is assigned to by calling the get user memberships method.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

> The user identified by the `user_token` must be assigned to the same group as the user with id `user_id` with `c_list` action. Alternatively, the user identified by the `user_token` must be the owner of the user with id `user_id`.

```bash
curl -sSiX GET http://localhost/users/<user_id>/memberships -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/users/1890c034-7ef9-4cde-83df-d78ea1d4d281/memberships -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:22:18 GMT
Content-Type: application/json
Content-Length: 367
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 0,
  "offset": 0,
  "memberships": [
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Data analysts",
      "description": "This group would be responsible for analyzing data collected from sensors.",
      "metadata": { "location": "london" },
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "2023-06-15T10:17:56.475241Z",
      "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "status": "enabled"
    }
  ]
}
```

## Clients

All requests should include an Authorization: Bearer `<user_token>` header unless otherwise specified.

Base URL:

- http://localhost:9006

### Create Client

To create a client, you need the client and a `user_token`

```bash
curl -X POST http://localhost:9006/<domainID>/clients \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '{
  "name": "<client_name>",
  "tags": ["<tag1>", "<tag2>"],
  "credentials": {
    "identity": "<client_identity>",
    "secret": "<client_secret>"
  },
  "metadata": {
    "<key1>": "<value1>"
  },
  "status": "enabled"
}'

```

For example:

```bash
curl -X POST http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "name": "Temperature Sensor",
  "tags": ["sensor", "environment"],
  "credentials": {
    "identity": "temp-sensor-001",
    "secret": "secure-password"
  },
  "metadata": {
    "location": "warehouse"
  },
  "status": "enabled"
}'


HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:04:04 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /clients/48101ecd-1535-40c6-9ed8-5b1d21e371bb
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "name": "Temperature Sensor",
  "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "tags": ["sensor", "environment"],
  "credentials": {
    "identity": "temp-sensor-001",
    "secret": "secure-password"
  },
  "metadata": {
    "location": "warehouse"
  },
  "status": "enabled",
  "created_at": "2025-02-11T19:30:15Z",
  "updated_at": "2025-02-11T19:30:15Z"
}
```

### Create Client with External ID

It is often the case that the user will want to integrate the existing solutions, e.g. an asset management system, with the Magistrala platform. To simplify the integration between the systems and avoid artificial cross-platform reference, such as special fields in Magistrala Clients metadata, it is possible to set Magistrala Client ID with an existing unique ID while create the Client. This way, the user can set the existing ID as the Client ID of a newly created Client to keep reference between Client and the asset that Client represents.

The limitation is that the existing ID has to be unique in the Magistrala domain.

To create a client with an external ID, you need to provide the ID together with client name, and other fields as well as a `user_token`

For example:

```bash
curl -sSiX POST http://localhost:9006/<domainID>/clients -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name":"Temperature Sensor"
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:05:06 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /clients/2766ae94-9a08-4418-82ce-3b91cf2ccd3e
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name": "Temperature Sensor",
  "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "credentials": { "secret": "65ca03bd-eb6b-420b-9d5d-46d459d4f71c" },
  "created_at": "2023-06-15T09:05:06.538170496Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Client with External Secret

It is often the case that the user will want to integrate the existing solutions, e.g. an asset management system, with the Magistrala platform. To simplify the integration between the systems and avoid artificial cross-platform reference, such as special fields in Magistrala Clients metadata, it is possible to set Magistrala Client secret with an existing unique secret when creating the Client. This way, the user can set the existing secret as the Client secret of a newly created Client to keep reference between Client and the asset that Client represents.
The limitation is that the existing secret has to be unique in the Magistrala domain.

To create a client with an external secret, you need to provide the secret together with client name, and other fields as well as a `user_token`

For example:

```bash
curl -sSiX POST http://localhost:9006/<domainID>/clients -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Temperature Sensor"
  "credentials": {
    "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e"
  }
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:05:06 GMT
Content-Type: application/json
Content-Length: 280
Connection: keep-alive
Location: /clients/2766ae94-9a08-4418-82ce-3b91cf2ccd3e
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name": "Temperature Sensor",
  "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "credentials": { "secret": "94939159-9a08-4f17-9e4e-3b91cf2ccd3e" },
  "created_at": "2023-06-15T09:05:06.538170496Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Create Clients

You can create multiple clients at once by entering a series of clients structures and a `user_token`

```bash
curl -sSiX POST http://localhost:9006/<domainID>/clients/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "[client_id]",
    "name":"[client_name]",
    "tags": ["[tag1]", "[tag2]"],
    "credentials": {
        "identity": "[client-identity]",
        "secret":"[client-secret]"
    },
      "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  },
  {
    "id": "[client_id]",
    "name":"[client_name]",
    "tags": ["[tag1]", "[tag2]"],
    "credentials": {
        "identity": "[client-identity]",
        "secret":"[client-secret]"
    },
      "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  }
]
EOF
```

For example:

```bash
curl -X POST http://localhost:9006/<domainID>/clients/bulk \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '[
  {
    "name": "Motion Sensor",
    "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    "tags": ["sensor", "security"],
    "credentials": {
      "identity": "motion-sensor-001",
      "secret": "secure-secret"
    }
  },
  {
    "name": "Humidity Sensor",
    "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    "tags": ["sensor", "environment"],
    "credentials": {
      "identity": "humidity-sensor-001",
      "secret": "another-secret"
    }
  }
]'


HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:05:45 GMT
Content-Type: application/json
Content-Length: 583
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 2,
  "clients": [
    {
      "id": "c3d4e5f6-a7b8-9012-3456-78901abcdef2",
      "name": "Motion Sensor",
      "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "status": "enabled"
    },
    {
      "id": "d4e5f6a7-b8c9-0123-4567-89012abcdef3",
      "name": "Humidity Sensor",
      "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "status": "enabled"
    }
  ]
}

```

### Create Clients with external ID

The same as creating a Client with external ID the user can create multiple clients at once by providing UUID v4 format unique ID in a series of clients together with a `user_token`

For example:

```bash
curl -sSiX POST http://localhost:9006/<domainID>/clients/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
    "name":"Motion Sensor",
    "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  },
  {
    "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
    "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    "name":"Light Sensor"
  }
]
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:06:17 GMT
Content-Type: application/json
Content-Length: 583
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 2,
  "clients": [
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "credentials": { "secret": "325cda17-3a52-465d-89a7-2b63c7d0e3a6" },
      "created_at": "2023-06-15T09:06:17.967825372Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "Light Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828689Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Client

You can get client entity by entering the client ID and `user_token`

```bash
curl -X GET http://localhost:9006/<domainID>/clients/<clientID> \
-H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -X GET http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0 \
-H "Authorization: Bearer your_access_token"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:07:30 GMT
Content-Type: application/json
Content-Length: 277
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "name": "Temperature Sensor",
  "tags": ["sensor", "environment"],
  "domain_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "credentials": {
    "identity": "temp-sensor-001",
    "secret": ""
  },
  "metadata": {
    "location": "warehouse"
  },
  "status": "enabled",
  "created_at": "2025-02-11T19:30:15Z",
  "updated_at": "2025-02-11T19:35:20Z"
}

```

### Get Clients

You can get all clients in the database by querying `/clients` endpoint.

```bash
curl -sSiX GET http://localhost/clients -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/clients -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:07:59 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 8,
  "clients": [
    {
      "id": "f3047c10-f2c7-4d53-b3c0-bc56c560c546",
      "name": "Humidity Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "6d11a91f-0bd8-41aa-8e1b-4c6338329c9c" },
      "created_at": "2023-06-14T12:04:12.740098Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "04b0b2d1-fdaf-4b66-96a0-740a3151db4c",
      "name": "UV Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "a1e5d77f-8903-4cef-87b1-d793a3c28de3" },
      "created_at": "2023-06-14T12:04:56.245743Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "name": "Temperature Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "c3f8c096-c60f-4375-8494-bca20a12fca7" },
      "created_at": "2023-06-15T09:04:04.292602Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "name": "Temperature Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "65ca03bd-eb6b-420b-9d5d-46d459d4f71c" },
      "created_at": "2023-06-15T09:05:06.53817Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "19f59b2d-1e9c-43db-bc84-5432bd52a83f",
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "941c380a-3a41-40e9-8b79-3087daa4f3a6" },
      "created_at": "2023-06-15T09:05:45.719182Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "3709f2b0-9c73-413f-992e-7f6f9b396b0d",
      "name": "Light Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "798ee6be-311b-4640-99e4-0ccb19e0dcb9" },
      "created_at": "2023-06-15T09:05:45.719186Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111111",
      "name": "Motion Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "325cda17-3a52-465d-89a7-2b63c7d0e3a6" },
      "created_at": "2023-06-15T09:06:17.967825Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "Light Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `tags` and `visibility` as query parameters.

```bash
curl -sSiX GET http://localhost/clients?[offset=<offset>]&[limit=<limit>]&name=[name]&[status=<status>] -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/clients?offset=1&limit=5&name=Light Sensor -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:08:39 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 5,
  "offset": 1,
  "total": 2,
  "clients": [
    {
      "id": "eb2670ba-a2be-4ea4-83cb-111111111112",
      "name": "Light Sensor",
      "owner": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "credentials": { "secret": "67b6cbb8-4a9e-4d32-8b9c-d7cd3352aa2b" },
      "created_at": "2023-06-15T09:06:17.967828Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update Client

Updating a client name and/or metadata

```bash
curl -X PATCH http://localhost:9006/<domainID>/clients/<clientID> \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '{
  "name": "<new_name>",
  "metadata": {
    "<key1>": "<value1>"
  }
}'
```

For example:

```bash
curl -X PATCH http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "name": "New Sensor Name",
  "metadata": {
    "location": "office"
  }
}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:12 GMT
Content-Type: application/json
Content-Length: 332
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "name": "New Sensor Name",
  "metadata": {
    "location": "office"
  },
  "updated_at": "2025-02-11T20:00:00Z"
}

```

### Update Client Tags

Updating a client tags

```bash
curl -X PATCH http://localhost:9006/<domainID>/clients/<clientID>/tags \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '{
  "tags": ["<tag1>", "<tag2>"]
}'

```

For example:

```bash
curl -X PATCH http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0/tags \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "tags": ["updated", "environment"]
}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:09:44 GMT
Content-Type: application/json
Content-Length: 347
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "tags": ["updated", "environment"],
  "updated_at": "2025-02-11T20:15:30Z"
}

```

### Update Client Secret

Updating a client secret

```bash
curl -X PATCH http://localhost:9006/<domainID>/clients/<clientID>/secret \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <user_token>" \
-d '{
  "secret": "<new_secret>"
}'

```

For example:

```bash
curl -X PATCH http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0/secret \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "secret": "new-secure-password"
}'

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:10:52 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "status": "secret updated",
  "updated_at": "2025-02-11T20:25:45Z"
}
```

### Enable Client

To enable a client you need a `client_id` and a `user_token`

```bash
curl -X POST http://localhost:9006/<domainID>/clients/<clientID>/enable \
-H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -X POST http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0/enable \
-H "Authorization: Bearer your_access_token"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:43 GMT
Content-Type: application/json
Content-Length: 321
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "status": "enabled",
  "updated_at": "2025-02-11T20:30:00Z"
}
```

### Disable Client

To disable a client you need a `client_id` and a `user_token`

```bash
curl -X POST http://localhost:9006/<domainID>/clients/<clientID>/disable \
-H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -X POST http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0/disable \
-H "Authorization: Bearer your_access_token"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:38 GMT
Content-Type: application/json
Content-Length: 322
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "status": "disabled",
  "updated_at": "2025-02-11T20:35:00Z"
}

```

### Delete Client

To delete a client you need a `client_id` and a `user_token`

```bash
curl -X DELETE http://localhost:9006/<domainID>/clients/<clientID> \
-H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -X DELETE http://localhost:9006/123e4567-e89b-12d3-a456-426614174000/clients/a1b2c3d4-e5f6-7890-1234-56789abcdef0 \
-H "Authorization: Bearer your_access_token"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:11:38 GMT
Content-Type: application/json
Content-Length: 322
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "message": "Client deleted successfully"
}

```

## Channels

### Create Channel

To create a channel, you need a `user_token`

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "[channel_id]",
  "name":"[channel_name]",
  "description":"[channel_description]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  },
  "status": "[enabled|disabled]"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Temperature Data",
  "domain_id": "abc123-domain",
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:12:51 GMT
Content-Type: application/json
Content-Length: 218
Connection: keep-alive
Location: /channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8
Access-Control-Expose-Headers: Location

{
  "id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "name": "Temperature Data",
  "description": "Weather temperature data",
  "domain_id": "abc123-domain",
  "metadata": { "location": "server1" },
  "status": "enabled",
  "created_at": "2025-02-11T09:45:00Z"
}
```

### Create Channel with external ID

Channel is a group of clients that could represent a special category in existing systems, e.g. a building level channel could represent the level of a smarting building system. For helping to keep the reference, it is possible to set an existing ID while creating the Magistrala channel. There are two limitations - the existing ID has to be in UUID V4 format and it has to be unique in the Magistrala domain.

To create a channel with external ID, the user needs to provide a UUID v4 format unique ID, and a `user_token`

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
  "domain_id": "abc123-domain",
  "name": "Humidity Data"
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:15:11 GMT
Content-Type: application/json
Content-Length: 219
Connection: keep-alive
Location: /channels/48101ecd-1535-40c6-9ed8-5b1d21e371bb
Access-Control-Expose-Headers: Location

{
  "id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "name": "Temperature Data",
  "description": "Weather temperature data",
  "domain_id": "abc123-domain",
  "metadata": { "location": "server1" },
  "status": "enabled",
  "created_at": "2025-02-11T09:45:00Z"
}
```

### Create Channels

The same as creating a channel with external ID the user can create multiple channels at once by providing UUID v4 format unique ID in a series of channels together with a `user_token`

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "[channel_id]",
    "name":"[channel_name]",
    "description":"[channel_description]",
    "domainid": "[domiaind]",
    "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  },
  {
    "id": "[channel_id]",
    "name":"[channel_name]",
    "description":"[channel_description]",
    "domainid": "[domiaind]",
    "metadata": {
        "[key1]": "[value1]",
        "[key2]": "[value2]"
    },
    "status": "[enabled|disabled]"
  }
]
EOF
```

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "name":"Light Data"
  },
  {
    "name":"Pressure Data"
  }
]
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:15:44 GMT
Content-Type: application/json
Content-Length: 450
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "channels": [
    {
      "id": "cb81bbff-850d-471f-bd74-c15d6e1a6c4e",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Light Data",
      "created_at": "2023-06-15T09:15:44.154283Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "fc9bf029-b1d3-4408-8d53-fc576247a4b3",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:15:44.15721Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Create Channels with external ID

As with clients, you can create multiple channels with external ID at once

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/bulk -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
[
  {
    "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
    "name":"Light Data"
  },
  {
    "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
    "name":"Pressure Data"
  }
]
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:16:16 GMT
Content-Type: application/json
Content-Length: 453
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "channels": [
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "name":"Light Data"
      "description": "Weather temperature data",
      "domain_id": "abc123-domain",
      "metadata": { "location": "server1" },
      "status": "enabled",
      "created_at": "2025-02-11T09:45:00Z"
    }

    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "name":"Light Data"
      "description": "Weather temperature data",
      "domain_id": "abc123-domain",
      "metadata": { "location": "server1" },
      "status": "enabled",
      "created_at": "2025-02-11T09:45:00Z"
    }
  ]
}
```

### Get Channel

Get a channel entity for a logged-in user

```bash
curl -sSiX GET http://localhost:9005/{domainID}/channels/<channel_id> -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost:9005/{domainID}/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8 -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:17:17 GMT
Content-Type: application/json
Content-Length: 218
Connection: keep-alive
Access-Control-Expose-Headers: Location

  {
    "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
    "name":"Light Data"
    "description": "Weather temperature data",
    "domain_id": "abc123-domain",
    "metadata": { "location": "server1" },
    "status": "enabled",
    "created_at": "2025-02-11T09:45:00Z"
  }
```

### Get Channels

You can get all channels for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/channels -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/channels -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:17:46 GMT
Content-Type: application/json
Content-Length: 1754
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "total": 8,
  "channels": [
    {
      "id": "17129934-4f48-4163-bffe-0b7b532edc5c",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Tokyo",
      "created_at": "2023-06-14T12:10:07.950311Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "48101ecd-1535-40c6-9ed8-5b1d21e371bb",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Humidity Data",
      "created_at": "2023-06-15T09:15:11.477695Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111111",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Light Data",
      "created_at": "2023-06-15T09:16:16.931016Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "977bbd33-5b59-4b7a-a9c3-111111111112",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:16:16.934486Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Temperature Data",
      "created_at": "2023-06-15T09:12:51.162431Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "b3867a52-675d-4f05-8cd0-df5a08a63ff3",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "London",
      "created_at": "2023-06-14T12:09:34.205894Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "cb81bbff-850d-471f-bd74-c15d6e1a6c4e",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Light Data",
      "created_at": "2023-06-15T09:15:44.154283Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "fc9bf029-b1d3-4408-8d53-fc576247a4b3",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Pressure Data",
      "created_at": "2023-06-15T09:15:44.15721Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update Channel

Update channel name and/or metadata.

```bash
curl -sSiX PUT http://localhost:9005/{domainID}/channels/<channel_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"[channel_name]",
  "description":"[channel_description]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  }
}
EOF
```

For example:

```bash
curl -sSiX PUhttp://localhost:9005/{domainID}/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8 -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Jane Doe",
  "metadata": {
      "location": "london"
  }
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:18:26 GMT
Content-Type: application/json
Content-Length: 296
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Jane Doe",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Enable Channel

To enable a channel you need a `channel_id` and a `user_token`

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/<channel_id>/enable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/enable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:19:29 GMT
Content-Type: application/json
Content-Length: 296
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Jane Doe",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable Channel

To disable a channel you need a `channel_id` and a `user_token`

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/<channel_id>/disable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/disable -H "Content-Type: application/json" -H  "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:19:24 GMT
Content-Type: application/json
Content-Length: 297
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Jane Doe",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:12:51.162431Z",
  "updated_at": "2023-06-15T09:18:26.886913Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Connect

Connect clients to channels

> `actions` is optional, if not provided, the default action is `m_read` and `m_write`.

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/connect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "channel_ids": ["chan1", "chan2"],
  "client_ids": ["client1", "client2"],
  "types": ["publish", "subscribe"]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/connect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "channel_ids": ["48101ecd-1535-40c6-9ed8-5b1d21e371bb"],
  "client_ids": ["aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"],
  "types": ["publish", "subscribe"]
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:21:37 GMT
Content-Type: application/json
Content-Length: 247
Connection: keep-alive
Access-Control-Expose-Headers: Location

```

### Disconnect

Disconnect clients from channels specified by lists of IDs.

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/disconnect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subjects": ["<client_id_1>", "[client_id_2]"],
  "objects": ["<channel_id_1>", "[channel_id_2]"]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost:9005/{domainID}/channels/disconnect -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subjects": ["48101ecd-1535-40c6-9ed8-5b1d21e371bb"],
  "objects": ["aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8"]
}
EOF

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:23:07 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

## Messages

### Send Messages

Sends message via HTTP protocol

```bash
curl -sSiX POST http://localhost/http/c/<channel_id>/m -H "Content-Type: application/senml+json" -H "Authorization: Client <client_secret>" -d @- << EOF
[
  {
    "bn": "<base_name>",
    "bt": "[base_time]",
    "bu": "[base_unit]",
    "bver": [base_version],
    "n": "<measurement_name>",
    "u": "<measurement_unit>",
    "v": <measurement_value>,
  },
  {
    "n": "[measurement_name]",
    "t": <measurement_time>,
    "v": <measurement_value>,
  }
]
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/http/c/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/m -H "Content-Type: application/senml+json" -H "Authorization: Client a83b9afb-9022-4f9e-ba3d-4354a08c273a" -d @- << EOF
[
  {
    "bn": "some-base-name:",
    "bt": 1.276020076001e+09,
    "bu": "A",
    "bver": 5,
    "n": "voltage",
    "u": "V",
    "v": 120.1
  },
  {
    "n": "current",
    "t": -5,
    "v": 1.2
  },
  {
    "n": "current",
    "t": -4,
    "v": 1.3
  }
]
EOF
HTTP/1.1 202 Accepted
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:40:44 GMT
Content-Length: 0
Connection: keep-alive
```

### Read Messages

Reads messages from database for a given channel

```bash
curl -sSiX GET http://localhost:<service_port>/c/<channel_id>/m?[offset=<offset>]&[limit=<limit>] -H "Authorization: Client <client_secret>"
```

For example:

```bash
curl -sSiX GET http://localhost:9009/c/aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8/m -H "Authorization: Client a83b9afb-9022-4f9e-ba3d-4354a08c273a"

HTTP/1.1 200 OK
Content-Type: application/json
Date: Wed, 05 Apr 2023 16:01:49 GMT
Content-Length: 660

{
    "offset": 0,
    "limit": 10,
    "format": "messages",
    "total": 3,
    "messages": [{
            "channel": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
            "publisher": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
            "protocol": "http",
            "name": "some-base-name:voltage",
            "unit": "V",
            "time": 1276020076.001,
            "value": 120.1
        },
        {
            "channel": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
            "publisher": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
            "protocol": "http",
            "name": "some-base-name:current",
            "unit": "A",
            "time": 1276020072.001,
            "value": 1.3
        },
        {
            "channel": "aecf0902-816d-4e38-a5b3-a1ad9a7cf9e8",
            "publisher": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
            "protocol": "http",
            "name": "some-base-name:current",
            "unit": "A",
            "time": 1276020071.001,
            "value": 1.2
        }
    ]
}
```

## Groups

### Create group

To create a group, you need the group name and a `user_token`

```bash
curl -sSiX POST http://localhost/<domainID>/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"<group_name>",
  "description":"[group_description]",
  "parent_id": "[parent_id]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  },
  "status": "[enabled|disabled]"
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/<domainID>/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Security Engineers",
  "description": "This group would be responsible for securing the platform."
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:41:42 GMT
Content-Type: application/json
Content-Length: 252
Connection: keep-alive
Location: /groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "domain_id": "1234abcd-5678-efgh-ijkl-9012mnopqrst",
  "name": "Security Engineers",
  "description": "Group responsible for securing the platform.",
  "metadata": {},
  "status": "enabled",
  "created_at": "2025-02-11T09:41:42Z",
  "updated_at": "2025-02-11T09:41:42Z"
}
```

When you use `parent_id` make sure the parent is an already exisiting group

For example:

```bash
curl -sSiX POST http://localhost/<domainID>/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name": "Customer Support",
  "description": "This group would be responsible for providing support to users of the platform.",
  "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e"
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 09:42:34 GMT
Content-Type: application/json
Content-Length: 306
Connection: keep-alive
Location: /groups/dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a
Access-Control-Expose-Headers: Location

{
  "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "name": "Customer Support",
  "description": "This group would be responsible for providing support to users of the platform.",
  "created_at": "2023-06-15T09:42:34.063997Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get group

Get a group entity for a logged-in user

```bash
curl -sSiX GET http://localhost/<domainID>/groups/<group_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/<domainID>/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:00:52 GMT
Content-Type: application/json
Content-Length: 252
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Security Engineers",
  "description": "This group would be responsible for securing the platform.",
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "status": "enabled"
}
```

### Get groups

You can get all groups for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/<domainID>/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/<domainID>/groups -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:13:50 GMT
Content-Type: application/json
Content-Length: 807
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 0,
  "offset": 0,
  "total": 3,
  "groups": [
    {
      "id": "0a4a2c33-2d0e-43df-b51c-d905aba99e17",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Sensor Operators",
      "created_at": "2023-06-14T13:33:52.249784Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Security Engineers",
      "description": "This group would be responsible for securing the platform.",
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    },
    {
      "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "name": "Customer Support",
      "description": "This group would be responsible for providing support to users of the platform.",
      "created_at": "2023-06-15T09:42:34.063997Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Group Parents

You can get all groups that are parents of a group for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/<domainID>/groups/<group_id>/parents -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/<domainID>/groups/dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a/parents?tree=true -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:16:03 GMT
Content-Type: application/json
Content-Length: 627
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "offset": 0,
  "total": 3,
  "groups": [
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Security Engineers",
      "description": "This group would be responsible for securing the platform.",
      "level": -1,
      "children": [
        {
          "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
          "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
          "name": "Customer Support",
          "description": "This group would be responsible for providing support to users of the platform.",
          "created_at": "2023-06-15T09:42:34.063997Z",
          "updated_at": "0001-01-01T00:00:00Z",
          "status": "enabled"
        }
      ],
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Get Group Children

You can get all groups that are children of a group for a logged-in user.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `parentID`, `ownerID`, `tree` and `dir` as query parameters.

```bash
curl -sSiX GET http://localhost/<domainID>/groups/<group_id>/children -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/<domainID>/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/children?tree=true -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:17:13 GMT
Content-Type: application/json
Content-Length: 755
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "offset": 0,
  "total": 3,
  "groups": [
    {
      "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
      "name": "Security Engineers",
      "description": "This group would be responsible for securing the platform.",
      "path": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
      "children": [
        {
          "id": "dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
          "parent_id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
          "name": "Customer Support",
          "description": "This group would be responsible for providing support to users of the platform.",
          "level": 1,
          "path": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e.dd2dc8d4-f7cf-42f9-832b-81cae9a8e90a",
          "created_at": "2023-06-15T09:42:34.063997Z",
          "updated_at": "0001-01-01T00:00:00Z",
          "status": "enabled"
        }
      ],
      "created_at": "2023-06-15T09:41:42.860481Z",
      "updated_at": "0001-01-01T00:00:00Z",
      "status": "enabled"
    }
  ]
}
```

### Update group

Update group entity

```bash
curl -sSiX PUT http://localhost/<domainID>/groups/<group_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"[group_name]",
  "description":"[group_description]",
  "metadata": {
      "[key1]": "[value1]",
      "[key2]": "[value2]"
  }
}
EOF
```

For example:

```bash
curl -sSiX PUT http://localhost/<domainID>/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e  -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "name":"Data Analysts",
  "description":"This group would be responsible for analyzing data collected from sensors.",
  "metadata": {
      "location": "london"
  }
}
EOF

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:17:56 GMT
Content-Type: application/json
Content-Length: 328
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Data Analysts",
  "description": "This group would be responsible for analyzing data collected from sensors.",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Disable group

Disable a group entity

```bash
curl -sSiX POST http://localhost/<domainID>/groups/<group_id>/disable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/<domainID>/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/disable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:18:28 GMT
Content-Type: application/json
Content-Length: 329
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Data Analysts",
  "description": "This group would be responsible for analyzing data collected from sensors.",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "disabled"
}
```

### Enable group

Enable a group entity

```bash
curl -sSiX POST http://localhost/<domainID>/groups/<group_id>/enable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX POST http://localhost/<domainID>/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/enable -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:18:55 GMT
Content-Type: application/json
Content-Length: 328
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "id": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "domain_id": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "name": "Data Analysts",
  "description": "This group would be responsible for analyzing data collected from sensors.",
  "metadata": { "location": "london" },
  "created_at": "2023-06-15T09:41:42.860481Z",
  "updated_at": "2023-06-15T10:17:56.475241Z",
  "updated_by": "94939159-d129-4f17-9e4e-cc2d615539d7",
  "status": "enabled"
}
```

### Assign

Assign user to a group

```bash
curl -sSiX POST http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "<user_id>",
  "object": "<group_id>",
  "actions": ["<member_action>"]
}
EOF
```

For example:

```bash
curl -sSiX POST http://localhost/users/policies -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>" -d @- << EOF
{
  "subject": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
  "object": "2766ae94-9a08-4418-82ce-3b91cf2ccd3e",
  "actions": ["g_list", "c_list"]
}
EOF

HTTP/1.1 201 Created
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 10:19:59 GMT
Content-Type: application/json
Content-Length: 0
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

### Members

You can get all users assigned to a group.

If you want to paginate your results then use `offset`, `limit`, `metadata`, `name`, `status`, `identity`, and `tag` as query parameters.

> Must take into consideration the user identified by the `user_token` needs to be assigned to the same group identified by `group_id` with `g_list` action or be the owner of the group identified by `group_id`.

```bash
curl -sSiX GET http://localhost/<domainID>/groups/<group_id>/members -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX GET http://localhost/<domainID>/groups/2766ae94-9a08-4418-82ce-3b91cf2ccd3e/members -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 200 OK
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:21:29 GMT
Content-Type: application/json
Content-Length: 318
Connection: keep-alive
Access-Control-Expose-Headers: Location

{
  "limit": 10,
  "total": 1,
  "members": [
    {
      "id": "1890c034-7ef9-4cde-83df-d78ea1d4d281",
      "name": "Jane Doe",
      "tags": ["male", "developer"],
      "credentials": { "identity": "updated.jane.doe@gmail.com" },
      "metadata": { "location": "london" },
      "created_at": "2023-06-14T13:46:47.322648Z",
      "updated_at": "2023-06-14T13:59:53.422595Z",
      "status": "enabled"
    }
  ]
}
```

### Unassign

Unassign user from group

```bash
curl -sSiX DELETE http://localhost/users/policies/<subject_id>/<object_id> -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"
```

For example:

```bash
curl -sSiX DELETE http://localhost/users/policies/1890c034-7ef9-4cde-83df-d78ea1d4d281/2766ae94-9a08-4418-82ce-3b91cf2ccd3e  -H "Content-Type: application/json" -H "Authorization: Bearer <user_token>"

HTTP/1.1 204 No Content
Server: nginx/1.23.3
Date: Thu, 15 Jun 2023 11:25:27 GMT
Content-Type: application/json
Connection: keep-alive
Access-Control-Expose-Headers: Location
```

[api]: https://absmach.github.io/magistrala
