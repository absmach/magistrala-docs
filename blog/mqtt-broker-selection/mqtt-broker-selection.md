# MQTT Broker Selection

## Introduction

SuperMQ promises to be a distributed, highly scalable and secure open-source cloud platform. Remember this, it will be useful for later. One of the key pillars of the platform is its multiprotocol support. One possible usecase of the platform would be in the ever growing field of IOT(Internet of Things). It would therefore be remiss if it did not support one of the most popular protocols in the field, MQTT. To achieve this we had to select an MQTT broker that would work under the hood. Following an analytcal review of the landscape we settled on [RabbitMQ](https://www.rabbitmq.com/). The following is a summary of what we considered and eventually why we chose our broker.

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

To choose a broker a set of analytical criteria were established. The main goal being to make sure we did not compromise the SuperMQ offering but instead enriched it. For our consideration we will define the following:

### Distribution and licensing

SuperMQ is an open source project licensend under Apache 2.0, therefore any broker we use for our infrastructure should have the same commitment to open source. 
From the list of our contenders, RabbitMQ, VerneMQ and NATS have an Apache 2.0 license.Though VerneMQ have restrictions on redistributing the docker image as detailed in the [EULA](https://vernemq.com/end-user-license-agreement). NanoMQ has the MIT license which is as permissive as the Apache license but not as explicit. Mosquitto has an Eclipe dual license and EMQX has a Business Source License. These can be limiting to distribution. In the case of SuperMQ it would have to be a point in favour of the projects with Apache and MIT licenses. This metric serves as a non-negotiable for our project.

### MQTT protocol compliance and features

The MQTT protocol has features set out by the [MQTT specifications](https://mqtt.org/mqtt-specification/)
We would like to offer support for various versions of MQTT(v3.1, v3.1.1 and v5). Furthermore we aim to offer support for various levels of QoS(Quality of Service), Retained Messages and Last Will and Testament(LWT)

| Feature Area                 | Mosquitto       | EMQX            | VerneMQ         | RabbitMQ        | NanoMQ      | NATS        |
| ---------------------------- | --------------- | --------------- | --------------- | --------------- | ----------- | ----------- |
| **MQTT Protocol Support**    | 5.0, 3.1.1, 3.1 | 5.0, 3.1.1, 3.1 | 5.0, 3.1.1, 3.1 | 5.0, 3.1.1, 3.1 | 5.0, 3.1.1  | 3.1.1       |
| **Quality of Service (QoS)** | QoS 0, 1, 2     | QoS 0, 1, 2     | QoS 0, 1, 2     | QoS 0, 1        | QoS 0, 1, 2 | QoS 0, 1, 2 |
| **Retained Messages & LWT**  | Yes             | Yes             | Yes             | Yes             | Yes         | Yes         |
| **MQTT over WS**             | Yes             | Yes             | Yes             | Yes             | Yes         | Yes         |

From the above there is little to separate the brokers, each having a strong implementation of the specifications. However, NATS stands out because of it lack of support for MQTT v 5.0 and RabbitMQ for its lack of support of QoS 2. For SuperMQ having the latest version of MQTT is a non-negiotable.

### Performance

This can be characterized by the number of connections supported, message throughput and latency. This stands as a key metric of making SuperMQ highly perfomant.

Performance data for a comparison between our contenders is obtained from a combination of third party evaluation of the brokers as well as vendor based benchmarks.
In terms of number of connections supported vendor based benchamrks put EMQX, VerneMQ and RabbitMQ in the millions range with EMQX having the edge with a reported support of 4M+ connections per node[1] [2].
Mosquitto and NanoMQ have lower connections per node numbers.
A third party benchmark puts the sustainable message throughput of EMQX at 28K messages per second while that of VerneMQ at 10k messages per second[3]. From Benchmark comparisons provided by EMQX, we can extrapolate that the message throughputs of NanoMQ and Mosquitto are lower than EMQX and VerneMQ [1].
A vendor based benchmark provided by RabbitMQ puts the message throughput 17K messages per second having an average forward latency of 2.880 milliseconds [2].
With VerneMQ and EMQX having a reported latency of 8.7 and 6.4 milliseconds per 1000 messages per second [3].
From vendor based benchmarks, NanoMQ is reported to have lower latency than EMQX and VerneMQ at lower number of active connections but higher latency at higher numbers of active connections [4].
The same benchmark puts the latency of Mosquitto to be higher than EMQX and NanoMQ.

It is at this point where it is important to note that NanoMQ was authored by EMQ technologies, the authors of EMQX, to be a fast and lightweight broker for the IOT edge.

Limited comparison benchmarks are available for NATS as an MQTT broker, we can attribute it to being less popular as compared to our other contenders as an MQTT broker.

With SuperMQ we wanted a highly performant broker and EMQX, VerneMQ and RabbitMQ seem to be top of the pile.

### Scalability

Here we were looking for a broker that offers high availabilty and clustering, all this while maintaining effecient resource consumption.

Two of our contenders fail at this point as Mosquitto and NanoMQ do not support clustering, which is important in our attempt to make a distributed and scalable platform.

EMQX natively supports clustering. VerneMQ is built as distributed message broker with master-less clustering technology based on Erlang distribution.RabbitMQ spports clustering as a logical grouping of nodes that share users,virtual hosts, queues, streams, exchanges, bindings, and other distributed state.

Each of our contenders boast of their high availabilty and fault tolerance.

In terms of resource consumption third party studies concur on Mosquitto being light weight with low RAM usage.The study highlights that VerneMQ and EMQX are similar in their CPU and memory use [5].

### Security

The broker should offer inbuild or pluggable options for Authentication and Authorization as well as support for TLS encryption.

All the contenders offer support for TLS/SSL.

EMQX, RabbitMQ, VerneMQ and NATS offer high pluggability when it comes to authentication and authorization.

This serves as nice to have as SuperMQ relies on [Mgate](https://github.com/absmach/mgate)for authentication and authorization for client connections.

### Management and monitoring

Support for observability and metrics is another must have for building this highly scalable platform.

EMQX, RabbitMQ, VerneMQ, NATS natively support export prometheus metrics.NanoMQ and Mosquitto do not support this natively but we have found third party extensions for this.

EMQX offers a web-based dashboard for monitoring of clusters.The dashboard is a nice to have but SuperMQ already has metrics visualization mehodologies.

All the brokers save for Mosquitto offer HTTP API for configuration and monitoring which is very nice.

In Mosquitto monitoring is mainly through its $SYS topic tree, users subscribe to standard MQTT clients for broker statistics and it relies on third-party tools for more advanced visualization.

## Conclusion

Chosing a broker for the platform is an important decision, one which has to be made analytical. In terms of performance, with the available information, RabbitMQ, VerneMQ and EMQX come up as favourites. As we would like a scalable solution we have to eliminate NanoMQ and Mosquitto. These brokers seem to be built to be performant on the edge. Finally our commitment to open source means we eliminate VerneMQ and EMQX.
RabbitMQ emerges as our choice. It has very good performance [6], is highly scalable and offers in built and pluggable management tools for monitoring and authorization. It is disappointing but not detrimental that it does not yet support QoS 2.

## References

1. [A comprehensive comparison of open source mqtt brokers](https://www.emqx.com/en/blog/a-comprehensive-comparison-of-open-source-mqtt-brokers-in-2023)
2. [Native mqtt in RabbitMQ](https://www.rabbitmq.com/blog/2023/03/21/native-mqtt)
3. [A Comparison of MQTT Brokers for Distributed IoT Edge Computing](https://link.springer.com/chapter/10.1007/978-3-030-58923-3_23#citeas)
4. [Open mqtt benchmarking comparison of mqtt brokers](https://www.emqx.com/en/blog/open-mqtt-benchmarking-comparison-mqtt-brokers-in-2023)
5. [Stress-Testing MQTT Brokers: A Comparative Analysis of Performance Measurements](https://www.mdpi.com/1996-1073/14/18/5817)
6. [Using IoT Protocols in Real-Time Systems: Protocol Analysis and Evaluation of Data Transmission Characteristics](https://onlinelibrary.wiley.com/doi/10.1155/2022/7368691)

[1]: https://www.emqx.com/en/blog/a-comprehensive-comparison-of-open-source-mqtt-brokers-in-2023
[2]: https://www.rabbitmq.com/blog/2023/03/21/native-mqtt
[3]: https://link.springer.com/chapter/10.1007/978-3-030-58923-3_23#citeas
[4]: https://www.emqx.com/en/blog/open-mqtt-benchmarking-comparison-mqtt-brokers-in-2023
[5]: https://www.mdpi.com/1996-1073/14/18/5817
[6]: https://onlinelibrary.wiley.com/doi/10.1155/2022/7368691
