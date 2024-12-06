---
sidebar_position: 15
---

# LoRa

Bridging with LoRaWAN Networks can be done over the [lora-adapter][lora-adapter]. This service sits between SuperMQ and [LoRa Server][lora-server] and just forwards the messages from one system to another via MQTT protocol, using the adequate MQTT topics and in the good message format (JSON and SenML), i.e. respecting the APIs of both systems.

LoRa Server is used for connectivity layer. Specially for the [LoRa Gateway Bridge][lora-gateway] service, which abstracts the [SemTech packet-forwarder UDP protocol][semtech] into JSON over MQTT. But also for the [LoRa Server][lora-server] service, responsible of the de-duplication and handling of uplink frames received by the gateway(s), handling of the LoRaWAN mac-layer and scheduling of downlink data transmissions. Finally the [Lora App Server][lora-app-server] services is used to interact with the system.

## Run Lora Server

Before to run the `lora-adapter` you must install and run LoRa Server. First, execute the following command:

```bash
go get github.com/brocaar/loraserver-docker
```

Once everything is installed, execute the following command from the LoRa Server project root:

```bash
docker-compose up
```

**Troubleshouting:** SuperMQ and LoRa Server use their own MQTT brokers which by default occupy MQTT port `1883`. If both are ran on the same machine different ports must be used. You can fix this on SuperMQ side by configuring the environment variable `MG_MQTT_ADAPTER_MQTT_PORT`.

## Setup LoRa Server

Now that both systems are running you must provision LoRa Server, which offers for integration with external services, a RESTful and gRPC API. You can do it as well over the [LoRa App Server][lora-app-server], which is good example of integration.

- **Create an Organization:** To add your own Gateways to the network you must have an Organization.
- **Create a Network:** Set the address of your Network-Server API that is used by LoRa App Server or other custom components interacting with LoRa Server (by default loraserver:8000).
- **Create a Gateways-Profile:** In this profile you can select the radio LoRa channels and the LoRa Network Server to use.
- **Create a Service-profile:** A service-profile connects an organization to a network-server and defines the features that an organization can use on this Network-Server.
- **Create a Gateway:** You must set proper ID in order to be discovered by LoRa Server.
- **Create an Application:** This will allows you to create Devices by connecting them to this application. This is equivalent to Devices connected to channels in SuperMQ.
- **Create a Device-Profile:** Before creating Device you must create Device profile where you will define some parameter as LoRaWAN MAC version (format of the device address) and the LoRaWAN regional parameter (frequency band). This will allow you to create many devices using this profile.
- **Create a Device:** Finally, you can create a Device. You must configure the `network session key` and `application session key` of your Device. You can generate and copy them on your device configuration or you can use your own pre generated keys and set them using the LoRa App Server UI.
  Device connect through OTAA. Make sure that loraserver device-profile is using same release as device. If MAC version is 1.0.X, `application key = app_key` and `app_eui = deviceEUI`. If MAC version is 1.1 or ABP both parameters will be needed, APP_key and Network key.

## SuperMQ and LoRa Server

Once everything is running and the LoRa Server is provisioned, execute the following command from SuperMQ project root to run the lora-adapter:

```bash
docker-compose -f docker/addons/lora-adapter/docker-compose.yml up -d
```

**Troubleshouting:** The lora-adapter subscribes to the LoRa Server MQTT broker and will fail if the connection is not established. You must ensure that the environment variable `MG_LORA_ADAPTER_MESSAGES_URL` is propertly configured.

**Remark:** By defaut, `MG_LORA_ADAPTER_MESSAGES_URL` is set as `tcp://lora.mqtt.supermq.io:1883` in the [docker-compose.yml][lora-docker-compose] file of the adapter. If you run the composition without configure this variable you will start to receive messages from our demo server.

### Route Map

The lora-adapter use [Redis][redis] database to create a route map between both systems. As in SuperMQ we use Channels to connect Things, LoRa Server uses Applications to connect Devices.

The lora-adapter uses the matadata of provision events emitted by SuperMQ system to update his route map. For that, you must provision SuperMQ Channels and Things with an extra metadata key in the JSON Body of the HTTP request. It must be a JSON object with key `lora` which value is another JSON object. This nested JSON object should contain `app_id` or `dev_eui` field. In this case `app_id` or `dev_eui` must be an existent Lora application ID or device EUI:

**Channel structure:**

```json
{
  "name": "<channel name>",
  "metadata:": {
    "lora": {
      "app_id": "<application ID>"
    }
  }
}
```

**Thing structure:**

```json
{
  "type": "device",
  "name": "<thing name>",
  "metadata:": {
    "lora": {
      "dev_eui": "<device EUI>"
    }
  }
}
```

#### Messaging

To forward LoRa messages the lora-adapter subscribes to topics `applications/+/devices/+` of the LoRa Server MQTT broker. It verifies the `app_id` and the `dev_eui` of received messages. If the mapping exists it uses corresponding `Channel ID` and `Thing ID` to sign and forwards the content of the LoRa message to the SuperMQ message broker.

[lora-adapter]: https://github.com/absmach/supermq/tree/main/lora
[lora-server]: https://www.loraserver.io
[lora-gateway]: https://www.loraserver.io/lora-gateway-bridge/overview/
[semtech]: https://github.com/Lora-net/packet_forwarder/blob/master/PROTOCOL.TXT
[lora-app-server]: https://www.loraserver.io/lora-app-server/overview/
[lora-docker-compose]: https://github.com/absmach/supermq/blob/master/docker/addons/lora-adapter/docker-compose.yml
[redis]: https://redis.io/
