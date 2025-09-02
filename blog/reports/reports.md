---
slug: iot-data-reports
title: "Building IoT Data Reports with Magistrala: A Developer's Deep Dive"
authors: steve
description: "A practical guide to generating IoT reports using Magistrala" 
tags:
  [
    iot,
    data-reporting,
    golang,
    postgresql,
    pdf-generation,
    csv-export,
    email-automation,
    time-series,
    scheduling,
    templates,
  ]
---

# Building IoT Data Reports with Magistrala: A Developer's Deep Dive

## Introduction

If you’ve worked with IoT systems for any length of time, you know that collecting sensor data is only the beginning. The real work starts when you try to make sense of all the incoming data and turn it into information your team can use to monitor systems, track performance, or respond to issues. That’s where Magistrala’s reporting system comes in.

These aren't just proof-of-concept demos - they're production systems handling real business operations, from compliance documentation to cost optimization. In this deep dive, I'll share the technical details, architectural insights, and practical examples that will help you build similarly robust IoT reporting systems with Magistrala.

<!-- truncate -->

## Why Reporting Matters in IoT

In an IoT system, data is constant - but understanding is not.

Data comes in the form of sensor readings, status updates, error logs, event messages. It's granular, fast, and often ephemeral. But what most stakeholders want is not the data itself - it's the summary of what happened over a defined period: the daily operational status, the weekly uptime statistics, the monthly energy use, the quarterly SLA compliance.

That's what reporting delivers.

And it's especially critical in IoT for three reasons:

**Time makes context**  
Unlike traditional systems, IoT data is driven by time. A temperature reading means little on its own - but averaged hourly across 1,000 sensors, it reveals patterns. Spikes may indicate mechanical faults, and drops might signal failed sensors. Reporting aggregates time into meaning.

**Human consumption is asynchronous**  
Dashboards are great for real-time ops. But most teams - finance, compliance, client managers - don't log into dashboards. They rely on emailed summaries, PDF snapshots, and scheduled CSV exports to get the story. Reporting bridges this operational gap.

**Accountability requires auditability**  
IoT platforms often sit between infrastructure and operations. When something breaks, the ability to look back and say "here's exactly what we saw on Tuesday at 2pm" matters. Reports provide that frozen-in-time view that dashboards can't.

For these reasons, we've come to treat reporting as a first-class function. It's not a visualization tool. It's a data product - automated, schedulable, auditable, and deliverable. In many platforms, reporting is treated as a feature added on after everything else. But that doesn't scale. Because reporting, at its core, isn't about charts - it's about historical state.

And historical state has rules:

- It must be queryable across time, device, and location.
- It must be filterable down to the fields users care about - units, regions, thresholds.
- It must be structured into something that can be rendered, exported, or sent without human intervention.
- And most importantly - it must be auditable and repeatable.

That's why Magistrala's reporting system is tightly integrated with the core architecture. It doesn't duplicate the message store. It doesn't fork your telemetry pipelines. Instead, it acts as a query layer, a renderer, and a delivery engine on top of the data you already ingest and store.

And it does so through a well-defined set of primitives: reports, templates, schedules, formats, and metrics.

## System Architecture: How Magistrala Reporting Works Under the Hood

The reporting system is fully integrated into Magistrala's core architecture and provides enterprise-grade functionality for data visualization and automated reporting. The system consists of several key components that work together to deliver reliable, scalable IoT reporting capabilities:

### Core Service Components

1. **Report Service** : This is the heart of the operation. It handles all the business logic for creating, updating, and generating reports. The service manages everything from parsing time expressions like `now()-1h` to orchestrating the entire report generation pipeline. It communicates with the readers service via gRPC to fetch historical IoT data, applies aggregations (MIN, MAX, AVG, SUM, COUNT), and coordinates with the template engine for output formatting. The gRPC client connection allows for efficient, type-safe communication when querying large datasets.

2. **Repository Layer** : All your report configurations, schedules, and metadata live here in PostgreSQL. This layer handles CRUD operations for report configs, stores custom templates, and manages the scheduling state. It's designed to handle the multi-tenant nature of Magistrala, so each domain's reports stay completely isolated.

3. **API Layer** : The REST endpoints that actually don't make you want to pull your hair out. This layer handles authentication, request validation, and all the HTTP routing. It includes proper error handling and follows Magistrala's consistent API patterns, so if you've used other parts of the platform, this will feel familiar.

4. **Scheduler Component**: Built on top of a ticker system, this handles the "set it and forget it" functionality. It wakes up periodically, checks for reports that need to run, and kicks off the generation process. The scheduler is smart enough to handle failures and won't spam you if something goes wrong.

5. **Template Engine & PDF Generation**: This is what makes your PDFs look professional instead of like something from 1995. The system uses a two-part approach: first, it processes your data through Go HTML templates with custom styling, then sends the rendered HTML to **Gotenberg** - a dedicated microservice that converts HTML to clean PDF output. Gotenberg runs as a separate Docker container and provides a stateless API for document conversion. The engine validates templates to prevent security issues and the whole pipeline is designed for high-throughput PDF generation.

   **Template Validation Architecture**: Before any template reaches the PDF generation pipeline, it goes through a comprehensive validation system that ensures reliability and security. The validation happens at three critical points in the system workflow: when creating report configurations, updating templates, and during report generation. This multi-stage validation prevents runtime failures and ensures that your automated reports won't break at 3 AM when nobody's around to fix them.

   The validation system uses Go's built-in template parser to perform syntax checking and semantic analysis. It first parses the template to catch any syntax errors (missing closing tags, malformed expressions, etc.), then walks through the parsed template tree to verify that all essential fields required for PDF generation are present. This includes checking for the title variable, data iteration blocks, time and value formatting functions, and proper block closure. The system maintains a registry of required template elements and validates each one systematically, providing specific error messages when something's missing rather than generic "template invalid" responses.

   What makes this architecture particularly robust is that validation happens before templates are stored or used, not during PDF generation. This means failed templates never make it into the production pipeline, and your scheduled reports continue working reliably. The validation also respects the multi-tenant nature of Magistrala - each domain's templates are validated independently, so one tenant's broken template can't affect another's reports.

6. **Email Integration**: Uses Magistrala's built-in emailer service to handle SMTP delivery. It validates recipient addresses, handles attachments properly, and includes retry logic for when email servers are being temperamental. The integration respects domain policies so you can't accidentally send internal data to external addresses.

### The Data Journey

```
Your IoT Devices → Message Brokers → Readers Service → Reports Service → Reports
```

What's nice is that the reporting service doesn't reinvent the wheel. It hooks into the existing readers infrastructure, so you're querying the same data store your other services use.

> **Note**: The Readers Service is Magistrala's dedicated component for querying time-series data from PostgreSQL/TimescaleDB. It provides optimized read operations for sensor data, handles complex queries with filtering and aggregation, and serves as the primary interface for accessing historical IoT measurements across the platform.

### System Data Flow

Let me show you how data flows through the system when you generate a report. Understanding this helps a lot when things don't work as expected.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   IoT Devices   │    │  Message Brokers │    │  Readers Service│
│                 │───▶│                  │───▶│                 │
│ • MQTT Sensors  │    │ • NATS           │    │ • Data Query    │
│ • HTTP Devices  │    │ • RabbitMQ       │    │ • Aggregation   │
│ • CoAP Sensors  │    │                  │    │ • Time Filtering│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         │
                                                         │
                                                         |
                       ┌──────────────────┐              │
                       │   Gotenberg      │              │
                       │   (PDF Service)  │              │
                       │                  │              │
                       │ • chromedp       │              │
                       │ • HTML→PDF       │              │
                       │ • REST API       │              │
                       └──────────────────┘              │
                                │      ▲                 │
                                │      │                 │
                                ▼      │                 ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Email Service  │    │ Reports Service  │    │   PostgreSQL    │
│                 │◀───│                  │───▶│                 │
│ • SMTP Delivery │    │ • Query Builder  │    │ • Report Configs│
│ • Attachment    │    │ • CSV Export     │    │ • Schedules     │
│ • Validation    │    │ • Scheduling     │    │ • Templates     │
└─────────────────┘    │ • Template Engine│    └─────────────────┘
                       └──────────────────┘              
                                │                        
                                ▼                        
                       ┌──────────────────┐              
                       │   Report Output  │
                       │                  │
                       │ • PDF Files      │
                       │ • CSV Files      │
                       │ • JSON Data      │
                       │ • Email Delivery │
                       └──────────────────┘
```

## Following a Report: The Full Lifecycle
To really understand how Magistrala’s reporting system works, it helps to follow a single report from start to finish. Not the code or the API docs - just the actual flow: from when someone creates a report config to when a PDF lands in their inbox.
Here’s how that journey works.
---
### Step 1: Someone creates a report
Every report starts with a config.
This can be set up through the API or UI, and it defines what the report should do:
* What time range to cover (e.g. last 24 hours)
* What metric to pull (e.g. temperature, power usage)
* Which devices or channels to include
* How to aggregate the data (e.g. hourly averages)
* What format to use (PDF, CSV, JSON)
* Whether to send it over email, push it somewhere else, or just download it
Once created, this config gets saved in Postgres. It’s not a one-time report—it’s a recipe the system can keep reusing. If you add a schedule to it (say, every day at 6am), the scheduler picks it up automatically.
---
### Step 2: The scheduler picks it up
The scheduler runs in the background every minute. It checks the database to see if any reports are due to run based on their schedule.
If it finds one, it locks that report (so it doesn’t get triggered twice), figures out the time range to use (like "now" minus 24 hours), and then hands the job off to the report service to actually generate it.
---
### Step 3: The data is pulled
Next, the report service talks to the readers service over gRPC to fetch the actual sensor data. This is where it gets the readings—say, temperature from a set of devices over the last day.
The readers service builds a SQL query under the hood (usually against TimescaleDB), using the filters and metric fields from the report config. If the report includes aggregation (like hourly averages), that happens here too.
The result is a clean set of data: timestamps, values, units, and other metadata—ready to be turned into something people can read.
---
### Step 4: The report is rendered
Once the data is in, the report service decides how to format it.
* If it’s a CSV, it just writes out the rows.
* If it’s a PDF, it needs to go through the template engine.
The template engine takes your HTML layout (custom or default), drops in the data, and then passes the result to Gotenberg—an external service that turns HTML into a polished PDF. The result comes back as a finished file, ready to be sent.
---
### Step 5: It gets delivered
Now the report is ready to go.
Depending on how it was configured, it might:
* Be sent as an email attachment
* Be uploaded to object storage
* Be posted to a webhook
* Or just returned to the API caller for immediate download
If email is involved, the system takes care of SMTP delivery, including things like retries if the mail server is slow or the address bounces.

### Understanding Metrics: The Core Filtering Mechanism

When you're setting up a report in Magistrala, the most important thing you define - besides the time range - is the list of metrics. These tell the system what data to pull from TimescaleDB. But if you've never dug into how they work under the hood, it’s easy to miss just how much control they give you - and how things can quietly break if you don’t model them carefully.

When you define a metric in your report configuration, you're telling the system exactly what data to retrieve from the TimescaleDB database. Each metric acts as a set of filters that get translated into SQL WHERE clauses. Think of it like building a search query - the more specific your metric parameters, the more targeted your data retrieval becomes.

The available metric fields are:

**ChannelID** - Mandatory field that serves as the primary partition key. This identifies which channel (data stream) to query from.

**ClientIDs** - Optional array that filters by specific devices. This maps to the `publisher` field in the database and allows you to get data from particular IoT devices.

**Name** - Mandatory field that specifies the metric or sensor name you want to retrieve data for.

**Subtopic** - Optional field for message routing path. Helps organize data by location, sensor type, or other logical groupings.

**Protocol** - Optional field to filter by communication protocol (mqtt, http, coap). Useful in multi-protocol environments.

**Format** - Optional field for data format type. Specifies the format of the data being queried.

For example, this metric configuration:

```json
{
    "channel_id": "{{CHANNELID}}",
    "client_ids": ["{{CLIENTID}}"],
    "name": "lab2:current",
    "subtopic": "test",
    "protocol": "http",
    "format": "messages"
}
```

Will retrieve all "lab2:current" sensor readings from the specified channel and device, filtered to only include messages with "test" subtopic that came via HTTP protocol, using the standard messages table format.

#### Template Validation Requirements

When you create custom HTML templates, Magistrala validates them to ensure they'll work correctly with the PDF generation system. The validation system performs comprehensive checking at multiple levels to prevent runtime failures and ensure reliable report generation.

**Essential Template Fields (Mandatory)**

The validation system requires five specific fields that are absolutely critical for PDF generation:

**1. `{{$.Title}}` - Report Title**
- **Purpose**: Provides the main title for the report  
- **Usage**: Typically used in `<title>` tags and header sections
- **Example**: `<title>{{$.Title}}</title>` or `<h1>{{$.Title}}</h1>`
- **Validation**: System searches for exact string `"$.Title"` in template actions

**2. `{{range .Messages}}` - Data Iteration Block**
- **Purpose**: Creates a loop to iterate through sensor message data
- **Usage**: Must be used to display the actual IoT sensor readings
- **Example**: `{{range .Messages}}<tr>...</tr>{{end}}`
- **Validation**: System looks for `".Messages"` in range node commands

**3. `{{formatTime .Time}}` - Time Formatting Function**
- **Purpose**: Formats Unix timestamps into human-readable time strings
- **Usage**: Used inside the Messages range loop to display timestamps
- **Example**: `<td>{{formatTime .Time}}</td>`
- **Validation**: System searches for `"formatTime"` as function name in template actions

**4. `{{formatValue .}}` - Value Formatting Function**
- **Purpose**: Formats sensor values (handles different data types, precision, units)
- **Usage**: Used inside the Messages range loop to display sensor readings
- **Example**: `<td>{{formatValue .}}</td>`
- **Validation**: System searches for `"formatValue"` as function name in template actions

**5. `{{end}}` - Block Closure**
- **Purpose**: Properly closes template control structures
- **Usage**: Must close every `{{range}}`, `{{if}}`, or `{{with}}` block
- **Example**: `{{range .Messages}}<tr>...</tr>{{end}}`
- **Validation**: Automatically detected when processing range, if, or with nodes

**How Validation Works**

The validation system uses Go's template parser to perform two-phase validation:

1. **Syntax Validation**: Parses the template using Go's built-in template parser to catch syntax errors (missing closing tags, malformed expressions, invalid template syntax)

2. **Semantic Validation**: Walks through the parsed template Abstract Syntax Tree (AST) to verify that all essential fields are present:
   - **ActionNode**: Checks for `$.Title`, `formatTime`, and `formatValue` function calls
   - **RangeNode**: Checks for `.Messages` iteration and automatically sets `hasEnd = true`
   - **IfNode/WithNode**: Recursively validates content blocks and else clauses

**Why These Fields Are Required**

- **{{$.Title}}**: Every report needs a title for identification and context
- **{{range .Messages}}**: Without this, you can't display any actual sensor data
- **{{formatTime .Time}}**: Raw Unix timestamps are unreadable; this makes them human-friendly
- **{{formatValue .}}**: Ensures sensor values are properly formatted (handles decimals, units, etc.)
- **{{end}}**: Prevents malformed templates that would cause runtime errors

**Optional Template Fields (Recommended)**

These fields enhance reports but are not required for validation:
- `{{$.GeneratedDate}}` and `{{$.GeneratedTime}}` - Generation timestamps  
- `{{.Metric.Name}}`, `{{.Metric.ClientID}}`, `{{.Metric.ChannelID}}` - Metric information
- `{{len .Messages}}` - Record count
- `{{.Unit}}`, `{{.Protocol}}`, `{{.Subtopic}}` - Additional message fields

**Validation Timing**

Template validation occurs at three critical points:
1. **Report Config Creation** - When `report_template` field is provided in POST requests
2. **Template Updates** - When updating templates via PUT `/template` endpoint
3. **Report Generation** - When `report_template` is provided in generation requests

This multi-stage validation ensures that broken templates never make it into the production pipeline, and your automated reports continue working reliably without runtime failures.

## Examples

Let me walk you through real-world examples and show you how to build reports that actually work in production.

Let me walk you through setting up a real report - the kind we actually use in production. This one pulls temperature data from our warehouse sensors and emails a summary to the facilities team every morning:

```go
reportConfig := reports.ReportConfig{
    Name:        "Daily Temperature Summary",
    Description: "Hourly temperature averages from all warehouse sensors",
    Schedule: schedule.Schedule{
        StartDateTime:   time.Now().Add(time.Hour),
        Recurring:       schedule.Daily,
        RecurringPeriod: 1,
    },
    Config: &reports.MetricConfig{
        From:        "now()-24h",        // Last 24 hours
        To:          "now()",            // Right now
        Title:       "Temperature Report",
        FileFormat:  reports.PDF,
        Aggregation: reports.AggConfig{
            AggType:  reports.AggregationAVG,
            Interval: "1h",              // Hourly averages
        },
    },
    Metrics: []reports.ReqMetric{
        {
            ChannelID: "04ead9d9-f054-4aaf-8765-88765e324635",
            Name:      "temperature",
            ClientIDs: []string{"f47ac10b-58cc-4372-a567-0e02b2c3d479", "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "6ba7b811-9dad-11d1-80b4-00c04fd430c8"},
            Protocol:  "mqtt",
        },
    },
    Email: &reports.EmailSetting{
        To:      []string{"ops@company.com", "manager@company.com"},
        Subject: "Daily Temperature Report",
        Content: "Here's yesterday's temperature summary from the warehouse.",
    },
}
```

### Practical curl Examples

Here are the actual curl commands you'll use in production. These work with real endpoints and show you exactly how to interact with the reports API.

#### Generate a Report On-Demand (with default template)

This is the most common operation - generating a report immediately and downloading it:

```bash
curl --location 'http://localhost:9017/{{DOMAINID}}/reports?action=download' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}' \
--data-raw '{
    "name": "lab 1 report",
    "description": "lab 1 sensors report",
    "config": {
        "from": "now()-5d",
        "to": "now()",
        "file_format": "pdf",
        "title": "current data"
    },
    "metrics": [
        {
            "channel_id": "22a043e9-401e-4e3f-b603-1c1e8cd52000",
            "client_ids": ["bd9dce02-73d1-4525-8229-71d25ba35d65"],
            "name": "lab2:current"
        }  
    ]
}'
```

**Note**: When you omit the `report_template` field, the system uses the default template automatically. This is usually what you want for standard reports.

#### Create a Scheduled Report

Set up a report that runs automatically every day:

```bash
curl --location 'http://localhost:9017/{{DOMAINID}}/reports/configs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}' \
--data-raw '{
    "name": "Daily Temperature Summary",
    "description": "Hourly temperature averages from warehouse sensors",
    "schedule": {
        "start_datetime": "2024-01-01T09:00:00Z",
        "recurring": "daily",
        "recurring_period": 1
    },
    "config": {
        "from": "now()-24h",
        "to": "now()",
        "title": "Temperature Report",
        "file_format": "pdf",
        "aggregation": {
            "agg_type": "avg",
            "interval": "1h"
        }
    },
    "metrics": [
        {
            "channel_id": "04ead9d9-f054-4aaf-8765-88765e324635",
            "name": "temperature",
            "client_ids": ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "6ba7b810-9dad-11d1-80b4-00c04fd430c8"],
            "protocol": "mqtt"
        }
    ],
    "email": {
        "to": ["ops@company.com"],
        "subject": "Daily Temperature Report",
        "content": "Yesterday's temperature summary is attached."
    }
}'
```

#### Generate a CSV Report

Sometimes you need data in spreadsheet format:

```bash
curl --location 'http://localhost:9017/{{DOMAINID}}/reports?action=download' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}' \
--data-raw '{
    "name": "Energy Data Export",
    "config": {
        "from": "now()-7d",
        "to": "now()",
        "title": "Weekly Energy Report",
        "file_format": "csv"
    },
    "metrics": [
        {
            "channel_id": "04ead9d9-f054-4aaf-8765-88765e324635",
            "name": "power_consumption"
        }
    ]
}'
```

#### List Existing Report Configurations

Check what reports you have set up:

```bash
curl --location 'http://localhost:9017/{{DOMAINID}}/reports/configs?limit=10&offset=0&status=enabled' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}'
```

#### Enable/Disable a Scheduled Report

Control whether a scheduled report runs:

```bash
# Enable a report
curl --location --request POST 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}/enable' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}'

# Disable a report
curl --location --request POST 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}/disable' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}'
```

#### Update Report Schedule

Modify the schedule of an existing report configuration:

```bash
curl --location --request PATCH 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}/schedule' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}' \
--data '{
    "schedule": {
        "start_datetime": "2025-04-07T00:00:00.000Z",
        "time": "0001-01-01T00:00:00.000Z",
        "recurring": "daily",
        "recurring_period": 1
    }
}'
```

#### Update Report Template

Update the HTML template for an existing report configuration:

```bash
curl --location --request PUT 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}/template' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}' \
--data-raw '{
     "report_template": "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>{{.Title}}</title><style>:root{--primary-color:#4527a0;--secondary-color:#311b92;--subtle-color:#b0bec5;--table-header-bg:#ede7f6;--alternate-row:#f3e5f5;--text-primary:#263238;--text-secondary:#546e7a;--white:#fff;--header-height:35mm;--footer-height:20mm;--page-padding:15mm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background-color:var(--white);color:var(--text-primary);line-height:1.4}.page{max-width:210mm;min-height:297mm;padding:var(--page-padding) 10mm;margin:5mm auto 0;background:var(--white);box-shadow:0 0 10px rgba(0,0,0,0.1);position:relative;display:flex;flex-direction:column}.header{height:var(--header-height);min-height:var(--header-height);max-height:var(--header-height);position:relative;flex-shrink:0;display:flex;flex-direction:column}.header-top-bar{height:8px;background-color:var(--primary-color);margin:0 -10mm 15px -10mm;flex-shrink:0}.header-content{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-shrink:0}.header-title{font-size:20px;font-weight:700;color:var(--primary-color);text-align:center;flex-grow:1}.header-date{font-size:10px;font-style:italic;color:var(--text-secondary);text-align:right;width:100px}.header-separator{height:2px;background-color:var(--subtle-color);margin:5px 0 10px;position:relative;flex-shrink:0}.header-separator:after{content:\'\\\'\\\';position:absolute;top:3px;left:0;right:0;height:1px;background-color:var(--subtle-color)}.content-area{flex-grow:1;display:flex;flex-direction:column;min-height:0;overflow:hidden}.metrics-section{margin-bottom:15px;flex-shrink:0}.metrics-title{font-size:16px;font-weight:700;color:var(--secondary-color);margin-bottom:10px}.metrics-info{background-color:var(--alternate-row);padding:12px;border-radius:4px;margin-bottom:10px}.metric-row{display:flex;margin-bottom:8px}.metric-row:last-child{margin-bottom:0}.metric-label{font-weight:700;color:var(--text-primary);width:120px;font-size:11px}.metric-value{font-style:italic;color:var(--text-primary);font-size:11px;flex-grow:1}.record-count{text-align:right;font-size:10px;font-style:italic;color:var(--text-secondary);margin-bottom:10px;flex-shrink:0}.table-container{flex-grow:1;overflow:auto;min-height:0}.data-table{width:100%;border-collapse:collapse}.table-header-bar{height:4px;background-color:var(--primary-color)}.data-table th{background-color:var(--table-header-bg);color:var(--secondary-color);font-weight:700;font-size:11px;padding:8px;text-align:center;border-bottom:2px solid var(--subtle-color);position:sticky;top:0}.data-table td{padding:6px 8px;font-size:10px;text-align:center;border-bottom:1px solid #eee}.data-table tr:nth-child(even){background-color:var(--alternate-row)}.data-table tr:hover{background-color:rgba(69,39,160,0.05)}.col-time{width:25%;color:var(--text-primary)}.col-value{width:17%;color:var(--text-primary);font-weight:400}.col-unit{width:17%;color:var(--text-secondary);font-style:italic}.col-protocol{width:17%;color:var(--text-primary)}.col-subtopic{width:24%;color:var(--secondary-color)}.footer{height:var(--footer-height);min-height:var(--footer-height);max-height:var(--footer-height);border-top:2px solid var(--subtle-color);padding-top:8px;flex-shrink:0;display:flex;flex-direction:column;justify-content:flex-start}.footer-separator{height:1px;background-color:var(--subtle-color);margin-bottom:6px;position:relative;flex-shrink:0}.footer-separator:after{content:\'\\\'\\\';position:absolute;top:1px;left:0;right:0;height:1px;background-color:var(--subtle-color)}.footer-content{display:flex;justify-content:space-between;align-items:center;margin:0;padding:0;flex-shrink:0}.footer-generated{font-size:8px;font-style:italic;color:var(--text-secondary);margin:0;padding:0}.footer-page{font-size:9px;font-weight:700;color:var(--text-primary);margin:0;padding:0}@media print{.page{box-shadow:none;margin:0;max-width:none;height:297mm;min-height:auto;page-break-after:always}.page:last-child{page-break-after:auto}}</style></head><body>{{$totalPages := len .Reports}}{{$globalPage := 0}}{{range $index, $report := .Reports}}{{$globalPage = add $globalPage 1}}<div class=\"page\"><div class=\"header\"><div class=\"header-top-bar\"></div><div class=\"header-content\"><div style=\"width:100px\"></div><div class=\"header-title\">{{$.Title}}</div><div class=\"header-date\">{{$.GeneratedDate}}</div></div><div class=\"header-separator\"></div></div><div class=\"content-area\"><div class=\"metrics-section\"><div class=\"metrics-title\">Metrics</div><div class=\"metrics-info\"><div class=\"metric-row\"><div class=\"metric-label\">Name:</div><div class=\"metric-value\">{{.Metric.Name}}</div></div>{{if .Metric.ClientID}}<div class=\"metric-row\"><div class=\"metric-label\">Device ID:</div><div class=\"metric-value\">{{.Metric.ClientID}}</div></div>{{end}}<div class=\"metric-row\"><div class=\"metric-label\">Channel ID:</div><div class=\"metric-value\">{{.Metric.ChannelID}}</div></div></div></div><div class=\"record-count\">Total Records: {{len .Messages}}</div><div class=\"table-container\"><div class=\"table-header-bar\"></div><table class=\"data-table\"><thead><tr><th class=\"col-time\">Time</th><th class=\"col-value\">Value</th><th class=\"col-unit\">Unit</th><th class=\"col-protocol\">Protocol</th><th class=\"col-subtopic\">Subtopic</th></tr></thead><tbody>{{range .Messages}}<tr><td class=\"col-time\">{{formatTime .Time}}</td><td class=\"col-value\">{{formatValue .}}</td><td class=\"col-unit\">{{.Unit}}</td><td class=\"col-protocol\">{{.Protocol}}</td><td class=\"col-subtopic\">{{.Subtopic}}</td></tr>{{end}}</tbody></table></div></div><div class=\"footer\"><div class=\"footer-separator\"></div><div class=\"footer-content\"><div class=\"footer-generated\">Generated: {{$.GeneratedTime}}</div><div class=\"footer-page\">Page {{$globalPage}} of {{$totalPages}}</div></div></div></div>{{end}}</body></html>"
}'
```

#### View Report Template

Retrieve the current HTML template for a report configuration:

```bash
curl --location 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}/template' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}'
```

#### Delete Report Template

Remove the custom HTML template from a report configuration (reverts to default template):

```bash
curl --location --request DELETE 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}/template' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}'
```

#### Delete Report Configuration

Permanently remove a report configuration and all its associated data:

```bash
curl --location --request DELETE 'http://localhost:9017/{{DOMAINID}}/reports/configs/{{REPORT_CONFIG_ID}}' \
--header 'Authorization: Bearer {{ACCESSTOKEN}}'
```

**Note**: Replace `{{REPORT_CONFIG_ID}}` with your actual report configuration ID. You can get this ID from the response when you create a report or by listing your existing reports.

#### Quick Data Export for Analysis

Sometimes you just need to grab data quickly for analysis:

```bash
curl --location 'http://localhost:9017/{{DOMAINID}}/reports?action=download' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{ACCESS_TOKEN}}' \
--data-raw '{
    "name": "Quick Temperature Analysis",
    "config": {
        "from": "now()-2h",
        "to": "now()",
        "title": "Temperature Data",
        "file_format": "csv"
    },
    "metrics": [
        {
            "channel_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "name": "temperature",
            "client_ids": ["de0fbc2b-6224-4c02-95ef-fb4dfce4ba02", "0a8e82d6-d7aa-436f-9987-6486f165d7c5"]
        }
    ]
}' --output temperature_data.csv
```

**Note**: The `--output` flag - this saves the CSV directly to a file instead of displaying it in the terminal.

#### Sample Report Outputs: From Standard to Extraordinary

**Default Template - Professional and Clean**

Here's what you get out of the box. This PDF uses the default template with clean styling that works for most business needs:

![Sample Default Report PDF](./sample-report.png)

**Custom Template - Branded for Your Organization**

Want to add your company branding? Here's the same data with a custom template featuring company colors and styling:

![Sample Custom Report PDF](./custom-report.png)

**Cyberpunk Theme - Because Why Not?**

This is where it gets fun. With full HTML/CSS control, you can create reports that match any aesthetic. Here's a cyberpunk-themed report that turns boring sensor data into something from Blade Runner:

![Sample Custom Report PDF](./cyberpunk-theme.png)

**The only limit is your imagination.** Whether you need corporate-standard reports for the board meeting, branded dashboards for clients, or creative themes that make data exciting, the template system gives you complete creative control. You can build anything from minimalist designs to elaborate visual experiences.

**CSV Output - Data Analysis Ready**

For when you need the numbers in spreadsheet format:

```csv
Lab Current

Report Information:
Name,lab:current
Device ID,de0fbc2b-6224-4c02-95ef-fb4dfce4ba02
Channel ID,04ead9d9-f054-4aaf-8765-88765e324635

Time,Value,Unit,Protocol,Subtopic
2010-06-08 18:01:11,1.70,A,http,lab
2010-06-08 18:01:12,10.33,A,http,lab
```

### Conclusion

After working with Magistrala's reporting system for months, what strikes me most is how it gets out of your way and lets you focus on what matters - turning your IoT data into insights that actually help your team make decisions. The beauty isn't just in the technical capabilities (though the custom templating and multi-protocol support are genuinely impressive) - it's in how it adapts to real-world workflows. Need a quick CSV export for analysis? Two minutes. Want branded PDFs for executive meetings? The template system has you covered. Managing dozens of sensor types across different protocols? No problem.

I've seen teams go from manually exporting data and fighting with spreadsheets to having automated reports that just work. The facilities team gets their daily temperature summaries, the finance team has their monthly energy reports, and the ops team can monitor system health - all without anyone having to remember to run queries or format data. The reporting system does what good infrastructure should do: it becomes invisible once it's working, freeing you up to focus on the insights rather than the mechanics of data extraction.
