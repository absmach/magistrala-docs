---
slug: magistrala-ui-guide
title: Step-by-Step Guide to the Magistrala IoT UI Platform
authors: ian
description: A comprehensive walkthrough of the Magistrala IoT UI Platform — learn how to register, manage domains, connect clients, create rules, send messages, raise alarms, build dashboards, and more, all through a powerful visual interface.
tags:
  [
    iot,
    magistrala,
    low-code,
    real-time-processing,
    rules-engine,
    dashboards,
    alarm-management,
    open-source,
    observability,
    ui-ux,
    user-guide,
  ]
---

# Step-by-Step Guide to the Magistrala IoT UI Platform

Magistrala is an open-source IoT messaging platform designed for real-time data collection, routing, rule processing, alerting, and reporting. While it offers a robust API and CLI experience, Magistrala also comes with a powerful **Graphical User Interface (UI)** for users who prefer a visual approach.

In this guide, we’ll walk through every major feature available in the UI—from onboarding to advanced rule-based automation and reporting—so you can unlock the full potential of Magistrala.

## Step 1: Register and Sign In

Start by registering a new user account.

1. Visit the Magistrala UI registration page and fill in your details. Click on the `Sign Up` button to create the account.

   ![Register page](./register.png)

> Ensure your username is unique, you are using a valid email address, and your password contains 8–24 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character.

## Step 2: Create a New Domain

A **domain** in Magistrala is a logically isolated environment where you manage your IoT ecosystem—including clients, channels, rules, alarms, dashboards, and more. Think of it as your private workspace for managing related devices and data flows.

To create a new domain:

1. After registration, you will be redirected to the Domains page.

   ![Domains page](./view-domains-page.png)

2. Click on the `Create Domain` button.
3. The **name** and **route** fields are required. The **route** must be **unique**.

   ![Create a domain form.](./create-domain-form.png)

4. Optional parameters include:

   - ID: Use a custom domain ID instead of an auto-generated one.
   - tags: Useful for categorising or filtering domains.
   - Logo: Upload an image/logo to visually represent your domain in the UI.
   - metadata: Attach any custom JSON key-value pairs (e.g., project type, environment, or business unit identifiers).

     ![Optional parameters](./optional-domain-parameters.png)

After creation, the domain will appear on your homepage.

![Domain cards](./domains-cards.png)

## Step 3: Manage the Domain

1. Click on the domain card to manage the domain.
2. Once inside the domain, the **Home Dashboard** will display key metrics:
   - Number of enabled and disabled **members**.
   - Number of enabled and disabled **clients**.
   - Number of enabled and disabled **channels**.
   - Number of enabled and disabled **groups**.
   - List of your latest **dashboards**.

![Domain metrics](./domain-metrics.png)

> Since this is a new domain, most counts will be 0 — except for members, where you are currently the only one.

3. Click on the `Domain` tab in the sidebar to manage domain information. From this page, you can:

   - Edit the domain name
   - Add or update tags
   - Upload a logo
   - Attach custom metadata (JSON format)
   - Enable or disable the domain
   - Copy the domain ID and route URL for reference.

   ![Domain info](./domain-info.png)

4. Click on `Members` to manage domain members. On this page, you can assign a user directly to the domain with a given role. You can search for a user by username. Once assigned, you can remove a user from the domain by clicking the trash icon.

   ![Domain members](./domain-members.png)

5. Navigate to the `Roles` tab to manage domain roles. You can create, update, and delete roles from this page.

![Create role](./create-domain-role.png)

![Domain roles](./domain-roles.png)

6. To invite a user to the domain, click on `Invitations` to open the invitations page. Here, you can search for a user by username and invite them to the domain with a specified role.

![Send invitation.](./send-invitation.png)

![Domain invitations](./domain-invitations.png)

## Step 4: Create and Manage Groups

Groups help you logically organise clients and channels.

1. To create a group, navigate to the `Groups` tab in the sidebar and click on the `+ Create` button. Enter the following fields:
   - Name (required)
   - Description
   - Parent group
   - Metadata
2. Once the group is created, you can manage it on the group page. On this page, you can:
   - Update the group name and description
   - Attach custom metadata (JSON format)
   - Enable or disable the group
   - Copy the group ID
   - Assign a parent group
   - Share the group with other domain members
   - Delete the group

## Step 5: Create and Manage Channels

While on the group page, navigate to the `Channels` tab in the top navigation. Alternatively, you can manage channels globally from the sidebar if you don’t want to assign a channel to any group.

1. Click on `+ Create` to create a new channel. Provide the following:
   - Name (required)
   - Route: Can be used instead of the full UUID
   - Tags
   - Metadata
2. You can also assign existing channels to the group by clicking the `Assign Channels` button and selecting the desired channels.
3. After adding the channel, click on its row to view and manage it.

## Step 6: Create and Manage Clients

Navigate to the `Clients` tab in the group’s top navigation. On this page:

1. Click on `+ Create` to add a new client. Fill in the following:
   - Name (required)
   - Key: Used to authorise the client to send messages
   - Tags
   - Metadata
2. Optionally assign existing clients to the group via the `Assign Clients` button.
3. Once the client has been added, click on its row to view and manage the client.

## Step 7: Connect Clients to Channels

While on the client’s detail page:

1. Navigate to the `Connections` tab in the top navigation.
2. Click on the `Connect` button, select the channels to connect to, and choose the connection type—`subscribe`, `publish`, or `both`.

You can also connect a client via the `Connections` tab within the channel section.

## Step 8: Create a Rule to Save Messages

To store messages in Magistrala’s internal storage, you must create a rule. The Rules Engine provides powerful, flexible message processing via scriptable rules.

1. Navigate to the `Rules` page on the sidebar. This page allows you to list, create, and manage rules.
2. Click on `+ Create` to open the rule creation page.
3. Add:

   - **Input Node**: Select the channel and optionally specify a topic.
   - **Logic Node**: Choose `Add Logic`, then use the `Code Editor`. The default Lua script stores messages in SenML format. If your messages use another format (e.g., JSON), see the [storage guide](https://docs.magistrala.abstractmachines.fr/user-guide/rules-engine#store-messages).
   - **Output Node**: Select the `Internal DB` option.

   > To learn more about these please view our user guide docs on the [Rules Engine](https://docs.magistrala.abstractmachines.fr/user-guide/rules-engine#view-a-rule).

4. Optionally, visually connect nodes to illustrate data flow.
5. Click Save Rule and provide a descriptive name.
6. Optionally schedule the rule to trigger periodically.

## Step 9: Send a Message in a Channel via the UI

To send a message in a channel via the UI:

1. On the channel’s detail page, click the `Messages` tab.
2. Click on `Send Message` and fill in:

   - **Name**: Value name (n)
   - **Unit**: Optional unit (u)
   - **Value Type**: number (v), string (vs), data (vd), boolean (vb), or sum (s)
   - **Value**: The actual value
   - **Publisher**: The client sending the message
   - **Subtopic**: Optional filter for message grouping

3. If a storage rule exists, the message will appear in the table.
4. Use `Download` to export messages in CSV format.
5. Use `Filter` to customise which messages are shown in the table.

## Step 10: Create Alarms using Rules

Magistrala supports alarm creation to monitor various system measurements.

1. Go to the `Rules page` and click on the `+ Create Rule` button.
2. Add the following nodes:
   - **Input**: Channel Subscriber
   - **Logic**: Code Editor (Lua or Go)
   - **Output**: Alarm
3. In the `Code Editor`, add the logic for triggering the alarm using your preferred scripting language (Lua or Go).

   ```lua title="Lua Script Alarm Example"
   function logicFunction()
      local results = {}
      local threshold = 20000

      for _, msg in ipairs(message.payload) do
         local value = msg.v
         local severity
         local cause

         if value >= threshold * 1.5 then
               severity = 5
               cause = "Critical level exceeded"
         elseif value >= threshold * 1.2 then
               severity = 4
               cause = "High level detected"
         elseif value >= threshold then
               severity = 3
               cause = "Threshold reached"
         end

         table.insert(results, {
               measurement = msg.n,
               value = tostring(value),
               threshold = tostring(threshold),
               cause = cause,
               unit = msg.unit,
               severity = severity,
         })
      end

      return results
   end
   return logicFunction()
   ```

   ```go title="Go Script Alarm Example"
   package main

   import (
   m "messaging"
   "fmt"
   "strconv"
   )


   type alarm struct {
   Measurement string
   Value       string
   Threshold   string
   Cause       string
   Unit        string
   Severity    uint8
   }

   func logicFunction() any {
   results := []alarm{}
   threshold := 20000.0
   pld, ok := m.message.Payload.([]any)
   if !ok {
   panic("invalid payload")
   }
   for _, m := range pld {
   if m == nil {
   continue
   }
   msg, ok := m.(map[string]any)
   if !ok {
      panic("not map")
   }

   value := msg["v"].(float64)
   unit := msg["u"].(string)
   msmnt := msg["n"].(string)
   var severity uint8
   var cause string

   switch {
   case value >= threshold*1.5:
   severity = 5
   cause = "Critical level exceeded"
   case value >= threshold*1.2:
      severity = 4
   cause = "High level detected"
   case value >= threshold:
      severity = 3
      cause = "Threshold reached"
   }

   result := alarm{
      Measurement: msmnt,
      Value:       strconv.FormatFloat(value, 'f', -1, 64),
      Threshold:   strconv.FormatFloat(threshold, 'f', -1, 64),
      Cause:       cause,
      Unit:        unit,
      Severity:    severity,
   }
   results = append(results, result)
   }
   fmt.Println("returning", len(results))

   return results
   }
   ```

4. The returned alarm object must include:

   - Measurement
   - Value
   - Threshold
   - Cause
   - Severity

5. Once your rule is complete, click `Save Rule`, provide a name, and create the rule. When conditions are met, an alarm will be triggered and saved.

## Step 11: View Alarms in the Alarms Page

To view alarms, click on `Alarms` in the sidebar. This page shows you all your alarms that are present in the system.

## Step 12: Generate, Schedule and Update Reports

To generate reports:

1. Click on `Reports` in the sidebar.
2. Click the `+ Create Report` button.
3. On this page, you can set up a couple of things:

   - **Report configuration**
     - **Name** of the report configuration.
     - **Description**
     - **Title** of the Report (Will appear on the report pdf)
     - Report **format** (can be `pdf` or `csv`)
     - **Start Time**—The start period for filtering the messages to be added in the report. e.g., if you want the start time to be from yesterday, you will have the start time as `1d`
     - **End Time**—The end period for filtering the messages to be added in the report. If you want the report to be for up to right now, you can leave this field empty.
     - **Aggregation method**—None, max, min, sum, count, average
     - **Aggregation Interval**—This is required when the aggregation method is selected. Used to group the messages based on the aggregation method.
   - **Report Metrics**—A report can contain multiple metrics. A metric basically contains filtering parameters for a message.
     - **Name**—The name of the metric/message
     - **Channel**—The channel the messages are published to
     - **Client(s)**—The clients publishing the messages
     - **Subtopic**—The subtopic the messages are being published to
     - **Protocol**—The protocol used to publish the messages

4. Once the above is set, you can `Generate Instant Report` to generate a report for you on the UI. This is useful to see if the configuration is set correctly.
5. Once you verify it works as expected, you can `Download Report` to download the report instantly.
6. If you wish to email the report, click on `Email Report` and enter the **recipients**, **subject**, and **content**, then click on `Email Report`. This will send the generated report to the emails specified in the recipients.
7. If you want the report generation to recur, you can schedule the report. Click on `Schedule`, and enter the `Email Configuration` and `Schedule Configuration`. The schedule configuration contains:
   - **Active From**—This is the date when the report generation becomes active. This time should be later than the current time at report configuration creation.
   - **Recurring Interval**—This is how often the report generation event should repeat. Can be none (for one-time events), daily, weekly, or monthly.
   - **Recurring Period**—This is how many intervals to skip between report generation executions. e.g., 1 = every interval, 2 = every second interval, etc.
8. Click on `Schedule Report to save the configuration`. This redirects you back to the reports page, where you can see all your report configurations.
9. To update a report configuration, click on that particular configuration row. It will redirect you to the view config page.
10. On this page, you can update all the report configuration parameters as well as download an instant report.

## Step 13: Manage Dashboards

Magistrala offers a powerful, customisable visualisation dashboard. You can add widgets, share dashboards, and tailor them for different screen sizes.

To create a dashboard:

1. Click on the `Dashboards` tab in the sidebar.
2. Click `+ Create`, and provide:
   - Name (required)
   - Description, tags, thumbnail
   - Share option (none, domain members, selected members, or public)
3. After creation, dashboards appear as cards or tables (toggle with `Show Table`).
4. You can upload dashboards via templates—see [here](https://github.com/absmach/magistrala-ui/blob/main/samples/dashboard-templates) for examples.
5. Click a dashboard card to view it.
6. Switch on `Edit Mode` to begin customising.
7. Click `+ Add Widget` and choose from:
   - **Timeseries Widgets**
     - Area chart
     - Line chart
     - Bar chart
     - Pie Chart
     - Value Card
     - Gauge Chart
   - **Entity Widgets**
     - Count Card
     - Table Card
   - **Control Widgets**
     - Switch
     - Slider
   - **Map Widgets**
     - Route Map
     - Marker Map
     - Polygon Map
8. To add a widget, click on the specific widget you want to add, enter the required details, and click on `Create`. The widget will appear on the dashboard canvas. Once the widget is on the canvas, you are able to reposition it on the canvas, refresh the data for the individual widget, edit the widget details, and delete the widget, and in case you have no data, you can `Enable Dummy Data`. This helps you visualise how the widget would look with actual data.
9. Furthermore, we allow you to design your dashboard for multiple layouts to support responsive dashboards. You can choose between `Desktop`, `Laptop`, `Tablet`, `Large Phone`, or `Small Phone`.

## Step 14: Update User Preferences

To update your personal preferences and settings:

1. Click on the user nav on the top right corner of the screen and select the `Profile` option. This will take you to the **Profile Page**. On this page a user is able to manage their account settings, update their password, and also manage their preferences.
2. The first tab `Account` contains the user's account settings. These are
   - Profile Picture
   - Email Address
   - Username
   - First and Last Names
3. To update the profile picture, drag and drop your preferred image, then click on `Upload Profile Picture`.
4. To update the other details, make the changes, then click on the `Update` button on the bottom right corner of the page.
5. The second tab, `Password`, allows the user to update their password. On this page you need to enter the **current password**, the **new password**, and the **confirm password**, which is a repetition of the new password.
6. The third tab, `Preferences`, allows a user to manage their personal preferences in terms of the app theme and language.
7. Theme-wise we currently support:
   - Default
   - MidnightSky (our dark theme)
   - Teal Tide
   - Gray Wave
8. For languages, we currently support three languages:
   - English
   - Serbian
   - German
9. To update these preferences, select whichever option you want, then click on `Update Preferences`.

## Conclusion

Magistrala’s UI combines flexibility, usability, and powerful capabilities to help you manage your IoT ecosystem effectively—all from one centralised platform. Whether you are onboarding clients, routing data, building dashboards, or triggering alarms based on complex conditions, the UI provides an intuitive, low-code interface to support every step.

We hope this guide has made your journey smoother and more productive. If you'd like to explore deeper, check out our [official documentation](https://docs.magistrala.abstractmachines.fr) or connect with the community on [GitHub](https://github.com/absmach/magistrala).

> **Start building smarter, faster, and more reliable IoT solutions today — with [Magistrala](https://www.absmach.eu/magistrala/).**
