---
title: Role-Based Access Control (RBAC) Schema
---


This schema defines the relationships and permissions for managing roles and access control within **Magistrala**. It describes how entities such as **users, roles, clients, channels, groups,** and **domains** interact through defined relations and permissions.

## Entities and Relations

### **User**

A `user` is an entity that can be assigned roles within the system.

### **Role**

A `role` defines a set of permissions that can be assigned to users within **domains, groups, channels,** or **clients**.

#### Relations

- `entity`: Associates a role with a **domain, group, channel, or client**.
- `member`: user
- `built_in_role`: Represents system-defined roles. Includes domain, group, channel and client.

#### Permissions

- `delete`: Allows removing a role unless restricted by a built-in role.
- `update`: Allows modifying a role unless restricted by a built-in role.
- `read`: Allows viewing a role unless restricted by a built-in role.
- `add_user`: Grants permission to assign users to a role.
- `remove_user`: Grants permission to remove users from a role.
- `view_user`: Grants permission to view users assigned to a role.

### **Clients**

A `client` represents a device or application that interacts with **Magistrala**.

#### Client Relations

- `domain`: Associates a client with a **domain**.
- `parent_group`: Associates a client with a **group**.

#### Client Permissions

- `update_permission`: Allows updating a client.
- `read_permission`: Allows reading client details.
- `delete_permission`: Allows deleting a client.
- `set_parent_group_permission`: Allows setting the parent group of a client.
- `connect_to_channel_permission`: Allows the client to connect to a channel.
- `manage_role_permission`: Grants permission to manage roles related to the client.
- `add_role_users_permission`: Grants permission to assign users to roles related to the client.
- `remove_role_users_permission`: Grants permission to remove users from client-related roles.
- `view_role_users_permission`: Grants permission to view role users for the client.

### **Channels**

A `channel` represents a communication topic within a **domain**.

#### Channel Relations

- `domain`: Associates a channel with a **domain**.
- `parent_group`: Associates a channel with a **group**.

#### Channel Permissions

- `update_permission`: Allows updating a channel.
- `read_permission`: Allows reading channel details.
- `delete_permission`: Allows deleting a channel.
- `set_parent_group_permission`: Allows setting the parent group of a channel.
- `connect_to_client_permission`: Allows connecting a client to a channel.
- `publish_permission`: Grants permission to publish messages to a channel.
- `subscribe_permission`: Grants permission to subscribe to a channel.
- `manage_role_permission`: Grants permission to manage roles for the channel.
- `add_role_users_permission`: Grants permission to assign users to channel roles.
- `remove_role_users_permission`: Grants permission to remove users from channel roles.
- `view_role_users_permission`: Grants permission to view role users for the channel.

### **Groups**

A `group` is a hierarchical structure that organizes **clients** and **channels** within a **domain**.

#### Group Relations

- `domain`: Associates a group with a **domain**.
- `parent_group`: Associates a group with another **group**.

#### Group Permissions

- `subgroup_create_permission`: Allows creating a subgroup within a group.
- `subgroup_update_permission`: Allows updating subgroup details.
- `subgroup_read_permission`: Allows reading subgroup details.
- `subgroup_delete_permission`: Allows deleting a subgroup.
- `subgroup_set_parent_permission`: Allows setting a subgroup's parent group.
- `subgroup_set_child_permission`: Allows adding a subgroup to a parent group.
- `manage_role_permission`: Grants permission to manage group-related roles.
- `add_role_users_permission`: Grants permission to assign users to group roles.
- `remove_role_users_permission`: Grants permission to remove users from group roles.
- `view_role_users_permission`: Grants permission to view users in group roles.

### **Domains**

A `domain` represents an independent namespace within the system.

#### Domain Relations

- `organization`: Associates a domain with an **organization**.
- `team`: Associates a domain with a **team**.

#### Domain Permissions

- `update_permission`: Allows updating domain details.
- `read_permission`: Allows reading domain details.
- `enable_permission`: Allows enabling a domain.
- `disable_permission`: Allows disabling a domain.
- `delete_permission`: Allows deleting a domain.
- `manage_role_permission`: Grants permission to manage domain roles.
- `add_role_users_permission`: Grants permission to assign users to domain roles.
- `remove_role_users_permission`: Grants permission to remove users from domain roles.
- `view_role_users_permission`: Grants permission to view users in domain roles.

### **Teams**

A `team` is a structured unit within an **organization** that can manage domains, groups, channels, and clients.

#### Team Relations

- `organization`: Associates a team with an **organization**.
- `parent_team`: Associates a team with another **team**.

#### Team Permissions

- `delete_permission`: Allows deleting a team.
- `update_permission`: Allows updating team details.
- `read_permission`: Allows reading team details.
- `set_parent_permission`: Allows setting the parent team.
- `set_child_permission`: Allows assigning a sub-team to a parent team.
- `manage_role_permission`: Grants permission to manage team-related roles.
- `add_role_users_permission`: Grants permission to assign users to team roles.
- `remove_role_users_permission`: Grants permission to remove users from team roles.
- `view_role_users_permission`: Grants permission to view users in team roles.

### **Organizations**

An `organization` represents the top-level entity that manages **teams, domains,** and **users**.

#### Organizations Relations

- `platform`: Associates an organization with the platform.
- `administrator`: Represents the administrator of the organization.

#### Organizations Permissions

- `admin`: Grants full administrative access.
- `delete_permission`: Allows deleting an organization.
- `update_permission`: Allows updating organization details.
- `read_permission`: Allows reading organization details.
- `membership`: Allows managing organization membership.
- `team_create_permission`: Allows creating teams within the organization.
- `manage_role_permission`: Grants permission to manage organization-wide roles.
- `add_role_users_permission`: Grants permission to assign users to organization roles.
- `remove_role_users_permission`: Grants permission to remove users from organization roles.
- `view_role_users_permission`: Grants permission to view users in organization roles.

### **Platform**

A `platform` is the highest-level entity that manages multiple organizations.

#### Platform Relations

- `administrator`: Represents a platform administrator.
- `member`: Represents a user who is a part of the platform.

#### Platform Permissions

- `admin`: Grants full administrative access.
- `membership`: Allows managing platform membership.
