---
title: Clients
---

**A Client** in Magistrala can be a **device** or an **application** that can be used to publish or subscribe to messages.

## Create a Client

To create a client, click on the `+ Create` button present on the top-left corner of the page. You can also create multiple clients by clicking on the `+ Create Clients` button and uploading a _.csv_ file with client **names** and any other fields you would like to add.

![Create client](../../img/clients/client-create-buttons.png)

### Client Information

Add a client **_name_** and optionally a **_key_** (has to be unique), **_tags_** and **_metadata_**.

![Client information](../../img/clients/client-create.png)

The client **key** will be used to authorize the device to send messages.

### Bulk Creation

You can be able to create clients in bulk by uploading a _.csv_ file with the following fields in order:

1. Name (Required)
2. Secret
3. Tags
4. Metadata

A sample of the _.csv_ file can be found [here](https://github.com/absmach/magistrala-ui/blob/main/samples/clients.csv).

![Bulk create clients](../../img/clients/clients-bulk-create.png)

## View a Client

After creating a client, you will be able to see the created client on the clients table. To view that client click on the **row** or the **view** button in the row actions

![View client](../../img/clients/client-view.png)

This will lead you to the client configuration page, where you can view all the client details.

![View client configurations](../../img/clients/client-view-config.png)

## Configurations

This page consists of key information relating to the specific Client which can be retrieved in an instance. There are fields such as Tags and Metadata that assist in further classification and search functionalites for the clients.

### Client Configuration

This section enables a user to update the following client details:

1. Name
2. Client Key
3. Tags
4. Metadata
5. Status

To update a field, click on the `pencil` icon on the far end of the field to edit. Once you have updated the value, click on the `check` icon to update the changes or the `cross` icon to cancel the change. To update the client status, toggle the switch on the far end of the status field.
Metadata MUST be a valid JSON object to be considered valid. Tags require the user to click `Enter` after each tag to have the entry recognised as valid Tag.

![Edit client](../../img/clients/client-edit-config.png)

<!-- ### Bootstrap Configuration

Bootstrap configuration of a client allows bootstrapping of the device (self-starting process that proceeds without external input). Further details of bootstrapping are discussed in the [Bootstrap section](bootstraps.md).

To add a bootstrap configuration, click on the `Add Configuration` button.

![Add bootstrap configuration](../../img/clients/client-bootstrap-button.png)

A dialog box will appear allowing you to enter the following fields

1. Name (required) - A unique name for the bootstrap configuration
2. External ID (required)
3. External Key (required)
4. Channels (required) - The channels the client will connect to.
5. Content (optional)
6. Encryption Settings (optional)
   - Client Cert
   - Client Key
   - CA Cert

![Bootstrap configuration dialog](../../img/clients/client-bootstrap-dialog.png) -->

## Connect to a Channel

Navigate to the `Connections` section of the client navigation. This will lead you to the connections page where you can view the channels a client is connected to.

![Connections page](../../img/clients/client-connections.png)

In this page you are able to add a connection by clicking on the `Connect` button on the top right corner.

This opens up a dialog box that allows you to select the channels you want to connect to and with which connection type. A client can have both connection types selected.  
There are two connection type options:

1. **Publish**: Allows the client to send messages in the channel
2. **Subscribe**: Allows the client to read messages in the channel

![Connect channel](../../img/clients/client-connect-channel.png)

To disconnect from the channel, click on the `Disconnect` button at the end of the channel row.

![Disconnect channel button](../../img/clients/client-disc-channel.png)

This will open up a dialog that allows you to select which connection type you want to remove. You can remove one or both of the connection types if you have multiple.

![Disconnect channel dialog](../../img/clients/client-disc-channel-dialog.png)

## Client Roles

Roles allow you to group a specific set of actions and allocate them to users.
To create a role, navigate to the roles section on the client navbar. Click on the `+ Create` button and provide a role name. The actions and members are optional fields.

![Create client role](../../img/clients/client-roles.png)

### Role Information

![Client role information](../../img/clients/client-role-create.png)

The role name is complusory. You can optionally provide the role actions by selecting from the available actions. You can also optionally provide the members by searching for a user with their **username**.

The following is the list of available actions for a client:

- update
- read
- delete
- set_parent_group
- connect_to_channel
- manage_role
- add_role_users
- view_role_users
- remove_role_users

#### Update Client Roles

Clicking the Role in the Role Table leads to the individual Role Page. Here there are two tables for the Role Actions and the assigned Role Members.

To update a role name, click on the `pencil` icon on the far right end of the field, update the value then click on the `tick` icon to update the changes or the `cross` icon to cancel the changes.

![Update role name](../../img/clients/client-update-role.png)

To update the **Role Actions** click on the `pencil` icon, it will pop up a dialog box allowing you to select the actions and users you want to add.

![Update role actions](../../img/clients/client-update-role-actions.png)

To update the **Role Members**, click the `Add Members` button. A popup dialog will appear with the list of Domain Members from which a user can select.

![Update role members](../../img/clients/client-role-update-members.png)

#### Delete Client Roles

You can also delete actions and members by clicking on the `trash` icon. It pops up a dialog that allows you to select which action you want to remove. There is also an option for clearning the whole list if that is needed as well.

![Delete role actions](../../img/clients/client-role-delete-actions.png)

When it comes to **Role Members** , you can clear the whole table with the `Delete All Members` which will lead to this alert dialog:

![Delete All Role Members](../../img/clients/clients-delete-all-role-members-dialog.png)

To delete specific members from the Role Members Table, click on the `trash` icon.

![Delete role members](../../img/clients/client-delete-role-members.png)

## Client Members

While we can create new members from the **Roles** section alongside the new roles actions, we can also assign members to the client through the **Members** Section.

Clicking on the `Assign Member` button will open a dialog box that allows the user to select amongst the Domain Members present as well as the Roles present in the Client.

![Assign Members](../../img/clients/client-members.png)

## Audit Logs

Audit logs track all **client-related events**, including creation, updates, role changes, and connection activity.

Each log entry displays the **operation type**, a **timestamp**, and optional **details** for deeper inspection.

You can search logs by operation type using the search input above the log table.

The most recent operations—such as `client.view`, `client.create`, and `channel.connect`—are displayed at the top.

![Client Audit Logs](../../img/clients/client-auditlogs.png)
