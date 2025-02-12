---
title: Messaging
---

Magistrala CLI enables seamless messaging over HTTP, allowing clients to **send** and **read** messages through channels. This guide covers the key commands for managing messages effectively.

## Send Messages

To send a message over HTTP, specify the **channel ID**, the **message payload (JSON format)**, and the **client's secret**.

```bash
magistrala-cli messages send <channel_id.subtopic> <JSON_string> <client_secret>
```

> ⚠️ **Note:** The JSON payload must follow the [SenML format](https://tools.ietf.org/html/rfc8428) for consistency.  

### **Message Payload Example**

The following is a sample payload to send multiple readings from two devices:

```json
[{"bn":"some-base-name:","bt":1.276020076001e+09, "bu":"A","bver":5, "n":"voltage","u":"V","v":120.1}, {"n":"current","t":-5,"v":1.2}, {"n":"current","t":-4,"v":1.3}]
```

- **`bn`**: Base Name (device identifier)  
- **`n`**: Name of the sensor/metric  
- **`v`**: Value of the reading  

## Read Messages

To read messages from a channel over HTTP, specify the **channel ID**, the **user authentication token**, and optionally a **reader URL**.

```bash
magistrala-cli messages read <channel_id> <user_token> -R <reader_url>
```
