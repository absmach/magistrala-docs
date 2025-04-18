---
title: Quick Start Guide
---

Magistrala leverages **SuperMQ** as the backbone for its **Services**, handling the creation, deletion, updating, and retrieval of user accounts, clients and channels.
Users in Magistrala must have **unique credentials**, including a `username`, `secret`, and `email` address upon creation.

This guide will take you through the core services for a quick set up of Magistrala and a walkthrough its services and components.

## **Sign Up**

To get started, create an account by providing the following details in the sign up page:

- **First and last name**
- **An email address**
- **A username**

![Sign Up](../img/users-guide/registeruser2.png)

Once registered, the user will be redirected to the **Domains Homepage**, where they can create and manage multiple domains.

![Domain Homepage](../img/users-guide/janedoe-domainshome.png)

## **Log In**

Incase you already have an account, you can log in with your email/username and password.

![Login](../img/users-guide/main-login.png)

## **Log into a Domain**

Upon logging in, users are redirected to the **Domain Selection Page**.

A **Domain** is a workspace that allows you to manage **Clients**, **Channels**, **Groups**, **Dashboards**, **Members**,  **Rules**  and **Bootstrap** services. A user can create as many domains as they please.

Click on the `+ Create` button on the top right to create a new domain. Since multiple domains can have the same name, you must add an **alias** which will be a unique descriptor for the domain.

![Domain Create](../img/users-guide/jdoe-create-domain.png)

Once you create a domain, you are given **admin** role over the domain by default. You are able to perform all actions available over the domain and all the entities provisioned inside the domain. You can also assign or invite members to the domain with various levels of permissions. Click on the respective card to log into a domain of your choice.

We will delve deeper into Domains in another section. For now you need to be able to log into a Domain to move on to **Groups**.

## **Create a Group**

Once logged in, you will be directed to the **Homepage** where you can view all the available entities in the domain.

On the sidebar navigation, click on **Groups** under the _Client Management_ section to be redirected to the groups page.

![Groups Page](../img/users-guide/jdoe-groups-page.png)

To create a group, click on the `+ Create` button present on the top-left corner of the page. This will open a popover with all the required fields for a new group.

![Create Group](../img/clients/group-information.png)

## **Create a Client**

A **Client** represents a device connected to Magistrala, capable of communication with other devices.

They are physical or virtual devices that can send and receive messages through **embedded systems**.

Any Client created while in the group can be connected to any channel within the group.

A **new client** can be created by navigating to the **Clients Page** section of the Group and clicking the `+ Create Client` button.
A dialog box will open, requiring fields such as **Name**.
You can add a unique key for the client, although one is automatically generated.
Additionally, **tags** can be assigned to Clients for better organization and filtering.

![Create Client](../img/users-guide/group-client-create.png)

A user can also create bulk clients by clicking on the `+ Create Clients` button. This will lead to a dialogbox that takes in a _.CSV_  file with the clients' details filled in correctly as seen in these [samples](https://github.com/absmach/magistrala-ui/tree/main/samples).

![Create Clients](../img/users-guide/group-clients-create.png)

### View a Client

Once created, a **group-client** can be viewed and updated in the unique Client's ID page.
To access the page, click on the Client in the Clients' table.

The client's data can be updated in this page and its ID copied as well.

![View Client](../img/users-guide/group-client-view2.png)

There **Connections** tab in the **group-client page** is where a User can connect a Client to a Channel.

## **Create a Channel**

Channels are considered as message conduits.

They are responsible for the messages exchange between Clients and act as message topic that can be be **published** or **subscribed** to by multiple Clients.

Each Client can **publish or subscribe** to a Channel, facilitating seamless device-to-device communication. Although subtopics can exist, they are not required for basic interactions.

To create a channel, navigate to the fourth tab under the groups and click on `+ Create`. This will open a dialog box which will take in a unique Channel name. Much like the Clients, clicking on `+ Create Channels` will allow a user to upload a _.CSV_ file with multiple channels.

![Create Group Channel](../img/users-guide/group-channel-create.png)

### View a Channel

After the Channel is created, clicking on it while it is on the Channel's table leads to the Channel View Page.

![View Group Channel](../img/users-guide/group-channel-view.png)

Clients can be connected to channels in groups. This is done in the **Connections** tab. There are two connection types:

- **Subscribe**
- **Publish**

![Connect Group Channel Clients](../img/users-guide/group-channel-connections.png)

## **Send a Message**

Once a Channel and Client are connected, a user is able to send messages. Navigate to the `Messages` tab of the Group-Channel and click on `Send Messages`.

![View Messages Page](../img/users-guide/group-messages-view.png)

This will open a dialog box where all the required fields bear an asterisk. Messages are sent via _HTTP_ protocol in the UI.

![Send Message](../img/users-guide/group-send-message.png)

Users can also send messages using curl commands for HTTP or via MQTT.  
Here are some examples:

**Using HTTP**:
```bash
curl -s -S -i --cacert docker/ssl/certs/ca.crt -X POST -H "Content-Type: application/senml+json" -H "Authorization: Client <client_secret>" https://localhost/http/m/<domain_id>/c/<channel_id> -d '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```

**Using MQTT**:
```bash
mosquitto_pub -u <client_id> -P <client_secret> -t m/<domain_id>/c/<channel_id> -h localhost -m '[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]'
```  

:::info

More information on how to send messages via the terminal can be found in the **Developer Docs**, under the **Messaging section** in **Developer Tools**.

:::    

  
The messages table will then update to include the message sent with the latest message appearing first.
Using the filter options, you can filter through a wide range of messages based on the protocol, publisher or even value.

![Messages Table](../img/users-guide/group-sent-messages-page.png)

> The download message feature is currently not active but will be with future iterations of Magistrala.

Some advanced filters allow you to filter based on which type of value you require such as boolean values or string values.
There is also a provision for time where the date-time picker allows you to select a date and input a specific time window.
You can also find aggregate values of messages provided you add an interval as well as a `From` and `To` time.
With these values you can get the `Maximum`, `Minimum`, `Average` and `Count` value of messages within a certain time period.
You can also be able to download a list of messages depenidng on any of the filters you need and view them in a `.csv` file.
Messages provide a core service for our IoT platform especially when it comes to the Dashboards service.
