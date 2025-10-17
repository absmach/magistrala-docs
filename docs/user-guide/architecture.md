---
title: Architecture
description: Discover the architecture behind Magistrala – an open-source, scalable IoT platform. Learn about its core components, domain model, messaging, and edge capabilities.
keywords:
  - Magistrala Architecture
  - IoT Middleware
  - Open Source IoT
  - Edge Computing
  - Messaging Backbone
image: /img/mg-preview.png
---

## Components

Magistrala IoT platform is comprised of the following services:

| Service                          | Description                                                                             |
| :------------------------------- | :-------------------------------------------------------------------------------------- |
| [mqtt-adapter][mqtt-adapter]     | Provides an MQTT and MQTT over WS interface for sending and receiving messages via MQTT |
| [magistrala-cli][magistrala-cli] | Command line interface                                                                  |
| [bootstrap][bootstrap]           | Provides basic configuration for newly created clients                                  |
| [consumers][consumers]           | An abstraction of SuperMQ consumers that receives messages                              |
| [email][email]                   | Magistrala Email Agent is used for sending emails                                       |
| [provision][provision]           | Provides a HTTP API to interact with SuperMQ and setup configurations                   |
| [rules-engine][rules-engine]     | Create rules using LUA script that process incoming messages                            |
| [readers][readers]               | Implement message readers ie Postgres and Timescale                                     |

![arch](../img/architecture.jpg)

## Domain Model

The platform is built upon [SuperMQ][supermq] which is built around 2 main entities: **users** and **clients**.

`User` represents the real (human) user of the system. Users are represented via their email address, first and last names, a unique username, and password used as their secret, which they use as platform access credentials in order to obtain an access token. Once logged into the system, a user can manage their resources (i.e. groups, clients and channels) in CRUD fashion and define access control policies by connecting them.

`Group` represents a logical grouping of users. It is used to simplify access control management by allowing users to be grouped together. When assigning a user to a group, we create a policy that defines what that user can do with the resources of the group through roles as well as specific role actions. This way, a user can be assigned to multiple groups, and each group can have multiple users assigned to it. Users in one group have access to other users in the same group as long as they have the required roles. A group can also be assigned to another group, thus creating a group hierarchy. When assigning a user to a group we create a policy that defines what that user can do with the group and other users in the group.

`Client` represents devices (or applications) connected to Magistrala that uses the platform for message exchange with other "clients".

`Channel` represents a communication channel. It serves as a message topic that can be consumed by all of the clients connected to it. It also servers as grouping mechanism for clients. A client can be connected to multiple channels, and a channel can have multiple clients connected to it. A user can be connected to a channel as well, thus allowing them to have an access to the messages published to that channel and also clients connected to that channel with the required policy. Both clients and users can be assigned to a channel. When assigning a client to a channel, we create a policy that defines what that client can do to the channel, for example reading or writing messages to it. When assigning a user to a channel, we create a policy that defines what that user can do with the channel and clients connected to it, hereby enabling the sharing of clients between users.

## Messaging

Magistrala uses [NATS][nats] as its default messaging backbone, due to its lightweight and performant nature. You can treat its _subjects_ as physical representation of Magistrala channels, where subject name is constructed using channel unique identifier. Magistrala also provides the ability to change your default message broker to [RabbitMQ][rabbitmq], [VerneMQ][vernemq] or [Kafka][kafka].

In general, there is no constrained put on content that is being exchanged through channels. However, in order to be post-processed and normalized, messages should be formatted using [SenML][senml].

## Edge

Magistrala platform can be run on the edge as well. Deploying Magistrala on a gateway makes it able to collect, store and analyze data, organize and authenticate devices. To connect Magistrala instances running on a gateway with Magistrala in a cloud we can use two gateway services developed for that purpose:

- [Agent][agent]
- [Export][export]

## Unified IoT Platform

Running Magistrala on gateway moves computation from cloud towards the edge thus decentralizing IoT system. Since we can deploy same Magistrala code on gateway and in the cloud there are many benefits but the biggest one is easy deployment and adoption - once engineers understand how to deploy and maintain the platform, they will be able to apply those same skills to any part of the edge-fog-cloud continuum. This is because the platform is designed to be consistent, making it easy for engineers to move between them. This consistency will save engineers time and effort, and it will also help to improve the reliability and security of the platform. Same set of tools can be used, same patches and bug fixes can be applied. The whole system is much easier to reason about, and the maintenance is much easier and less costly.

[mqtt-adapter]: https://github.com/absmach/magistrala/tree/main/tools/mqtt-benc
[magistrala-cli]: https://github.com/absmach/magistrala/tree/main/cli
[nats]: https://nats.io/
[rabbitmq]: https://www.rabbitmq.com/
[vernemq]: https://vernemq.com/
[kafka]: https://kafka.apache.org/
[senml]: https://tools.ietf.org/html/draft-ietf-core-senml-08
[agent]: ../dev-guide/edge.md
[export]: ../dev-guide/edge.md#export
[bootstrap]: https://github.com/absmach/magistrala/tree/main/bootstrap
[consumers]: https://github.com/absmach/magistrala/tree/main/consumers
[email]: https://github.com/absmach/magistrala/tree/main/internal/email
[provision]: https://github.com/absmach/magistrala/tree/main/provision
[rules-engine]: https://github.com/absmach/magistrala/tree/main/re
[readers]: https://github.com/absmach/magistrala/tree/main/readers
[supermq]: https://github.com/absmach/supermq
