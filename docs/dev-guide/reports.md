---
slug: supermq-coap-adapter
title: "SuperMQ CoAP Adapter: Building IoT Communication with Constrained Devices"
authors: steve
description: "A comprehensive guide to using SuperMQ's CoAP adapter for lightweight IoT communication - from device authentication to real-time data streaming with constrained devices."
tags:
  [
    iot,
    coap,
    constrained-devices,
    udp,
    golang,
    real-time,
    senml,
    message-broker,
    supermq
  ]
---

# SuperMQ CoAP Adapter: Building IoT Communication with Constrained Devices

## Introduction

IoT has changed how we connect to the physical world. From powerful edge computers to tiny battery-powered sensors, billions of devices now communicate with each other and the cloud. But here's the thing - HTTP, which works great for websites, is often too heavy for small IoT devices with limited power and bandwidth.

That's where CoAP comes in. CoAP (Constrained Application Protocol) was built specifically for these resource-constrained devices. It runs on UDP instead of TCP, making it much lighter than HTTP, while still keeping the useful REST-style features developers love. SuperMQ's CoAP adapter connects these small devices to the larger SuperMQ platform without breaking a sweat.

SuperMQ doesn't put all its eggs in one basket when it comes to protocols. You can use HTTP for web apps, MQTT for publish-subscribe messaging, WebSocket for real-time web communication, and CoAP for constrained devices. This means you can pick the right tool for each job while everything still plays nicely together.

This post walks through how SuperMQ's CoAP adapter works under the hood and shows you real examples of using it in your IoT projects.

## System Architecture

SuperMQ's CoAP adapter is built tough - it scales well, keeps things secure, and doesn't fall over when things get busy. Let's break down what makes it tick:

### Core Technologies

**Go-CoAP Library**: We use the [plgd-dev/go-coap](https://github.com/plgd-dev/go-coap) library as our foundation. It's fast and handles all the nitty-gritty CoAP details:
- Managing UDP messages and making sure they're reliable
- Parsing and checking CoAP options
- Implementing the Observe pattern for real-time updates
- Handling different content formats

**gRPC Integration**: For talking to other SuperMQ services, we use gRPC. It's type-safe and fast:
- **Clients Service**: Takes care of authentication and managing clients
- **Channels Service**: Handles permissions and channel stuff
- **Message Broker**: Routes messages through SuperMQ

**Message Broker Integration**: SuperMQ works with different message brokers (NATS, RabbitMQ) through a common interface, so messages get delivered reliably and pub/sub works smoothly.

### How It All Works

1. **Device Authentication**: When a CoAP device connects, the adapter grabs the auth key from the URL and checks it with the Clients service.

2. **Authorization**: Before allowing any publish or subscribe action, we double-check permissions through the Channels service. Only authorized devices get through.

3. **Message Processing**: 
   - **Publishing**: Messages get sent to the message broker for distribution
   - **Subscribing**: The adapter keeps connections alive and uses CoAP's Observe pattern for real-time updates

4. **Topic Mapping**: The adapter translates CoAP paths into SuperMQ's domain/channel/subtopic structure, keeping everything organized.

### Key Components

```
CoAP Client → CoAP Adapter → [Authentication] → [Authorization] → Message Broker → SuperMQ Ecosystem
                    ↓
              [Observe Handler] ← [Subscription Manager] ← [Real-time Updates]
```

The adapter handles several important things:
- **Connection Management**: Keeps track of device connections and handles disconnections gracefully
- **Error Handling**: Returns proper CoAP response codes when things go wrong
- **Observability**: Works with Prometheus metrics and Jaeger tracing for monitoring

## Examples

You'll need a CoAP client to try these examples. We'll use `coap-client` from the libcoap library.

### Installing CoAP Client

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install libcoap3-bin
```

**CentOS/RHEL/Fedora:**
```bash
# For CentOS/RHEL
sudo yum install libcoap
# For Fedora
sudo dnf install libcoap
```

**macOS:**
```bash
# Using Homebrew
brew install libcoap
```

**From Source:**
```bash
git clone https://github.com/obgm/libcoap.git
cd libcoap
./autogen.sh
./configure --enable-documentation=no --enable-tests=no
make
sudo make install
```

**Check if it worked:**
```bash
coap-client --help
```

Now let's look at some real examples of using SuperMQ's CoAP adapter.

### Example 1: Publishing Sensor Data

Here's how a temperature sensor would send data to SuperMQ:

```bash
# Publishing temperature data from a sensor
coap-client -m POST \
  -e '{"temperature": 23.5, "humidity": 45.2, "timestamp": "2025-07-31T10:30:00Z"}' \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/sensors/room1?auth={secretid}"
```

**Breaking down the URL**:
- `m/{domainid}`: Your domain ID
- `c/{channelid}`: Your channel ID  
- `sensors/room1`: Subtopic to organize your data
- `auth={secretid}`: Your authentication key

### Example 2: Publishing SenML Data

If you want to use the standard SenML format for sensor data:

```bash
# Publishing multiple sensor readings using SenML format
coap-client -m POST \
  -e '[{"bn":"device-001:","bt":1.276020076001e+09,"bu":"A","bver":5,"n":"voltage","u":"V","v":120.2},{"n":"current","t":-5,"v":1.27},{"n":"current","t":-4,"v":1.34}]' \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/power-meter?auth={secretid}"
```

**What those SenML fields mean**:
- `bn`: Device name
- `bt`: Base timestamp (Unix time)
- `bu`: Base unit
- `bver`: Version
- `n`: Measurement name
- `u`: Unit
- `v`: Value
- `t`: Time offset from base time

### Example 3: Getting Real-time Updates

CoAP's Observe pattern lets devices get real-time updates:

```bash
# Subscribe to temperature updates from a specific sensor
coap-client -m GET -s 60 \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/sensors/room1?auth={client-secret}"
```

The `-s 60` tells it to wait up to 60 seconds for updates.

### Example 4: Health Check

Want to see if the adapter is running okay?

```bash
# Check adapter health
coap-client -m GET \
  "coap://localhost:5683/hc"
```

You should get back something like:
```json
{
  "status": "ok",
  "protocol": "coap",
  "timestamp": "2025-07-31T10:30:00Z"
}
```

### Example 5: Publishing Binary Data

Sometimes you need to send images or other binary data:

```bash
# Publishing binary data from a camera sensor
coap-client -m POST \
  -f image.jpg \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/camera/entrance?auth={client-secret}"
```

### Example 6: Batch Data

For devices that collect data offline and send it all at once:

```bash
# Publishing batch sensor data
coap-client -m POST \
  -e '{"batch_id": "batch-001", "readings": [{"timestamp": "2025-07-31T10:00:00Z", "temp": 22.1}, {"timestamp": "2025-07-31T10:05:00Z", "temp": 22.3}, {"timestamp": "2025-07-31T10:10:00Z", "temp": 22.0}]}' \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/sensors/outdoor/batch?auth={client-secret}"
```

### When Things Go Wrong

SuperMQ logs detailed error information when things don't work as expected:

```bash
# Wrong auth key - results in authentication failure
coap-client -m POST \
  -e '{"temp": 25.0}' \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/temp?auth={invalid-key}"
```

**Error logged by SuperMQ:**
```json
{
  "time":"2025-08-05T10:46:42.250410473Z",
  "level":"WARN",
  "msg":"Publish message failed",
  "duration":"1.464074ms",
  "channel_id":"8207adbc-d0d9-4d25-af2a-7877a81fede7",
  "domain_id":"874ad840-bc04-4f6c-9a76-9948b047a15e",
  "subtopic":"temp",
  "error":"failed to perform authentication over the entity : failed to perform authorization over the entity : failed to perform authorization over the entity : entity not found"
}
```

```bash
# Wrong channel ID - results in authorization failure
coap-client -m POST \
  -e '{"temp": 25.0}' \
  "coap://localhost:5683/m/{domainid}/c/{unauthorized-channelid}/temp?auth={client-secret}"
```

**Error logged by SuperMQ:**
```json
{
  "time":"2025-08-05T10:52:37.892007878Z",
  "level":"WARN",
  "msg":"Publish message failed",
  "duration":"3.599247ms",
  "channel_id":"8207adbc-d0d9-4d25-af2a-7877a81fede8",
  "domain_id":"874ad840-bc04-4f6c-9a76-9948b047a15e",
  "subtopic":"temp",
  "error":"failed to perform authorization over the entity : failed to perform authorization over the entity : failed to perform authorization over the entity : entity not found"
}
```

```bash
# Using unsupported method (PUT) - no response returned
coap-client -m PUT \
  -e '{"temp": 25.0}' \
  "coap://localhost:5683/m/{domainid}/c/{channelid}/temp?auth={client-secret}"
```

**Behavior:** The adapter doesn't respond to unsupported HTTP methods. CoAP supports GET (for subscriptions) and POST (for publishing), but PUT requests are silently ignored.

## Conclusion

SuperMQ's CoAP adapter gives you a solid way to connect small IoT devices to serious messaging infrastructure. CoAP's lightweight design combined with SuperMQ's robust backend means you can build IoT solutions that scale from simple sensor networks to complex real-time monitoring systems.

Here's what you get:

1. **Efficiency**: CoAP uses UDP and compact messages, so your devices use less power and bandwidth
2. **Real-time**: The Observe pattern means devices get updates as they happen
3. **Security**: Built-in authentication and authorization keep your devices safe
4. **Scalability**: Uses proven tech like gRPC and message brokers that can handle serious load
5. **Standards**: Works with SenML and other IoT standards, so you're not locked in

Whether you're building smart home gadgets, industrial monitoring, or city-wide sensor networks, SuperMQ's CoAP adapter gives you a reliable foundation. The examples above should get you started with connecting your CoAP devices.

Ready to dive in? Check out the [SuperMQ documentation](https://docs.supermq.abstractmachines.fr/) and start connecting your IoT devices!
