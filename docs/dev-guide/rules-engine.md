---
title: Rules Engine
---


The **Rules Engine** in Magistrala provides a flexible and efficient way to process messages by applying custom rules to incoming data streams. This engine allows users to define rules, apply logic using scripts, and forward messages to output channels based on specified conditions.

Rules can be scheduled, executed on a recurring basis, and enabled or disabled. This documentation outlines the core concepts, available operations, and API usage for the Rules Engine.

## Architecture

The Rules Engine operates by:

1. Listening for messages on configured input channels
2. Processing these messages through Lua scripts
3. Optionally publishing results to output channels
4. Supporting scheduled rule execution based on various recurring patterns

## Overview

The Rules Engine enables automated message transformation, filtering, and forwarding. Key functionalities include:

- **Rule Creation:** Define logic to process incoming messages.
- **Rule Execution:** Apply Lua scripts to incoming messages dynamically.
- **Scheduled Rules:** Run rules at specified intervals.
- **Real-Time Processing:** Process messages as they arrive.
- **Output Redirection:** Forward processed messages to specified output channels.

## Core Concepts

**Rules** define the logic for processing messages. Each rule specifies an input channel, processing logic, and an optional output channel.

Here is the rule structure:

```go
type Rule struct {
 ID            string    `json:"id"`
 Name          string    `json:"name"`
 DomainID      string    `json:"domain"`
 Metadata      Metadata  `json:"metadata,omitempty"`
 InputChannel  string    `json:"input_channel"`
 InputTopic    string    `json:"input_topic"`
 Logic         Script    `json:"logic"`
 OutputChannel string    `json:"output_channel,omitempty"`
 OutputTopic   string    `json:"output_topic,omitempty"`
 Schedule      Schedule  `json:"schedule,omitempty"`
 Status        Status    `json:"status"`
 CreatedAt     time.Time `json:"created_at,omitempty"`
 CreatedBy     string    `json:"created_by,omitempty"`
 UpdatedAt     time.Time `json:"updated_at,omitempty"`
 UpdatedBy     string    `json:"updated_by,omitempty"`
}
```

| Property       | Description                              | Required |
|-----------------|------------------------------------------|----------|
| `id`            | Unique identifier for the rule.           | Auto-generated |
| `name`          | Descriptive name of the rule.             | ✅       |
| `domain`        | Domain ID associated with the rule.       | ✅       |
| `input_channel` | Channel to listen for incoming messages     | ✅       |
| `input_topic`   | Topic within the input channel.           | ✅       |
| `logic`         | Lua script defining message processing.   | ✅       |
| `output_channel`| Channel to which processed messages are sent. | Optional |
| `output_topic`  | Topic within the output channel.         | Optional |
| `schedule`      | Scheduling configuration           | Optional |
| `status`        | Rule state (`enabled` or `disabled` or `deleted`)  | ✅       |
| `created_at`    | Timestamp when the rule was created.     | Auto-generated |
| `updated_at`    | Timestamp when the rule was last updated.| Auto-generated |
| `metadata`       |  Additional rule metadata                | Optional  |

### Scheduling Rules

Rules can be scheduled to run at specific times or on a recurring basis.

#### Schedule Structure

```go
type Schedule struct {
    StartDateTime   time.Time  // When the schedule becomes active
    Time            time.Time  // Specific time for the rule to run
    Recurring       Recurring  // None, Daily, Weekly, Monthly
    RecurringPeriod uint      // Interval between executions: 1 = every interval, 2 = every second interval, etc.
}
```

| Property          | Description                           |
|--------------------|---------------------------------------|
| `start_datetime`   | Date/time when the rule becomes active.|
| `time`             | Time at which the rule runs.          |
| `recurring`        | Recurrence pattern: `None`, `Daily`, `Weekly`, `Monthly`. |
| `recurring_period` | Number of intervals between executions.|

**Recurring Patterns Explained:**

- **Daily:** Runs every day at the specified time.
- **Weekly:** Runs on the same day of the week.
- **Monthly:** Runs on the same day each month.

#### How Scheduling Works

1. **Initialization**:
   - The scheduler starts when the service begins running via `StartScheduler()`
   - It uses a ticker to check for rules that need to be executed at regular intervals

2. **Rule Evaluation**:
   - For each tick, the scheduler:
     - Gets all enabled rules scheduled before the current time
     - For each rule, checks if it should run using `shouldRunRule()`
     - If a rule should run, processes it asynchronously

3. **Execution Timing**:
   The `shouldRunRule()` function determines if a rule should run by checking:
   - If the rule's start time has been reached
   - If the current time matches the scheduled execution time
   - For recurring rules:
     - **Daily**: Checks if the correct number of days have passed since start
     - **Weekly**: Checks if the correct number of weeks have passed since start
     - **Monthly**: Checks if the correct number of months have passed since start

4. **Recurring Patterns**:
   - `None`: Rule runs once at the specified time
   - `Daily`: Rule runs every N days where N is the RecurringPeriod
   - `Weekly`: Rule runs every N weeks
   - `Monthly`: Rule runs every N months

For example, to run a rule:

- Every day at 9 AM: Set recurring to "daily" with recurring_period = 1
- Every other week: Set recurring to "weekly" with recurring_period = 2
- Monthly on the 1st: Set recurring to "monthly" with recurring_period = 1

### Rule Logic with LUA Scripts

The Rules Engine uses **Lua scripts** to define the processing logic for incoming messages. Lua scripts can access message attributes like:

- `message.channel`
- `message.subtopic`
- `message.publisher`
- `message.protocol`
- `message.payload`

The script should return a value if it triggers an action. Otherwise, it should return `nil`.

**Example Lua Script:**

```lua
-- Check if the message contains a temperature reading
if message.name == "temperature" and message.value > 25 then
    return "Temperature above threshold!"
end
```

The script should return a value if it triggers an action. Otherwise, it should return `nil`.

#### Message Processing

When a message arrives on a rule's input channel, the Rules Engine:

1. Creates a Lua environment
2. Injects the message as a global variable with the following structure:

   ```lua
   message = {
     channel = "channel_name",
     subtopic = "subtopic_name",
     publisher = "publisher_id",
     protocol = "protocol_name",
     created = timestamp,
     payload = [byte_array]
   }
   ```

3. Executes the rule's Lua script
4. If the script returns a non-nil value and an output channel is configured, publishes the result

### Rule Status

Rules can have one of the following statuses:

- **Enabled:** The rule is active and processes incoming messages.
- **Disabled:** The rule is inactive and does not process messages.
- **Deleted** - The rule is marked for deletion

## API Operations

The Rules Engine API exposes several endpoints for managing rules. All requests require a valid **JWT Bearer Token** for authentication.

**The Base URL:**
`http://localhost:9008`

The Rules Engine service provides the following operations:

- `AddRule` - Create a new rule
- `ViewRule` - Retrieve a specific rule
- `UpdateRule` - Modify an existing rule
- `ListRules` - Query rules with filtering options
- `RemoveRule` - Delete a rule
- `EnableRule` - Activate a rule
- `DisableRule` - Deactivate a rule

### Create Rule

To create a new rule for processing messages use the following request body:

- `name`: Rule name  
- `domain`: Domain ID this rule belongs to  
- `input_channel`: Input channel for receiving messages  
- `input_topic`: Input topic for receiving messages  
- `logic`: Rule processing logic script  
- `output_channel`: Output channel for processed messages (optional)  
- `output_topic`: Output topic for processed messages (optional)  
- `schedule`: Rule execution schedule (optional)  
- `status`: Rule status (`enabled` or `disabled`)

**Example command:**

```bash
curl --location 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
  "name": "High Temperature Alert",
  "input_channel": "sensors",
  "input_topic": "temperature",
  "logic": {
    "type": 0,
    "value": "if message.payload > 30 then return '\''Temperature too high!'\'' end"
  },
  "output_channel": "alerts",
  "output_topic": "temperature",
  "schedule": {
    "start_datetime": "2024-01-01T00:00",
    "time": "2024-01-01T09:00",
    "recurring": "daily",
    "recurring_period": 1
  }
}'
```

This request:

- Creates a temperature monitoring rule
- Processes messages from the "sensors" channel
- Checks for temperatures above 30 degrees
- Publishes alerts to the "alerts" channel
- Runs daily at 9 AM

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules`

These are the required headers:

- `Content-Type: application/json` - Specifies the request body format
- `Authorization: Bearer <access_token>` - Your authentication token

#### Example Rule Structure

Here's a breakdown of the rule structure:

```json
{
  "name": "High Temperature Alert",
  "input_channel": "sensors",
  "input_topic": "temperature",
  "logic": {
    "type": 0,
    "value": "if message.payload > 30 then return 'Temperature too high!' end"
  },
  "output_channel": "alerts",
  "output_topic": "temperature",
  "schedule": {
    "start_datetime": "2024-01-01T00:00",
    "time": "2024-01-01T09:00",
    "recurring": "daily",
    "recurring_period": 1
  }
}
```

This rule:

1. Listens on the "sensors" channel, "temperature" topic
2. Checks if temperature exceeds 30 degrees
3. If true, publishes an alert message
4. Runs daily at 9 AM

### View Rule

This retrieves the details of a specific rule by rule ID.

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules/{ruleID}`

**Example command:**

```bash
curl --location 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules/rule123' \
--header 'Authorization: Bearer <access_token>'
```

**Expected Response:**

```json
{
  "id": "string",
  "name": "string",
  "domain": "string",
  "metadata": {
    "additionalProp1": "string",
    "additionalProp2": "string",
    "additionalProp3": "string"
  },
  "input_channel": "string",
  "input_topic": "string",
  "logic": {
    "script": "string"
  },
  "output_channel": "string",
  "output_topic": "string",
  "schedule": {
    "start_datetime": "2025-02-14T08:55:15.144Z",
    "time": "2025-02-14T08:55:15.144Z",
    "recurring": "None",
    "recurring_period": 1
  },
  "status": "enabled",
  "created_at": "2025-02-14T08:55:15.144Z",
  "created_by": "string",
  "updated_at": "2025-02-14T08:55:15.144Z",
  "updated_by": "string"
}
```

### List Rules

This lists all rules with optional filters.

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules`

**Query Parameters:**

- `offset`: Pagination offset  
- `limit`: Maximum number of results  
- `input_channel`: Filter by input channel  
- `output_channel`: Filter by output channel  
- `status`: Filter by rule status

**Example command:**

```bash
curl --location 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules?input_channel=sensors&status=enabled' \
--header 'Authorization: Bearer <access_token>'
```

**Expected Response:**

```json
{
  "total": 0,
  "offset": 0,
  "limit": 10,
  "rules": [
    {
      "id": "string",
      "name": "string",
      "domain": "string",
      "metadata": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "input_channel": "string",
      "input_topic": "string",
      "logic": {
        "script": "string"
      },
      "output_channel": "string",
      "output_topic": "string",
      "schedule": {
        "start_datetime": "2025-02-14T08:57:14.717Z",
        "time": "2025-02-14T08:57:14.717Z",
        "recurring": "None",
        "recurring_period": 1
      },
      "status": "enabled",
      "created_at": "2025-02-14T08:57:14.717Z",
      "created_by": "string",
      "updated_at": "2025-02-14T08:57:14.717Z",
      "updated_by": "string"
    }
  ]
}
```

### Update Rule

This is to update an existing rule.

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules/{ruleID}`

**Example command:**

```bash
curl --location --request PUT 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules/rule123' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <access_token>' \
--data '{
  "name": "High Temp Alert",
  "input_channel": "sensors",
  "input_topic": "temperature",
  "logic": {
    "type": 0,
    "value": "if message.payload > 35 then return '\''Critical Temp!'\'' end"
  },
  "output_channel": "alerts",
  "output_topic": "temperature_critical",
  "status": "enabled"
}'
```

**Expected Response:**

```bash
{
  "id": "rule123",
  "name": "High Temp Alert",
  "input_channel": "sensors",
  "input_topic": "temperature",
  "logic": {
    "type": 0,
    "value": "if message.payload > 35 then return 'Critical Temp!' end"
  },
  "output_channel": "alerts",
  "output_topic": "temperature_critical",
  "status": "enabled",
  "created_at": "2024-02-14T10:00:00Z",
  "created_by": "user123",
  "updated_at": "2024-02-16T09:00:00Z",
  "updated_by": "user789"
}
```

### Delete Rule
  
This function deletes an existing rule.

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules/{ruleID}`

**Example Command:**

```bash
curl --location --request DELETE 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules/rule123' \
--header 'Authorization: Bearer <access_token>'
```

**Responses:**

| Status Code | Description           |
|--------------|-----------------------|
| `204`       | Rule deleted.           |
| `400`       | Invalid rule ID.        |
| `401`       | Unauthorized access.    |
| `404`       | Rule not found.         |
| `500`       | Internal server error.  |

### Enable Rule

This function enables a rule for processing.

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules/{ruleID}/enable`

```bash
curl --location --request PUT 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules/rule123/enable' \
--header 'Authorization: Bearer <access_token>'
```

**Responses:**

| Status Code | Description           |
|--------------|-----------------------|
| `200`       | Rule enabled successfully.           |
| `400`       | Invalid rule ID.        |
| `401`       | Unauthorized access.    |
| `404`       | Rule not found.         |
| `500`       | Internal server error.  |

---

### Disable Rule

This function disables a rule, preventing it from processing messages.  

The API endpoint follows the format: `http://localhost:9008/{domain_id}/rules/{ruleID}/enable`

**Example Command:**

```bash
curl --location --request PUT 'http://localhost:9008/8353542f-d8f1-4dce-b787-4af3712f117e/rules/rule123/disable' \
--header 'Authorization: Bearer <access_token>'
```

**Responses:**

| Status Code | Description           |
|--------------|-----------------------|
| `200`       | Rule disabled successfully.          |
| `400`       | Invalid rule ID.        |
| `401`       | Unauthorized access.    |
| `404`       | Rule not found.         |
| `500`       | Internal server error.  |

---

## Error Codes

**Endpoint:** `PUT /{domainID}/rules/{ruleID}/enable`  
**Description:** Enables a previously disabled rule.

| HTTP Code | Description                          |
|-----------|--------------------------------------|
| `400`     | Invalid request or parameters.        |
| `401`     | Unauthorized: Missing/invalid token.  |
| `403`     | Forbidden: Access denied.             |
| `404`     | Resource not found.                   |
| `415`     | Unsupported content type.             |
| `500`     | Internal server error.                |

## 🌟 Best Practices

1. **Use Descriptive Names:** Make rule names clear and meaningful.
2. **Optimize Lua Scripts:** Keep scripts simple and efficient.
3. **Regularly Monitor Rules:** Periodically review rule execution logs.
4. **Schedule Wisely:** Avoid overlapping schedules for performance efficiency.
5. **Test New Rules:** Test rules in a controlled environment before deployment.
