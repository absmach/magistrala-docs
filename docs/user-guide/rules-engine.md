---
title: Rules Engine
description: Automate IoT workflows with custom rules
keywords:
  - Magistrala Rules Engine
  - IoT Automation
  - Lua Scripts
  - Go Scripts
  - Message Processing
  - Workflow Builder
  - Channels
  - Subtopic
  - Send Email
  - Scheduler
image: /img/mg-preview.png
---

## Overview

The **Rules Engine** helps automate message processing using visual workflows composed of input sources, logic evaluations, and output destinations.
Users can define rules by visually combining input, logic, and output nodes to determine how incoming messages are processed, evaluated, and responded to.

## Features

### 1. Creation and Management

- **Create Rules**: Define the name of a new rule and initiate creation.
- **Quick Actions**: View, copy ID, enable/disable, or delete a rule directly from the list.

### 2. Node Configuration

- **Input Nodes**: Attach an MQTT subscriber input by selecting the channel and topic.
- **Logic Nodes**: Define conditions using comparison blocks, Lua scripts, or Go scripts.
- **Output Nodes**: Output processed data to MQTT publishers, Email recipients, or PostgreSQL databases.

### 3. Scripting and Templating

- **Lua Script Editor**: Use custom Lua scripts with a required `logicFunction()` for logic processing.
- **Go Script Editor**: Write Go-based logic for more advanced use cases (requires Go syntax compliance).
- **Go Text Templating**: Use dynamic value injection with:
  - `{{.Result}}`
  - `{{.Result.<key>}}`
  - `{{.Message.<key>}}`

### 4. Scheduling and Execution

- **Scheduling**: Define execution windows with start time, specific time, recurring intervals, and periods.
- **Connection Layout**: Visually connect all nodes to complete and activate a rule.

## Use Cases

Here are some practical examples of how you can use the Rules Engine:

- `Temperature Alerts`: Notify users by email when temperature exceeds safe limits.

- `Message Filtering`: Only forward messages with specific fields or values.

- `Unit Conversion`: Convert sensor data from Celsius to Fahrenheit before publishing.

## Create a Rule

To create a new rule, navigate to the **Rules** section and click the `+ Create` button.

![Create a new Rule](../img/rules/rules.png)

You will be redirected to the rule configuration page. A valid rule must include at least **three nodes**:

- **Input Node** – defines the data source.
- **Logic Node** – applies conditions or transformations.
- **Output Node** – specifies the resulting action.

The rule cannot be saved unless these required nodes are present.

![Created Rule](../img/rules/rule.png)

Click **Save Rule** to open a popup dialog where you can enter the rule name and assign tags.

![Create a Rule Dialog](../img/rules/create-rule-dialog.png)

Once created, the rule is added to the rules list with the following details:

1. **Rule Name**
2. **Status** – Enabled or Disabled
3. **Creation Date**

Each rule entry also provides quick actions for:

- Viewing rule details
- Copying the rule ID
- Enabling/Disabling the rule
- Deleting the rule

![Quick Links](../img/rules/quick-links.png)

## Rule Configuration

On the rule page, you can configure the following:

### 1. Input Node

- Currently, only one input node is supported per rule.

![select input](../img/rules/input-node2.png)

- Select **Channel Subscriber** as the input type.
- Choose the **channel** and **topic** to subscribe to.

  ![input variables](../img/rules/input-variables.png)

- The input node will appear in the layout.

  ![input node](../img/rules/input-node3.png)

### 2. Logic Node

After setting the input, define your rule’s logic using one of three options:

1. Comparison Block
2. Lua Script Editor
3. Go Script Editor

The logic nodes support different message payloads as inputs.  
To utilize the message payload, you can use `message.<key>` in the input. For example if your message is a single SenML message, you can do `message.payload.v` to get the value.

#### Comparison Block

Use `if`, `and` and `or` conditions to evaluate message payloads:

![comparison node](../img/rules/comparison-node.png)

**Supported Payload Structures**:

- Nested objects: `message.<key>.<key>` (e.g., `message.payload.sensor.temperature`).
- **SenML fields**: `v` (numeric), `vs` (string), `vb` (boolean), `vd` (data), `s` (sum).

**Multiple Conditions**:  
Chain conditions with `and` / `or`:

![Add multiple conditions](../img/rules/add-multiple-conditions.png)

#### Script Editors

The script editor allows you to toggle between Lua and Go modes using the selector at the top of the editor:

![toggle script node](../img/rules/toggle-script-nodes.png)

**Toggle between:**

- Lua script mode (default)
- Go script mode

##### Lua Script Editor

Craft your own logic in Lua by implementing a `logicFunction()` that returns either a primitive value or a table.

![lua editor node](../img/rules/lua-editor-node.png)

Example:

```Lua title="Return an object (e.g., converted temperature)"
function logicFunction()
  local converted_temp = (message.payload.v * 1.8 + 32)
  return {n = "Temp_fahrenheit", v = converted_temp, u = "°F", }
end
return logicFunction()
```

```Lua title="Returns a primitive"
function logicFunction()
  return (message.payload.v * 1.8 + 32)
end
return logicFunction()
```

##### Go Script Editor

Write Go-based logic for advanced use cases. Return a value or struct:

![go editor node](../img/rules/go-editor-node.png)

Example:

```go
  package main

  import (
      m "messaging"
  )
  func logicFunction() any {
      return m.message.Payload
  }
```

> **Note:**  
> Output nodes **only trigger if the script returns a truthy value**.  
> If the logic node returns `false`, **the connected output nodes will not be executed**.  
> This allows for conditional flows, ensuring actions such as MQTT publishing, email alerts, or database inserts only occur when the specified logic conditions are satisfied.

### 3. Output Node

You can add one or more output nodes. The following nodes are supported:

1. Channel publisher
2. Email
3. PostgreSQL
4. Alarm
5. Magistrala DB
6. Slack

![select output](../img/rules/output-node.png)

#### Channel Publisher

Enables you to specify the output channel and topic. The result of the logic node is published to this topic.

Select the Channel Publisher as the output node and enter the channel and topic.

![publisher variables](../img/rules/publisher-variables.png)

![publisher node](../img/rules/publisher-node.png)

#### Email

Send results via email with templated fields:

![email variables](../img/rules/email-variables.png)

```go title="Subject"
Current Volume
```

- Use dynamic template fields:
  - `{{.Result}}` — the entire result from logic block
  - `{{.Result.<key>}}` — a specific field from the result
  - `{{.Message.<key>}}` — a field from the original message

```go title="Content"
 Current volume is {{(index .Result 0).v}} {{(index .Result 0).u}}.
```

![email node](../img/rules/email-node.png)

#### PostgreSQL

Store message processing results to your PostgreSQL database. Select the PostgreSQL output node option and enter the following information:

![PostgreSQL variables](../img/rules/postgres-variables.png)

- Host
- Port
- Username
- Password
- Database name
- Table name
- Map data to table columns using templates

```go title="Go template mapping"
{
  "channel": "{{.Message.Channel}}",
  "value":   "{{(index .Result 0).v}}",
  "unit":    "{{(index .Result 0).u}}"
}
```

![PostgreSQL node](../img/rules/postgres-node.png)

#### Internal DB

To be able to store messages in the internal Magistrala DB, you need to create a rule that processes the results. More information about this is in the [Store Messages](#store-messages) section.

![Magistrala DB rule example](../img/rules/internal-db-rule.png)

#### Alarms

An alarm output will enable you to be able to generate alarms in the case where a threshold has been exceeded. More information about this node is provided in the [Alarms](/docs/user-guide/alarms.md) section.

![Alarm rule example](../img/rules/alarm-rule.png)

#### Slack

Slack output enables you to send notifications to a Slack channel when a rule is triggered.

To configure a Slack output node, provide the following fields:

![Slack variables](../img/rules/slack-variables.png)

- **Token**: Your Slack App token (used for authentication).
- **Channel ID**: The ID of the Slack channel where notifications will be sent.
- **Message**: A valid Slack [message payload](https://docs.slack.dev/messaging/#payloads) in JSON format.

  - You can use [**dynamic template fields**](#dynamic-variables-and-templates) in the message object.
  - The payload must follow Slack's structure (e.g., `text`, `blocks`, `attachment`).

  Example:

```json title="Slack Message Payload"
{
  "text": "Temperature alert for {{.Message.sensor}}",
  "attachments": [
    {
      "pretext": "Threshold exceeded",
      "text": "Current temperature is {{.Result.v}} {{.Result.u}}"
    }
  ],
  "icon_url": "http://lorempixel.com/48/48"
}
```

![Slack node](../img/rules/slack-node.png)

## Dynamic Variables and Templates

You can inject dynamic values from your message or logic result using templating variables.

Available template variables:

| Variable                | Description                        | Example                   |
| ----------------------- | ---------------------------------- | ------------------------- |
| `{{.Result}}`           | Entire output from the logic node. | `{{.Result}}`             |
| `{{.Result.<key>}}`     | Field from the logic result.       | `{{.Result.v}}`           |
| `{{.Message.<key>}}`    | Field from the input message       | `{{.Message.Channel}}`    |
| `{{(index .Result 0)}}` | Access slices/arrays               | `{{(index .Result 0).v}}` |

These variables work in outputs like:

- Email (body)

- PostgreSQL (column mapping)

```Lua title="Example usage in Email message"
Current temperature is {{.Result.CelValue}}°C  or ({{.Result.FarValue}}°F).

```

```Lua title="Example usage in PostgreSQL column mapping"
{
  "channel": "{{.Message.Channel}}",
  "value":   "{{(index .Result 0).v}}",
  "unit":    "{{(index .Result 0).u}}"
}

```

## Enable or Disable Rules

To enable or disable a rule:

- Use the toggle at the top right of the rule page.

  ![Disable rule in rule page](../img/rules/disable-rule-toggle.png)

- You can also enable/disable directly from the rule list using the quick actions menu

  ![Disable rule in quick links](../img/rules/disable-rule.png)

## Add a Scheduler

You can configure a scheduler to define when a rule executes.

![Scheduler](../img/rules/scheduler.png)

Fields:

- **Start Time**: Date when the schedule becomes active
- **Time**: Time of day the rule should run
- **Recurring Interval**: Unit of recurrence (e.g., daily, hourly)
- **Recurring Period**: Frequency of execution (e.g., every 2 intervals = every other day/hour)

This helps automate rule execution based on custom schedules.

## Store Messages

To store messages in Magistrala's internal database, you must create a **Rule** for this.

- Magistrala only stores messages in [**SenML** format](https://datatracker.ietf.org/doc/html/rfc8428#section-4.3).
- You can submit data in any format(e.g, JSON), but must convert it to SenML using a Lua script.
  SenML format fields:

  | Name          | Label | CBOR Label | JSON Type   | XML Type    |
  | ------------- | ----- | ---------- | ----------- | ----------- |
  | Base Name     | bn    | -2         | String      | string      |
  | Base Time     | bt    | -3         | Number      | double      |
  | Base Unit     | bu    | -4         | String      | string      |
  | Base Value    | bv    | -5         | Number      | double      |
  | Base Sum      | bs    | -6         | Number      | double      |
  | Base Version  | bver  | -1         | Number      | int         |
  | Name          | n     | 0          | String      | string      |
  | Unit          | u     | 1          | String      | string      |
  | Value         | v     | 2          | Number      | double      |
  | String Value  | vs    | 3          | String      | string      |
  | Boolean Value | vb    | 4          | Boolean     | boolean     |
  | Data Value    | vd    | 8          | String (\*) | string (\*) |
  | Sum           | s     | 5          | Number      | double      |
  | Time          | t     | 6          | Number      | double      |
  | Update Time   | ut    | 7          | Number      | double      |

### Example: Convert JSON to SenML

Assume your incoming payload is:

```json
{
  "temperature": 28.5,
  "unit": "C",
  "sensor": "room-1"
}
```

Use the following scripts to convert it:

```Lua title="Lua script"
function logicFunction()
  return {
    n = message.payload.sensor,
    v = message.payload.temperature,
    u = message.payload.unit
  }
end
return logicFunction()
```

```go title="Go script"
package main
import (
  m "messaging"
)

func logicFunction() any {
  payload := m.message.Payload.(map[string]any)
  return map[string]any{
    "n": payload["sensor"],
    "v": payload["temperature"],
    "u": payload["unit"],
  }
}
```

> This returns a valid SenML message the internal DB will accept.

<br/>

Then set your output node to store this result using the Magistrala Internal DB option.

![Storage with json input](../img/rules/json-input.png)

### Example: Input is SenML

If your message payload is already SenML format, you can just return the message payload directly in your script functions:

```lua title="Lua script"
function logicFunction()
  return message.payload
end
return logicFunction()
```

```go title="Go script"
  package main

  import (
      m "messaging"
  )
  func logicFunction() any {
      return m.message.Payload
  }
```

![Storage with senml input](../img/rules/rule.png)

:::info

With the Rules Engine, users can easily automate data processing pipelines in a powerful and visual way by combining inputs, logical conditions, and flexible outputs.

:::
