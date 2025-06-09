---
title: Gauges
---


**Gauges** are essential widgets for visualizing the latest values from a connected **Client** or **Channel**. They provide an intuitive way to track metrics such as voltage, speed, or temperature.

  <!-- ![Gauge Chart Example](../../img/dashboards/gauge-chartexample.png) -->

Magistrala offers different types of gauges, including:

- **Simple Gauge**
- **Temperature Gauge**
- **Speed Gauge**

Each gauge widget can be configured to show specific values based on the connected devices. Below is an overview of how to create and configure each gauge type.

---

### Simple Gauge

The **Simple Gauge** widget displays the latest value from a selected data source, like voltage, pressure, or other metrics. The gauge is customizable, allowing users to set the minimum and maximum value range, update intervals and title.

#### Create a Simple Gauge

1. Ensure the dashboard is in **Edit Mode**.
2. Click the `Add Widget` button and select **Simple Gauge** from the widget list. This will open the **Create Gauge Chart** dialog.

  ![Simple Gauge Selection](../../img/dashboards/gauge-type-filter.png)

3.**Gauge Type**: Select **Simple Gauge** from the dropdown.  
4. **Channel**: Choose the **Channel** that will provide the data for the gauge.  
5. **Client**: Select the **Client** (device/entity) that is connected to the Channel whose data will be visualized.  
6. **Value Name**: Specify the name of the value to fetch messages (e.g., `demovoltage`).  

  ![Simple Gauge Configuration](../../img/dashboards/create-simplegauge.png)

**Time Window Section**  
7. **From**: Set the from date.  
8. **To Value**: Set the to date.  
9. **Aggregation Interval**: Select an aggregation interval e.g maximum.  
10. **Aggregation Interval**: Enter an aggregation interval e.g 10s

 ![Gauge Timewindow](../../img/dashboards/gaugechart-timewindow.png)

**Settings Section**  
11. **Minimum Value**: Set the minimum value for the gauge, which could represent the lower limit of the metric you're tracking (e.g., `50000` for voltage).  
12. **Maximum Value**: Set the maximum value for the gauge (e.g., `100000` for voltage).  
13. **Update Interval**: Specify how frequently the gauge should update its value (in seconds). For instance, an interval of `600` seconds means the gauge will update every 10 minutes.  
14. **Title**: Enter a descriptive title for the gauge (e.g., "Monical Voltage").  
15. **Unit**: Select the unit needed for the Simple Gauge. Available units can be chosen from the list:  

  ![Gauge Settings](../../img/dashboards/settings-gaugechart.png)

After configuring the gauge, click `Create` to save and add the widget to the dashboard.  

Once the widget is added, the gauge will immediately begin displaying the latest value based on the applied settings.

  ![Simple Gauge Created](../../img/dashboards/new-simplegauge.png)

### Temperature Gauge

The **Temperature Gauge** widget operates similarly to the Simple Gauge but is specifically designed for **temperature** values. It displays the latest temperature data from a connected device.

#### Create a Temperature Gauge

1. Start by putting the dashboard in **Edit Mode**.
2. Click `Add Widget` and select **Temperature Gauge** from the list. This will open the temperature gauge configuration dialog.
3. **Gauge Type**: Select **Temperature Gauge** from the dropdown.
4. **Channel**: Choose the **Channel** that will provide the temperature data.
5. **Client**: Select the **Client** (device) connected to the channel.
6. **Value Name**: Enter the value name for the temperature data that will be used to fetch messages(e.g., `tempValue`).

  ![Temperature Gauge Configuration](../../img/dashboards/create-temperature-gauge.png)

**Time Window Section**  
7. **From**: Set the from date.  
8. **To Value**: Set the to date.  
9. **Aggregation Interval**: Select an aggregation interval e.g maximum.  
10. **Aggregation Interval**: Enter an aggregation interval e.g 10s

**Settings Section**  
11. **Minimum Value**: Set the minimum value for the gauge (e.g., `0` for temperatures in degrees Celsius).  
12. **Maximum Value**: Set the maximum value for the gauge (e.g., `200` for temperatures in degrees Celsius).  
13. **Update Interval**: Define the update frequency (in seconds), such as `60` seconds for a 5-minute update cycle.  
14. **Title**: Provide a title for the temperature gauge (e.g., "Monical Temperature Gauge").  
15. **Unit**: Select the unit needed for the temperature gauge. It will show up on the gauge chart. The options available are Degrees Celcius, Kelvin and Farenheight as shown below:  

  ![Temperature Gauge Settings](../../img/dashboards/temperature-gauge-units.png)
  
Click **Create** to add the Temperature Gauge to your dashboard. The gauge will immediately start reflecting the latest temperature readings.  

  ![Temperature Gauge Created](../../img/dashboards/new-temperaturegauge.png)

---

### Speed Gauge

The **Speed Gauge** widget tracks speed or velocity values from connected devices. It functions similarly to the Simple and Temperature Gauges, but with units and appearance tailored to speed data.

#### Create a Speed Gauge

1. Ensure the dashboard is in **Edit Mode**.
2. Click `Add Widget` and select **Speed Gauge** from the list of available widgets.
3. **Gauge Type**: Select **Speed Gauge**.
4. **Channel**: Select the **Channel** providing the speed data.
5. **Client**: Choose the connected **Client** (device).
6. **Value Name**: Enter the name of the value that corresponds to speed (e.g., `speedValue`).

  ![Speed Gauge Configuration](../../img/dashboards/create-speedgauge.png)
**Time Window Section**  
7. **From**: Set the from date.  
8. **To Value**: Set the to date.  
9. **Aggregation Interval**: Select an aggregation interval e.g maximum.  
10. **Aggregation Interval**: Enter an aggregation interval e.g 10s

**Settings Section**  
11. **Minimum Value**: Set the minimum speed value (e.g., `0`).  
12. **Maximum Value**: Set the maximum speed value (e.g., `1000` for kilometers per hour).  
13. **Update Interval**: Set how frequently the gauge should refresh (e.g., every `60` seconds).  
14. **Title**: Provide a title for the speed gauge (e.g., "Monical Speed Gauge").  
15. **Unit**: Select the unit needed for the simple gauge. It will show up on the gauge chart. There is a list of Units you can choose from for speed gauge.  

   ![Speed Gauge Settings](../../img/dashboards/create-speedgauge-unit.png)

 Click **Create** to save the Speed Gauge widget. The gauge will then start showing the latest speed data.  

   ![Speed Gauge Created](../../img/dashboards/new-speedgauge.png)

---

### Edit the Gauge

The gauge can be edited later by clicking the `pencil` icon on the widget. This allows for adjustments to data sources, value names, titles or other settings.

  ![Simple Gauge Editing](../../img/dashboards/edit-gauge-settings.png)

#### **Conclusion**

**Gauges** provide an effective and visual way to track live data for various metrics. Whether monitoring voltage, temperature, or speed, these widgets offer flexibility in displaying the most important data from connected IoT devices.

Each gauge can be customized with specific value ranges, update intervals, and labels, making them adaptable to any use case. Existing gauges can also be edited to adjust settings as monitoring needs evolve.
