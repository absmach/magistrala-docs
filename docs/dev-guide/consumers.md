---
title: Consumers
---


The **Consumers Service** in Magistrala handles the processing, storage, and notification of messages received from various channels. It is divided into two primary groups:

- **Writers:** Responsible for storing data in databases like TimescaleDB and PostgreSQL.
- **Notifiers:** Send notifications via channels like SMTP, SMPP, etc.

Consumers process messages in two primary ways:

- **Blocking Consumers:** Synchronously process messages (e.g., store data in a database).
- **Async Consumers:** Asynchronously process messages (e.g., send notifications).

## Writers

Writers are responsible for persisting messages into databases for storage, analysis, and future retrieval. Magistrala supports two primary database writers:

### **TimescaleDB Writer**

Stores messages into TimescaleDB with optimized handling for time-series data.
This makes it ideal for IoT applications where devices generate continuous streams of timestamped data (like sensor readings).

#### **Key Features of the TimescaleDB writer**

- **SenML Data Handling:** Inserts SenML messages with detailed timestamps.
- **JSON Data Handling:** Dynamically creates tables if they don’t exist.

For example:

```go
import "github.com/absmach/supermq/consumers/timescale"

db := // initialize your TimescaleDB connection
consumer := timescale.New(db)
consumer.ConsumeBlocking(ctx, messages)
```

### **PostgreSQL Writer**

Persists messages in PostgreSQL databases, using UUIDs for unique identification.
It is a general-purpose relational database storage for structured data. It's widely adopted for its reliability and strong transactional support.

#### **Key Features of the PostgreSQL writer**

- **Auto Table Creation:** Creates tables on-the-fly when missing.
- **Transaction Safety:** Ensures data integrity using transactions, with rollback support in case of errors.

For example:

```go
import "github.com/absmach/supermq/consumers/postgres"

db := // initialize your PostgreSQL connection
consumer := postgres.New(db)
consumer.ConsumeBlocking(ctx, messages)
```

## Notifiers

Notifiers are responsible for sending real-time alerts or notifications when specific conditions are met. They ensure that critical messages reach users or systems promptly.

### **SMTP Notifier**

Sends email notifications based on incoming messages, ideal for system alerts, reports, or status updates.
Email is universally supported, making it a reliable method for sending critical notifications to users worldwide. It is useful for automated alerts in monitoring systems, such as error reports, status changes, or threshold breaches.

#### **Key Features of the SMTP Notifier**

- **Rich Content:** Customizable email content templates.
- **Error Handling:** Robust error reporting for failed deliveries.

For example:

```go
import "github.com/absmach/supermq/consumers/notifiers/smtp"

agent := // initialize SMTP agent
notifier := smtp.New(agent)
notifier.Notify("from@example.com", []string{"to@example.com"}, message)
```

### **SMPP Notifier**

Sends SMS notifications via the SMPP (Short Message Peer-to-Peer) protocol, commonly used for high-throughput SMS delivery.

SMS has high open rates and is effective for time-sensitive alerts like OTPs, system failures, or emergency notifications. It also works across different mobile networks, enabling communication with users in remote or offline areas.

#### **Key Features of the SMPP Notifier**

- **Delivery Reports:** Supports message tracking.
- **International Support:** Handles different encoding formats.

For example:

```go
import "github.com/absmach/supermq/consumers/notifiers/smpp"

config := smpp.Config{Address: "smpp.server.com", Username: "user", Password: "pass"}
notifier := smpp.New(config)
notifier.Notify("1234", []string{"5678"}, message)
```

## Subscriptions API

The Subscriptions API in Magistrala allows users to manage subscriptions, enabling selective notifications based on specific topics.

A subscrription is usually of the format:

```go
// Subscription represents a user Subscription.
type Subscription struct {
 ID      string
 OwnerID string
 Contact string
 Topic   string
}
```

### **Create a Subscription**

Creates a new subscription give a topic and contact.

```bash
curl -X POST http://localhost:8000/subscriptions -H "Authorization: Bearer <token>" -d '{"contact": "user@example.com", "topic": "alerts"}'
```

### **View Subscription**

Retrieves a subscription with the provided id.

```bash
curl -X GET http://localhost:8000/subscriptions/<id> -H "Authorization: Bearer <token>"
```

Expect the response to be of the format:

```json
{
  "id": "01EWDVKBQSG80B6PQRS9PAAY35",
  "owner_id": "18167738-f7a8-4e96-a123-58c3cd14de3a",
  "topic": "topic.subtopic",
  "contact": "user@example.com"
}
```

### **List Subscriptions**

List subscriptions given list parameters.

```bash
curl -X GET http://localhost:8000/subscriptions -H "Authorization: Bearer <token>"
```

Optional Query Parameters:

- `?topic=alerts` - Filter subscriptions by topic.
- `?offset=0&limit=10` - For pagination.

An example with filters:

```bash
curl -X GET "http://localhost:8000/subscriptions?topic=alerts&limit=5" \
  -H "Authorization: Bearer <token>"
```

Expect the response to be of the format:

```json
{
  "subscriptions": [
    {
      "id": "01EWDVKBQSG80B6PQRS9PAAY35",
      "owner_id": "18167738-f7a8-4e96-a123-58c3cd14de3a",
      "topic": "topic.subtopic",
      "contact": "user@example.com"
    }
  ],
  "total": 0,
  "offset": 0,
  "limit": 0
}
```

### **Remove a Subscription**

Delete a subscription using its ID. This will stop notifications for the specific topic.

```bash
curl -X DELETE http://localhost:8000/subscriptions/<subscription_id> \
  -H "Authorization: Bearer <token>"
```
