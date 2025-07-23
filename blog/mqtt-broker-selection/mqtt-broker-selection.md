# MQTT Broker Selection
## Introduction
SuperMQ promises to be distributed, highly scalable and secure open-source cloud platform. Remember this it will be useful for later. One of thekey pillars of the platform is its multiprotocol support. One possible usecase of the platform would be in the ever growing field of IOT(Internet of Things) and it would be remiss if it did not support one of the most popular protocol in the field, MQTT. To achieve this we had to select an MQTT broker that would work under the hood. The following is a summary of what we considered and eventually who we considered as our broker of choice.

## The contenders
Based on popularity and size we can narrow down the search for a broker into the following:
1. EMQX
2. Mosquitto
3. NanoMQ
4. VerneMQ

The above represent the brokers with the most influence in the open source community based on their Github stars and contributions.
As SuperMQ also has an internal message broker two more contenders are introduced which are primarily message brokers but offer support for MQTT

5. RabbitMQ
6. NATS

## The criteria
To choose  broke a set of analytical criteria can be set in place to evaluate the choice of brokers. For our consideration we will define the following:

### Distribution and licensing

SuperMQ is an open source project licensend under Apache 2.0, therefore any broker we use for our infrastructure should have the same commitment to open source. From the list of our contenders, RabbitMQ, VerneMQ and NATS have an Apache 2.0 license.Though VerneMQ have restrictions on redistributing the docker image as detailed in the [EULA](https://vernemq.com/end-user-license-agreement). NanoMQ has the MIT license which is as permissive as the Apache license but not as explicit. Mosquitto has an Eclipe sula license and EMQX has a Business Source License. These can be limiting to distribution.In the case of SuperMQ it would have to be a point in favour of the projects with Apache and MIT licenses.

### MQTT protocol compliance and features

The MQTT protocol has features set out by the [MQTT specifications](https://mqtt.org/mqtt-specification/)
The broker should offer support for various versions of MQTT(v3.1, v3.1.1 and v5) Furthermore the broker should offer support for varous levels of QoS(Quality of Service), Retained Messages and Last Will and Testament(LWT)

| Feature Area | Mosquitto | EMQX | VerneMQ | RabbitMQ  |NanoMQ|NATS|
|--------------|-------------------|------|---------|-----------|----|----|
|**MQTT Protocol Support** |5.0, 3.1.1, 3.1 |5.0, 3.1.1, 3.1 |5.0, 3.1.1, 3.1 | 5.0, 3.1.1, 3.1| 5.0, 3.1.1|   3.1.1 |
| **Quality of Service (QoS)** | QoS 0, 1, 2 | QoS 0, 1, 2 | QoS 0, 1, 2 | QoS 0, 1 | QoS 0, 1, 2 | QoS 0, 1, 2 |
| **Retained Messages & LWT**  | Yes| Yes | Yes| Yes|Yes|Yes|
| **MQTT over WS** | Yes| Yes | Yes| Yes|Yes|Yes|

From the above there is little to separate the brokers, each having a strong implementation of the specifications. However, NATS stands out because of it lack of support for MQTT v 5.0 and RabbitMQ for its lack of support of QoS 2.

### Performance
This can be characterized by the number of connections supported, message throughput and latency. This stands as a key metric of making SuperMQ highly perfomant.

| Performance metric            | Mosquitto      | EMQX | VerneMQ | RabbitMQ  |NanoMQ|NATS|
|-------------------------------|----------------|------|---------|-----------|----|----|
|**No of connections per node** |100k|4M |1M | 5.0, 3.1.1, 3.1|100k|   3.1.1 |
| **Msg throughput per node**   | QoS 0, 1, 2 | QoS 0, 1, 2 | QoS 0, 1, 2 | QoS 0, 1 | QoS 0, 1, 2 | QoS 0, 1, 2 |
| **Latency**                   | Yes| Yes | Yes| Yes|Yes|Yes|
4. Scalability
The broker should offer high availabilty and clustering, all this while maintaining effecient resource consumption.
5. Security
The broker should offer inbuild or pluggable options for Authentication and Authorization. The broker should also offer support for encryption
6. Management and monitoring
The broker should have inbuilt or have plugin in support for observability, metric and logging.

