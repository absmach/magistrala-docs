# **Users Service**

Magistrala relies on the SuperMQ for this core service that deals with the creation, deletion, update and viewing of **Users**. As previously discussed, a user must have unique credentials ie `username` and `secret` as well as an `email address`

Users can have multiple roles that grant them permissions over devices, domains or channels in the platform.

To start off, create a new user in Magistrala. After cloning and launching Magistrala, head to `localhost:3000` for the Magistrala UI platform.

## User Client Platform

### Logging In

You will start by loging in with your email and password. For an initial login session without any users, you can use `admin@example.com` as the email address and `12345678`  as the password.

![Login](../img/users-guide/main-login.png)

This will log you in as a `Super Admin` with permissions over every component and service in the platform. A superadmin can log into any user's domain and manipulate their clients, channels, groups and more.

### Signing Up

To create a new user with `user` permissions, there is a **Register** page. While here, the new user must have both first and last names, a unique email address as well as a username.

![Sign Up](../img/users-guide/registeruser.png)

This new user will be logged in with their own unique authentication token. They can create as many domains as they wish once they land on the Domains Homepage.

![Domain Homepage](../img/users-guide/janedoe-domainshome.png)

Tokens tend to expire after some time which will lead to the user being kicked out of the session. Do not be alarmed if this happens. Simplu log in again through the Login page with the user's **username** or **email address** as well as password.

> **Note**: To activate the sending of emails the mailing functionality must be correctly set up in [Magistrala](https://github.com/absmach/magistrala/blob/main/docker/.env#L199-#L206). This will come in handy should a user forget their password.

Should you have forgotten your password, you can use the `forgot password` link that will lead you to this page where you enter your email and a reset password link is sent to your email.

### User Profile

A user has access to their own profile page from which they can update their preferences and details.

Clicking on the User icon at the bottom left when logged into a Domain or at the top right when not logged into any domain session opens a popover.
The menu on the popover depends on the role of the user. A normal user will have a shorter list with just their:

- profile
- domains
- logout

![User Popover](../img/users-guide/jdoe-popover.png)

Meanwhile an `admin` user will have:

- profile
- domains
- manage users
- platform management
- logout

![Admin Popover](../img/users-guide/admin-popover.png)

This is the profile page presented once clicked:

![Profile Tab 1](../img/users-guide/jdoe-profile.png)

The first tab allows a user to update their names as well as upload profile pictures as shown above.

The second tab is for security purposes and allows a user to update thei passwords. This is different from the `forgot password` functionality we went over. From here you simply have to input your current password which MUST pass the check, then add a new password and confirm that password.

![Profile Tab 2](../img/users-guide/jdoe-password-tab.png)

Ensure that you save your new settings before attempting to leave the page. This action will log you out of the session however and you will be required to log back in with a new token from the updated password.

There is a preferences tab which allows the user to set their own language and theme settings.

![Profile Tab 3](../img/users-guide/jdoe-preferences-tab.png)

Magistrala provides English, German and Serbian languages.

There are four themes to choose from as well.

![Themes](../img/users-guide/jdoe-themes-tab.png)

### User Management

We have been looking at a normal user's access into the platform. As a super admin, the user has far more range when it comes to the platform permissions.

For instance we already introduced the different popover that an admin posseses.

There is the User Management option for a Super Admin user. With this the user can view all the users present in the database.

Clicking on **Manage Users** leads you to the Users Table.

![Users Table](../img/users-guide/admin-users-table.png)

To create a User:

- Click on the `+ Create User` button.
- A dialog box will appear with a form requiring a **name**, **email address**, and **password**, all marked with asterisks.
- Users can have tags that help identify or group them. Metadata may include the UI theme and preferred language.

![Create A User](../img/users-guide/create-jdoe.png)

Multiple users can also be created via _CSV_ files added to the UI with the needed fields filled in as in the example provided in [samples](https://github.com/absmach/magistrala-ui/tree/main/samples).
An admin just has to click on the `+ Create Users` button which will bring up a dialog box that allows them to drag and drop the .csv file needed.

![Create Users](../img/users-guide/create-users.png)

Once created, users can be updated and assigned to various entities. On the **View User** page:

![View User](../img/users-guide/view-user.png)

- You can update the user's name, copy their ID, change their email address, metadata, and tags, or disable them.
- **Disabled** users remain in the database but are restricted in actions (e.g., cannot be added to a new domain).

A user assigned to a domain gets permissions based on their role:

- Users with `admin` permissions can edit, view, delete, and share any entities within the domain.
- Users with `member` permissions can only view entities and dashboards within the domain.

### Platform Management

This will lead you to a page with all the **Users**, **Domains** and **Billing Plans** present in the system.

As Admin level User, you can perform CRUD operations and manage the Domains and Billing Plans in the system. This will be discussed further in their respective chapters.

### Logging Out

Finally, there is the logout option which kills the current session and logs the user out.
This does not result in deletion of the user but will just redirect you to the main login page. Ensure any updated settings are saved before logging out.

This also comes in handy when the session has expired but you are still on either domains homepage or within a domain. Such a situation prevents the user from accessing any of the services and may lead to an error page with a _failed to perform authorisation_ error.

### Forgot Password

Should you have forgotten your password when logging in, you can use the `forgot password` link that will lead you to this page where you enter your email and a reset password link is sent to your email.

![Forgot Password](../img/users-guide/forgot-password.png)

> Always ensure you have set up your email as discussed before to ensure that the email is received.

The reset password link should have a new token that you can click on.

This will immediately redirect you to a **Reset Password** page where you will create a new password and confirm it. After a reset you can then be logged into the system with your new password.

## Domain Introduction

Once logged in, you will be redirected to the domain selection page.

A **Domain** is a workspace that contains Clients, Channels, Groups, Dashboards as well as Roles and Rules Engine Services. A user can create as many domains as they please. A **Super Admin** has access to all domains present in the system. But a **User** must be a member or creator of a domain to log into it.

Click on the `+ Create` button on the top right to create a new domain. Since multiple domains can have the same name, you must add an alias which will be a unique descriptor for the domain.

![Domain Create](../img/users-guide/jdoe-create-domain.png)

Once you create a domain, you are given administrator permission over the domain. You are able to perform all actions available over the domain and all the entities provisioned inside the domain. You can also assign or invite members to the domain with various levels of permissions.

We will delve deeper into Domains in another section. For now you need to be able to log into the Domain to move onto Groups.

## **Groups Service**

Once logged in, you will be directed to the **Homepage**. While here you can view all the available entities in the domain.

On the sidebar navigation, click on **Groups** under _Client Management_ section to be led into the groups page.

![Groups Page](../img/users-guide/jdoe-groups-page.png)

Groups are multiples of Users. By itself, the service can have domain members assigned to groups. These members will have all the roles and permissions that the group has over any other entity present in the group. This allows for ease of management of a multitude of Users.

A group follows the JSON format below:

```JSON
{
  "id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "name": "groupName",
  "domain_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "parent_id": "bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "description": "long group description",
  "metadata": {
    "role": "general"
  },
  "path": "bb7edb32-2eac-4aad-aebe-ed96fe073879.bb7edb32-2eac-4aad-aebe-ed96fe073879",
  "level": 2,
  "created_at": "2019-11-26 13:31:52",
  "updated_at": "2019-11-26 13:31:52",
  "status": "enabled"
}
```

The groupName does not have to be unique to the group and different groups can share names but its id is very unique.
A group has to be created once a user logs into a domain and it will be assigned the domains ID and will be restricted to that domain.
A user cannot share the group across domains.

### Creating a Group

To create a group, click on the `+ Create` button present on the top-left corner of the page. This will open a popover with all the required fields for a new group.

![Create Group](../img/users-guide/create-group-jdoe.png)

There is an option to add a parent to the group. This creates a hierachy. Permissions and roles can be shared down this heirachy.

You can also create multiple groups at the same time using a _.CSV_ file which has all the required fields correctly filled in. Click on the `Upload` button and add your csv file. Magistrala provides samples as shown on the popover.

![Create Groups](../img/users-guide/jdoe-groups-page.png)

### Viewing a Group

After creating a group, it will show up on the page as the first group created.

While on the View Group Page, you can edit the group name by clicking on the pencil Icon and saving your changes. The same can be done for the group description as well as Metadata.

![View Group](../img/users-guide/view-group.png)

> The family tree section shows a group's parent-child relationship:

- A group can have a **single parent**, placing it in a hierarchical level.
- A group without a parent is a **Level 1 group**, while one with a parent is **Level 2**.
- A group can have multiple child groups.

When using parent or child groups, ensure that the referenced groups already exist to avoid errors.

A group can alsp be diabled or enabled by anyone with `edit` privileges. This is just the change of state from 1 to 0 in the case of the disabling.

### Assigning Users to Groups

A user can assign and unassign users to a specific group and provide them with policies over the entities the groups has control over.
This just allows for a more streamlined approach to more than one user.
Members of the domain with edit, member and admin permissions usually are already assigned to the group. We will discuss more on these roles and policies in the **Roles** section later on.

A user can be a member of more than one group with different policies over each allowing an admin greater control over the users they have.

![View Group Users](../img/users-guide/group-view-users.png)

### Assigning Roles to Groups

A user can assign Roles created in the domain to certain groups. This can be done in the third tab of the groups page. These roles can vary depending on which role actions the user desires the group to have.

By default, the admin role is always present in the group for the admin user who created the group as well as the Super Admin.

![View Group Roles](../img/users-guide/group-view-roles.png)

You can create a new role and assign it to the group as well as assign a member to it upon creation.

This new role will be specific to the group entities and not visible outside the group.

![View Group Roles](../img/users-guide/group-view-roles-create.png)

We will discuss more on roles in the **Roles** section later on.

### Assigning Clients to Groups

Clients present in the domain can be assigned to the group.

A user can also create clients specific to the group while on the fourth tab of the view group page. Any group member can then have permissions over the client as specified by their roles.

![View Group Clients](../img/users-guide/group-view-clients-create.png)

### Assigning Channels to Groups

A user can create a channel or channels specific to the group while on the view group channels page. Any group member can then be specified to have certain roles over the channel.

![Assign Channel to Groups](../img/users-guide/group-view-channels-create.png)

### Audit Logs

Audit logs provide metrics for the groups and show every event the group goes through from creation to updates to disabling.
