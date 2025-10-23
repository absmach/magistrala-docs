---
title: Readers
description: Retrieve and query stored messages efficiently in Magistrala using TimescaleDB or PostgreSQL readers with filters, pagination and aggregation support.
keywords:
  - Readers
  - Messages
  - TimescaleDB
  - PostgreSQL
  - Query
  - Aggregation
  - Pagination
  - Magistrala
image: /img/mg-preview.png
---


The **Readers Service** in Magistrala provides functionality to read messages stored in the platform's databases. It supports querying and retrieving messages from databases like **TimescaleDB** and **PostgreSQL**, using flexible filtering and pagination mechanisms to meet diverse application needs.

The Readers service is designed to be efficient, scalable, and user-friendly, enabling users to retrieve messages through various protocols while maintaining consistency and reliability.

## Database Readers

The Readers service supports the following database types:

- **TimescaleDB Reader:** Optimized for time-series data.
- **PostgreSQL Reader:** Suited for general-purpose structured data.

Both readers implement the `MessageRepository` interface, allowing seamless integration into Magistrala's messaging infrastructure.

### TimescaleDB Reader

**TimescaleDB** is an open-source time-series database built on PostgreSQL, designed to handle high-volume time-series workloads efficiently. TimescaleDB can use **Aggregations**. For large datasets, use `aggregation` and `interval` parameters to reduce data volume.

#### Key Features

- **Time-based Aggregation:** Supports time-based aggregations using the `time_bucket` function.
- **SenML Message Support:** Optimized for SenML-formatted messages.
- **Dynamic Querying:** Supports filtering by various parameters like `subtopic`, `publisher`, `name`, and `time`.

#### How It Works

The `TimescaleDB Reader` fetches messages from the `messages` table based on the provided query parameters. It supports both plain and aggregated queries.

Here is the Database Schema:

```sql
CREATE TABLE IF NOT EXISTS messages (
    time BIGINT NOT NULL,
    channel       UUID,
    subtopic      VARCHAR(254),
    publisher     UUID,
    protocol      TEXT,
    name          VARCHAR(254),
    unit          TEXT,
    value         FLOAT,
    string_value  TEXT,
    bool_value    BOOL,
    data_value    BYTEA,
    sum           FLOAT,
    update_time   FLOAT,
    PRIMARY KEY (time, publisher, subtopic, name)
);
```

##### Example of Go Implementation

```go
// Initialize TimescaleDB Connection
cfg := timescale.Config{
    Host: "localhost", Port: "5432",
    User: "supermq", Pass: "supermq",
    Name: "magistrala", SSLMode: "disable",
}

db, err := timescale.Connect(cfg)
if err != nil {
    log.Fatalf("Failed to connect to TimescaleDB: %v", err)
}

// Create Reader Instance
reader := timescale.New(db)

// Query Messages
meta := readers.PageMetadata{Limit: 10, Offset: 0, Subtopic: "temperature"}
messages, err := reader.ReadAll("channel-uuid", meta)
if err != nil {
    log.Fatalf("Failed to read messages: %v", err)
}

for _, msg := range messages.Messages {
    fmt.Printf("Message: %+v\n", msg)
}
```

#### Query Parameters

The `ReadAll` function accepts a `PageMetadata` struct that supports the following filters:

| Parameter   | Description                     | Example        |
|--------------|---------------------------------|----------------|
| `subtopic`   | Filter messages by subtopic.     | `temperature`  |
| `publisher`  | Filter by publisher ID.          | `user-123`     |
| `protocol`   | Filter by protocol type.         | `MQTT`         |
| `name`       | Filter by sensor name.           | `voltage`      |
| `value`      | Filter by value (with comparator).| `>100`        |
| `from`       | Start time in UNIX timestamp.    | `1700000000`   |
| `to`         | End time in UNIX timestamp.      | `1700500000`   |
| `limit`      | Maximum number of results.       | `10`           |
| `offset`     | Pagination offset.               | `0`            |
| `aggregation`| Aggregate results (`avg`, `max`).| `avg`          |
| `interval`   | Aggregation interval.            | `1m`           |

#### API Example

**HTTP Request**:

Send a request to retrieve messages with filtering by subtopic and time range.

```bash
curl -X GET "http://localhost:8000/domain/{domainID}/channels/{channelID}/messages?subtopic=temperature&from=1700000000&to=1700500000&limit=5" \
-H "Authorization: Bearer <token>"

```

**Expected Response**:

The response will include the messages along with pagination details.

```json
{
  "total": 5,
  "messages": [
    {
      "time": 1700000100,
      "channel": "channel-uuid",
      "subtopic": "temperature",
      "publisher": "publisher-uuid",
      "protocol": "mqtt",
      "name": "sensor1",
      "unit": "C",
      "value": 22.5
    }
  ],
  "offset": 0,
  "limit": 5
}
```

### PostgreSQL Reader

**PostgreSQL** is a powerful, open-source relational database with robust SQL capabilities and extensive ecosystem support.

#### PostgreSQL Reader Key Features

- **Dynamic Filtering:** Supports rich query parameters like `subtopic`, `name`, and `publisher`.
- **Flexible Data Handling:** Handles structured SenML and generic JSON messages.
- **Pagination:** Built-in support for paginated message retrieval.

#### How PostgreSQL Reader Works

The `PostgreSQL Reader` retrieves messages from the `messages` table, applying the specified filters for efficient querying.

Here is the Database Schema:

```sql
CREATE TABLE IF NOT EXISTS messages (
    id            UUID PRIMARY KEY,
    channel       UUID,
    subtopic      VARCHAR(254),
    publisher     UUID,
    protocol      TEXT,
    name          TEXT,
    unit          TEXT,
    value         FLOAT,
    string_value  TEXT,
    bool_value    BOOL,
    data_value    TEXT,
    sum           FLOAT,
    time          FLOAT,
    update_time   FLOAT
);
```

##### Example of Go Implementation for PostgreSQL

```go
// Initialize PostgreSQL Connection
cfg := postgres.Config{
    Host: "localhost", Port: "5432",
    User: "supermq", Pass: "supermq",
    Name: "magistrala", SSLMode: "disable",
}

db, err := postgres.Connect(cfg)
if err != nil {
    log.Fatalf("Failed to connect to PostgreSQL: %v", err)
}

// Create Reader Instance
reader := postgres.New(db)

// Query Messages
meta := readers.PageMetadata{Limit: 5, Subtopic: "humidity"}
messages, err := reader.ReadAll("channel-uuid", meta)
if err != nil {
    log.Fatalf("Failed to read messages: %v", err)
}

for _, msg := range messages.Messages {
    fmt.Printf("Message: %+v\n", msg)
}
```

#### ReadAll Query Parameters

PostgreSQL readers share the same query parameters as TimescaleDB:

| Parameter   | Description                     | Example        |
|--------------|---------------------------------|----------------|
| `subtopic`   | Filter messages by subtopic.     | `humidity`     |
| `publisher`  | Filter by publisher ID.          | `user-456`     |
| `protocol`   | Filter by protocol type.         | `MQTT`         |
| `name`       | Filter by sensor name.           | `temperature`  |
| `value`      | Filter by value (with comparator).| `<=50`        |
| `from`       | Start time in UNIX timestamp.    | `1701000000`   |
| `to`         | End time in UNIX timestamp.      | `1701500000`   |
| `limit`      | Maximum number of results.       | `5`            |
| `offset`     | Pagination offset.               | `0`            |
| `aggregation`| Aggregate results (`min`, `count`).| `count`       |
| `interval`   | Aggregation interval.            | `5m`           |

#### PostgreSQL API Example

**HTTP Request**:

Request messages using query parameters like `subtopic` and `time`.

```bash
curl -X GET "http://localhost:8000/domain/{domainID}/channels/{channelID}/messages?subtopic=humidity&from=1701000000&to=1701500000&limit=3" \
-H "Authorization: Bearer <token>"

```

**Expected Response**:

The response will show the messages along with pagination information.

```json
{
  "total": 3,
  "messages": [
    {
      "id": "message-id-123",
      "time": 1701000100,
      "channel": "channel-uuid",
      "subtopic": "humidity",
      "publisher": "publisher-uuid",
      "protocol": "mqtt",
      "name": "sensor2",
      "unit": "%",
      "value": 45.3
    }
  ],
  "offset": 0,
  "limit": 3
}

```

## Understanding Message Formats

Magistrala primarily uses the **SenML** format for telemetry data. It also supports generic JSON payloads for more flexible message handling.

### **SenML Format**

The SenML format is commonly used for time-series data like sensor readings.

```json
[
  {
    "bn": "room1/",
    "bt": 1620053344,
    "n": "temperature",
    "u": "°C",
    "v": 23.4
  },
  {
    "bn": "room1/",
    "bt": 1620053344,
    "n": "humidity",
    "u": "%",
    "v": 60
  }
]
```

### **JSON Format**

The JSON format supports more flexible and structured data representations.

```json
{
  "sensor_id": "123",
  "type": "environment",
  "value": {
    "temperature": 23.4,
    "humidity": 60
  }
}
```

## Authentication and Authorization

Readers follow Magistrala's core security principles:

1. **Authentication:** Required via `Bearer` tokens or `Client Secrets`.
2. **Authorization:** Clients must be authorized to read from the specified channels.

## Error Codes

| HTTP Code | Description                       |
|-----------|-----------------------------------|
| `400`     | Invalid query parameters.          |
| `401`     | Unauthorized access.               |
| `403`     | Forbidden: no permission.          |
| `500`     | Internal server error.             |
