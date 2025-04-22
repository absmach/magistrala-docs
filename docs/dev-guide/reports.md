---
title: Reports
---

The **Reports Service** in Magistrala enables automated generation and scheduling of data reports from connected devices and sensors. This service allows users to collect, aggregate, and distribute metrics in PDF and CSV formats through email or direct download.

## Architecture
The Reports Service operates through three main components:

1. **Report Configurations**: Define what data to collect and how to process it
2. **Scheduler**: Handles recurring report generation based on defined schedules
3. **Generator Engine**: Creates human-readable reports in multiple formats

![reports_architecture](../diagrams/reports_architecture.svg)

Reports Service Architecture

Core Concepts
Report Configuration

```go
type ReportConfig struct {
    ID          string
    Name        string
    Description string
    DomainID    string
    Config      *MetricConfig
    Metrics     []Metric      
    Email       *Email        // Email Notification settings 
    Schedule    Schedule      // Generation schedule
    Status      Status        // Enabled/Disabled
    CreatedAt   time.Time
    CreatedBy   string
    UpdatedAt   time.Time
    UpdatedBy   string
}
```

|Property |	Description	| Required |
|-----------------|------------------------------------------|----------|
|Name | 	Descriptive name for the report	| ✅ |
|DomainID | 	Domain context for the report	| ✅ |
|Metrics | 	List of data sources to include	| ✅ |
|Config | 	Time range and aggregation settings	| ✅ |
|Schedule | 	Automatic generation schedule	| Optional |
|Email | 	Email distribution settings	| Optional |


Metric Structure

```go
type Metric struct {
    ChannelID  string  // Source channel for data
    ClientID   string  // Device/sensor identifier
    Name       string  // Metric name (e.g., "temperature", "current")
    Subtopic   string  // Data subtopic filter
    Protocol   string  // Protocol filter (MQTT, HTTP, etc.)
    Format    string
}
```

Report Parameters

```go
type MetricConfig struct {
    From        string        // Relative start time (e.g., "now()-24h")
    To          string        // Relative end time (e.g., "now")
    Aggregation AggConfig   // Data processing method
}

type AggConfig struct {
    AggType string  // "SUM", "AVG", "MIN", "MAX", "COUNT"
    Interval string
}
```

### Example configurations:

- Daily sales report at 8 AM: **DAILY** + **08:00**
- Weekly energy summary every Monday: **WEEKLY** + **00:00**
- Monthly inventory report: **MONTHLY** + **09:00**

### Report Generation

Data Collection
1. Connects to Magistrala's time-series database
2. Collects data using configured:
    - Time range (From/To)
    - Aggregation method
    - Metric filters
3. Supports complex queries across multiple devices/channels

## Output Formats

Both PDF and CSV formats contain identical data - they differ only in presentation style and file structure:

| Feature	        |   PDF Format                      |	CSV Format                       |
|-------------------|-----------------------------------|------------------------------------|
| Structure	        | Multi-page document with tables	| Single-file comma-separated values |
| Headers	        | Styled section headers	        | Simple text row headers            |
| Data Format	    | Human-readable timestamps	        | ISO 8601 timestamps                |
| Visual Elements	| Page numbers, borders, shading	| Plain text with commas             |
| Best For	        | Printing/sharing	                | Programmatic analysis              |

Example Data Representation

PDF Table:

| Timestamp           | Metric Name   | Value | Unit | Subtopic    |
|---------------------|---------------|-------|------|-------------|
| 2024-03-15 09:30:00 | temperature   | 23.4  | °C   | room1       |
| 2024-03-15 09:35:00 | humidity      | 45.2  | %    | room1       |

Equivalent CSV:

```csv
Timestamp,Metric Name,Value,Unit,Subtopic
2024-03-15T09:30:00Z,temperature,23.4,°C,room1
2024-03-15T09:35:00Z,humidity,45.2,%,room1
```

### Email Integration

```go
type Email struct {
    To      []string  // Recipient addresses
    From    string    // Sender address
    Subject string    // Email subject line
}
```

> **NOTE:**
> Automatically sends generated reports as email with body text summarizing report contents.

### API Operations

Base URL: `http://localhost:9008/{domainID}/reports`

1. Create Report Configuration

Endpoint: `POST /configs`

```bash
curl --location http://localhost:9008/domains/{domainID}/reports/configs \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $ACCESSTOKEN' \
--data '{
    "name": "lab 1 report",
    "descripion": "lab 1 sensors report",
    "config": {
        "from": "now()-5d",
        "to": "now()+5d",
        "aggregation": {
            "agg_type":"MAX",
            "interval":"1s"
        }
    },
    "metrics": [
        {
            "channel_id": "{{CHANNELID}}",
            "client_id": "{{THINGID}}",
            "name": "current"
            "subtopic": "lab/room1"
        }
    ]
    "schedule": {
        "start_datetime": "2025-04-07T00:00:00.000Z",
        "time": "0001-01-01T20:28:00.000Z",
        "recurring": "daily",
        "recurring_period": 1
    },
    "email":"{
        "to": ["team@example.com"],
        "from": "reports@system.com",
        "subject": "Daily Environment Report"
    }",
}'
```

2. Generate Report Immediately
Endpoint: `POST /`

```bash
curl -X POST http://localhost:9008/domains/{domainID}/reports \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $ACCESSTOKEN' \
--data '{
    "name": "lab 1 report",
    "descripion": "lab 1 sensors report",
    "config": {
        "from": "now()-5d",
        "to": "now()+5d",
        "aggregation": {
            "agg_type":"MAX",
            "interval":"1s"
        }
    },
    "metrics": [
        {
            "channel_id": "{{CHANNELID}}",
            "client_id": "{{THINGID}}",
            "name": "current"
            "subtopic": "lab/room1"
        }
    ]
}'
```

3. List Report Configurations
Endpoint: `GET /configs`

```bash
curl "http://localhost:9008/domains/{domainID}/reports/configs?status=enabled&limit=10" \
--header 'Authorization: Bearer $ACCESSTOKEN'
```

4. View report configurations
Endpoint: `GET /configs/{reportID}`

```bash
curl --location 'http://localhost:9008/{domainID}/reports/configs/{reportID}' \
--header 'Authorization: Bearer $TOKEN'
```

5. Download generated report
Endpoint: `GET /{reportID}/download`

```bash
curl --location http://localhost:9008/domains/{domainID}/reports/{reportID}/download \
--header 'Authorization: Bearer $ACCESSTOKEN'
```

Returns ZIP file containing:

- *report.pdf* - Formatted PDF document
- *report.csv* - Raw data in CSV format

5. Enable Report Configuration
Activate a scheduled report configuration

Endpoint:
`POST /{domainID}/reports/configs/{reportID}/enable`

```bash
curl --location http://localhost:9008/domains/{domainID}/reports/configs/{reportID}/enable \
--header 'Authorization: Bearer $ACCESSTOKEN'
```

6. Disable Report Configuration
Pause a scheduled report generation

Endpoint:
`POST /{domainID}/reports/configs/{reportID}/disable`

```bash
curl --location http://localhost:9008/domains/{domainID}/reports/configs/{reportID}/disable \
--header 'Authorization: Bearer $ACCESSTOKEN'
```

7. Update Report Configuration
Modify an existing report configuration

Endpoint:
`PATCH /{domainID}/reports/configs/{reportID}`

```bash
curl --location --request PATCH 'http://localhost:9008/domains/{domainID}/reports/configs/{reportID}' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $ACCESSTOKEN' \
--data '{
    "name": "Updated Environment Report",
    "schedule": {
        "start_datetime": "2025-04-07T00:00:00.000Z",
        "time": "0001-01-01T00:00:00.000Z",
        "recurring": "daily",
        "recurring_period": 1
    }
}'
```
