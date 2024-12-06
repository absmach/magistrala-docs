---
sidebar_position: 18
---

# Storage

SuperMQ supports various storage databases in which messages are stored:

- CassandraDB
- MongoDB
- InfluxDB
- PostgreSQL
- Timescale

These storages are activated via docker-compose add-ons.

The `<project_root>/docker` folder contains an `addons` directory. This directory is used for various services that are not core to the SuperMQ platform but could be used for providing additional features.

In order to run these services, core services, as well as the network from the core composition, should be already running.

## Writers

Writers provide an implementation of various `message writers`. Message writers are services that consume SuperMQ messages, transform them to desired format and store them in specific data store. The path of the configuration file can be set using the following environment variables: `MG_CASSANDRA_WRITER_CONFIG_PATH`, `MG_POSTGRES_WRITER_CONFIG_PATH`, `MG_INFLUX_WRITER_CONFIG_PATH`, `MG_MONGO_WRITER_CONFIG_PATH` and `MG_TIMESCALE_WRITER_CONFIG_PATH`.

### Subscriber config

Each writer can filter messages based on subjects list that is set in `config.toml` configuration file. If you want to listen on all subjects, just set the field `subjects` in the `[subscriber]` section as `["channels.>"]`, otherwise pass the list of subjects. Here is an example:

```toml
[subscriber]
subjects = ["channels.*.messages.bedroom.temperature","channels.*.messages.bedroom.humidity"]
```

Regarding the [Subtopics Section][subtopic] in the messaging page, the example `channels/<channel_id>/messages/bedroom/temperature` can be filtered as `"channels.*.bedroom.temperature"`. The formatting of this filtering list is determined by the default message broker, NATS, format ([Subject-Based Messaging][nats-subject] & [Wildcards][nats-wildcards]).

### Transformer config

There are two types of transformers: SenML and JSON. The transformer type is set in configuration file.

For SenML transformer, supported message payload formats are SenML+CBOR and SenML+JSON. They are configurable over `content_type` field in the `[transformer]` section and expect `application/senml+json` or `application/senml+cbor` formats. Here is an example:

```toml
[transformer]
format = "senml"
content_type = "application/senml+json"
```

Usually, the payload of the IoT message contains message time. It can be in different formats (like base time and record time in the case of SenML) and the message field can be under the arbitrary key. Usually, we would want to map that time to the SuperMQ Message field Created and for that reason, we need to configure the Transformer to be able to read the field, parse it using proper format and location (if devices time is different than the service time), and map it to SuperMQ Message.

For JSON transformer you can configure `time_fields` in the `[transformer]` section to use arbitrary fields from the JSON message payload as timestamp. `time_fields` is represented by an array of objects with fields `field_name`, `field_format` and `location` that represent respectively the name of the JSON key to use as timestamp, the time format to use for the field value and the time location. Here is an example:

```toml
[transformer]
format = "json"
time_fields = [{ field_name = "seconds_key", field_format = "unix",    location = "UTC"},
               { field_name = "millis_key",  field_format = "unix_ms", location = "UTC"},
               { field_name = "micros_key",  field_format = "unix_us", location = "UTC"},
               { field_name = "nanos_key",   field_format = "unix_ns", location = "UTC"}]
```

JSON transformer can be used for any JSON payload. For the messages that contain _JSON array as the root element_, JSON Transformer does normalization of the data: it creates a separate JSON message for each JSON object in the root. In order to be processed and stored properly, JSON messages need to contain message format information. For the sake of simplicity, nested JSON objects are flatten to a single JSON object in InfluxDB, using composite keys separated by the `/` separator. This implies that the separator character (`/`) _is not allowed in the JSON object key_ while using InfluxDB. Apart from InfluxDB, separator character (`/`) usage in the JSON object key is permitted, since other [Writer][writers] types do not flat the nested JSON objects. For example, the following JSON object:

```json
{
  "name": "name",
  "id": 8659456789564231564,
  "in": 3.145,
  "alarm": true,
  "ts": 1571259850000,
  "d": {
    "tmp": 2.564,
    "hmd": 87,
    "loc": {
      "x": 1,
      "y": 2
    }
  }
}
```

for InfluxDB will be transformed to:

```json
{
  "name": "name",
  "id": 8659456789564231564,
  "in": 3.145,
  "alarm": true,
  "ts": 1571259850000,
  "d/tmp": 2.564,
  "d/hmd": 87,
  "d/loc/x": 1,
  "d/loc/y": 2
}
```

while for other Writers it will preserve its original format.

The message format is stored in _the subtopic_. It's the last part of the subtopic. In the example:

```txt
http://localhost:8008/channels/<channelID>/messages/home/temperature/myFormat
```

the message format is `myFormat`. It can be any valid subtopic name, JSON transformer is format-agnostic. The format is used by the JSON message consumers so that they can process the message properly. If the format is not present (i.e. message subtopic is empty), JSON Transformer will report an error. Message writers will store the message(s) in the table/collection/measurement (depending on the underlying database) with the name of the format (which in the example is `myFormat`). SuperMQ writers will try to save any format received (whether it will be successful depends on the writer implementation and the underlying database), but it's recommended that publishers don't send different formats to the same subtopic.

### InfluxDB, InfluxDB Writer

From the project root execute the following command:

```bash
docker-compose -f docker/addons/influxdb-writer/docker-compose.yml up -d
```

This will install and start:

- [InfluxDB][influxdb] - time series database
- InfluxDB writer - message repository implementation for InfluxDB

Those new services will take some additional ports:

- 8086 by InfluxDB
- 9006 by InfluxDB writer service

To access Influx-UI, navigate to `http://localhost:8086` and login with: `supermq`, password: `supermq`

### Cassandra and Cassandra Writer

```bash
./docker/addons/cassandra-writer/init.sh
```

_Please note that Cassandra may not be suitable for your testing environment because of its high system requirements._

### MongoDB and MongoDB Writer

```bash
docker-compose -f docker/addons/mongodb-writer/docker-compose.yml up -d
```

MongoDB default port (27017) is exposed, so you can use various tools for database inspection and data visualization.

### PostgreSQL and PostgreSQL Writer

```bash
docker-compose -f docker/addons/postgres-writer/docker-compose.yml up -d
```

Postgres default port (5432) is exposed, so you can use various tools for database inspection and data visualization.

### Timescale and Timescale Writer

```bash
docker-compose -f docker/addons/timescale-writer/docker-compose.yml up -d
```

Timescale default port (5432) is exposed, so you can use various tools for database inspection and data visualization.

## Readers

Readers provide an implementation of various `message readers`. Message readers are services that consume normalized (in `SenML` format) SuperMQ messages from data storage and opens HTTP API for message consumption. Installing corresponding writer before reader is implied.

Each of the Reader services exposes the same [HTTP API][readers-api] for fetching messages on its default port.

To read sent messages on channel with id `channel_id` you should send `GET` request to `/channels/<channel_id>/messages` with thing access token in `Authorization` header. That thing must be connected to channel with `channel_id`

Response should look like this:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Date: Tue, 18 Sep 2018 18:56:19 GMT
Content-Length: 228

{
    "messages": [
        {
            "Channel": 1,
            "Publisher": 2,
            "Protocol": "mqtt",
            "Name": "name:voltage",
            "Unit": "V",
            "Value": 5.6,
            "Time": 48.56
        },
        {
            "Channel": 1,
            "Publisher": 2,
            "Protocol": "mqtt",
            "Name": "name:temperature",
            "Unit": "C",
            "Value": 24.3,
            "Time": 48.56
        }
    ]
}
```

Note that you will receive only those messages that were sent by authorization token's owner. You can specify `offset` and `limit` parameters in order to fetch specific group of messages. An example of HTTP request looks like:

```bash
curl -s -S -i  -H "Authorization: Thing <thing_secret>" http://localhost:<service_port>/channels/<channel_id>/messages?offset=0&limit=5&format=<subtopic>
```

If you don't provide `offset` and `limit` parameters, default values will be used instead: 0 for `offset` and 10 for `limit`. The `format` parameter indicates the last subtopic of the message. As indicated under the [`Writers`][writers] section, the message format is stored in the subtopic as the last part of the subtopic. In the example:

```txt
http://localhost:<service_port>/channels/<channelID>/messages/home/temperature/myFormat
```

the message format is `myFormat` and the value for `format=<subtopic>` is `format=myFormat`.

### InfluxDB Reader

To start InfluxDB reader, execute the following command:

```bash
docker-compose -f docker/addons/influxdb-reader/docker-compose.yml up -d
```

### Cassandra Reader

To start Cassandra reader, execute the following command:

```bash
docker-compose -f docker/addons/cassandra-reader/docker-compose.yml up -d
```

### MongoDB Reader

To start MongoDB reader, execute the following command:

```bash
docker-compose -f docker/addons/mongodb-reader/docker-compose.yml up -d
```

### PostgreSQL Reader

To start PostgreSQL reader, execute the following command:

```bash
docker-compose -f docker/addons/postgres-reader/docker-compose.yml up -d
```

### Timescale Reader

To start Timescale reader, execute the following command:

```bash
docker-compose -f docker/addons/timescale-reader/docker-compose.yml up -d
```

[subtopic]: /messaging/#subtopics
[nats-subject]: https://docs.nats.io/nats-concepts/subjects
[nats-wildcards]: https://docs.nats.io/nats-concepts/subjects#wildcards
[writers]: /storage/#writers
[influxdb]: https://docs.influxdata.com/influxdb
[readers-api]: https://github.com/absmach/supermq/blob/master/api/readers.yml
