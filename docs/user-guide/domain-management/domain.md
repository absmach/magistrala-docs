---
title: Domain
---

## Domain Information

Navigate to the `Domain` section in the side navigation under **Domain Management** to find out more about the domain.

Here, a user can edit the Domain **Name**, **Tags**, **Metadata** and **Logo** as well as copy the Domain ID and **Route**.

The Domain status can be disabled by clicking the `Disable` button or enabled by the `Enable` button. Disabling the domain will revoke access for users who aren't domain admins.

![Domain Info](../../img/domain/domain-info.png)

## Domain Roles

From the roles section of the domain, the user can create new roles with varying role actions.

By default, an admin role with complete control over the domain is always present and granted to the Domain creator.

![Domain Roles](../../img/domain/roles.png)

Here's a comprehensive list of domain role actions:

- **Domain Management**

  - update
  - enable
  - disable
  - read
  - delete

- **Role Management**

  - manage_role
  - add_role_users
  - remove_role_users
  - view_role_users

- **Client Management**

  - client_create
  - client_update
  - client_read
  - client_delete
  - client_set_parent_group
  - client_connect_to_channel
  - client_manage_role
  - client_add_role_users
  - client_remove_role_users
  - client_view_role_users

- **Channel Management**

  - channel_create
  - channel_update
  - channel_read
  - channel_delete
  - channel_set_parent_group
  - channel_connect_to_client
  - channel_publish
  - channel_subscribe
  - channel_manage_role
  - channel_add_role_users
  - channel_remove_role_users
  - channel_view_role_users

- **Group Management**

  - group_create
  - group_update
  - group_read
  - group_delete
  - group_membership
  - group_set_child
  - group_set_parent
  - group_manage_role
  - group_add_role_users
  - group_remove_role_users
  - group_view_role_users

To create a new role, click on the `+ Create` button, provide a descriptive name for the role, and optionally add users and actions

![Create Domain Role](../../img/domain/create-role.png)

Once created, domain roles can be edited in their respective pages.
Users can edit the domain role name, role actions, and role members.

![Domain Role Page](../../img/domain/domain-role-id.png)

These fields can be updated directly on the page or via the dropdown menu options.
![Domain Action Buttons](../../img/domain/role-actions.png)

## Domain Members

A domain admin or a member with the right permissions can assign users to a domain.
Members must be assigned specific roles.
Domain members have permissions over different entities depending on the role assigned to them. For example, members without read permissions aren't able to view specific entities within the domain.

### Assign Users

To assign a user to a domain, click the `Assign User` button, and then select a user along with their respective roles.
Alternatively, the user can be added while creating the domain role.

![Assign User Button](../../img/domain/assign-user.png)

![Assign User Form](../../img/domain/assign-user-form.png)

### Unassign Users

To unassign a user click the `trash` icon on the member row to be unassigned and confirm the action.

![Unassign User Button](../../img/domain/unassign-user.png)
