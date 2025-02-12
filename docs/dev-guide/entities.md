---
title: Entities
---


Users and Client form the base and most important part of Magistrala. Users are identified using their unique email address, username and secret. Clients have unique IDs as well.

## Generic User Entity

A **User** component is used to represent generic user accounts, each having a unique **Username** and **Secret**, currently deployed under Users services. This User entity is structured in Go with specific fields:

```go

// Credentials represent user credentials: its
// "username"  a user's unique username;
// and "secret" which can be a password or access token.
type Credentials struct {
 Username string `json:"username,omitempty"` // username 
 Secret   string `json:"secret,omitempty"`   // password or token
}

// User represents generic User.
type User struct {
 ID             string      `json:"id"`
 FirstName      string      `json:"first_name,omitempty"`
 LastName       string      `json:"last_name,omitempty"`
 Tags           []string    `json:"tags,omitempty"`
 Metadata       Metadata    `json:"metadata,omitempty"`
 Status         Status      `json:"status"`                    // 0 for enabled, 1 for disabled
 Role           Role        `json:"role"`                      // 0 for normal user, 1 for admin
 ProfilePicture string      `json:"profile_picture,omitempty"` // profile picture URL
 Credentials    Credentials `json:"credentials,omitempty"`
 Permissions    []string    `json:"permissions,omitempty"`
 Email          string      `json:"email,omitempty"`
 CreatedAt      time.Time   `json:"created_at,omitempty"`
 UpdatedAt      time.Time   `json:"updated_at,omitempty"`
 UpdatedBy      string      `json:"updated_by,omitempty"`
}
```

- `ID` is a unique identifier for each user. It is a string value.
- `FirstName` is a required field that represents the first name of the user.
- `LastName` is a required field that represents the last name of the user.
- `Email` is a required filed that represents the email address of the user which can be used to log them in.
- `Tags` is an optional field that represents the tags related to the user. It is a slice of string values.
- `Credentials` is a struct that represents the user credentials. It contains two fields:
  - `Username` This is the username of the user, which must be unique.
  - `Secret` This is the secret of the user, which can be a password, secret key, or access token.
- `Metadata` is an optional field that is used for customized describing of the user.
- `CreatedAt` is a field that represents the time when the user was created. It is a time.Time value.
- `UpdatedAt` is a field that represents the time when the user was last updated. It is a time.Time value.
- `UpdatedBy` is a field that represents the user who last updated the user.
- `Status` is a field that represents the status for the user. It can be either 1 for enabled or 0 for disabled.
- `Role` is an optional field that represents the role of the user. It can be either 1 for admin or 0 for the user.
- `ProfilePicture` is a string url that leads to an image in the database that can be used as the user's profile picture.

## Users service

The **Users Service** allows for creating, updating, reading, and deleting **Users** and **Groups**.
Users can bear multiple permissions that allow them various actions over other services and entities in the platform.

### Users

- The API endpoint for interacting with users are described in the [users API][users-api].
- The CLI for interacting with users are described in the [users CLI][users-cli].

### Groups

- The API endpoint for interacting with groups are described in the [groups API][groups-api].
- The CLI for interacting with groups are described in the [groups_CLI][groups-cli].
Multiple users form a `group`. These groups can be organised in a hierachical manner creating children and parents. Permissions and roles can be shared across the groups.

## Clients service

Clients Service manages `clients` and `channel`. `Client` represents a device (or an application) connected to Magistrala that uses the platform for message exchange with other `clients`.
`Channel` is a message conduit between clients connected to it. It serves as a message topic that can be consumed by all of the clients connected to it. Clients can publish or subscribe to the Channel.

```go
// Client Struct represents a client.

type Client struct {
 ID          string      `json:"id"`
 Name        string      `json:"name,omitempty"`
 Tags        []string    `json:"tags,omitempty"`
 Domain      string      `json:"domain_id,omitempty"`
 Credentials Credentials `json:"credentials,omitempty"`
 Metadata    Metadata    `json:"metadata,omitempty"`
 CreatedAt   time.Time   `json:"created_at,omitempty"`
 UpdatedAt   time.Time   `json:"updated_at,omitempty"`
 UpdatedBy   string      `json:"updated_by,omitempty"`
 Status      Status      `json:"status,omitempty"` // 1 for enabled, 0 for disabled
 Permissions []string    `json:"permissions,omitempty"`
 Identity    string      `json:"identity,omitempty"`
}

type Credentials struct {
 Identity string `json:"identity,omitempty"`
 Secret   string `json:"secret,omitempty"`   // password or token
}

Hence any phsical device with an embeded system can be handed a unique key that will be used as a token during publishing and subscribing to a channel can be classified as a thing.

### Clients

- The API endpoint for interacting with clients are described in the [clients API][clients-api].
- The CLI for interacting with clients are described in the [clients CLI][clients-cli].

### Channels

- The API endpoint for interacting with channels are described in the [channels API][channels-api].
- The CLI for interacting with channels are described in the [channels CLI][channels-cli].

[users-api]: https://github.com/absmach/supermq-docs/blob/main/docs/api.md#users
[groups-api]: https://github.com/absmach/supermq-docs/blob/main/docs/api.md#groups
[clients-api]: .https://github.com/absmach/supermq-docs/blob/main/docs/api.md#clients
[channels-api]: https://github.com/absmach/supermq-docs/blob/main/docs/api.md#channels
[users-cli]: ./cli.md#users-management
[groups-cli]: ./cli.md#groups-management
[clients-cli]: ./cli.md#clients-management
[channels-cli]: ./cli.md#channels-management
