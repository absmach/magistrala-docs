---
title: Metadata Management
description: Manage entity metadata with various value types and interactive maps
keywords:
  - Magistrala Metadata
  - Entity Management
  - Location Data
  - Perimeter Mapping
  - JSON Editor
  - Interactive Maps
image: /img/mg-preview.png
---

## Overview

Metadata provides additional context and information for entities (clients, channels, groups, and domains) in Magistrala. The metadata system supports various value types including text, numbers, booleans, JSON objects, locations, and perimeters.

## Managing Metadata

### Accessing Metadata

1. Navigate to any entity's view page
2. Click the **Metadata** tab
3. View existing metadata or add new entries

![Metadata tab](../img/metadata/metadata-tab.png)

### Adding Metadata

1. Click **+ Add Metadata** button
2. Configure the metadata entry:
   - **Key**: Unique identifier for the metadata field
   - **Value Type**: Select the appropriate data type
   - **Value**: Enter or configure the value based on the selected type

![Add metadata dialog](../img/metadata/add-metadata-dialog.png)

## Value Types

### Text and Number

Standard input fields for text strings and numeric values.

### Boolean

Dropdown selector with True/False options.

### JSON

Code editor with syntax highlighting for JSON objects. Validates JSON structure automatically.

![JSON editor](../img/metadata/json-editor.png)

### Location

Interactive map interface for setting geographic coordinates.

#### Setting a Location

1. Select **Location** as the value type
2. Use one of these methods:
   - **Map Interaction**: Click and drag the marker to the desired location
   - **Search**: Type a location name in the search field and select from up to 5 recommendations

![Location map](../img/metadata/location-map.png)

### Perimeter

Interactive map for defining geographic boundaries using polygons, circles, or rectangles.

#### Polygon Perimeter

1. Select **Perimeter** as the value type
2. Choose **Polygon** from the perimeter options
3. Click **Draw** to enable drawing mode
4. Place points by clicking on the map
5. Complete the polygon by:
   - Clicking **Complete** button, or
   - Clicking the first point (works best when zoomed in)

**Editing Polygons:**

- Drag points to adjust the shape
- Click **Clear** to delete and start over

![Polygon perimeter](../img/metadata/perimeter-polygon.png)

#### Circle Perimeter

1. Select **Perimeter** as the value type
2. Choose **Circle** from the perimeter options
3. Click **Draw Circle**
4. Click to place the center point
5. Move the cursor away from center to set the radius

**Editing Circles:**

- Drag the center to move the circle
- Drag points on the circumference to adjust radius

![Circle perimeter](../img/metadata/perimeter-circle.png)

#### Rectangle Perimeter

1. Select **Perimeter** as the value type
2. Choose **Rectangle** from the perimeter options
3. Click **Draw Rectangle**
4. Click to place the first corner
5. Click to place the opposite corner

**Editing Rectangles:**

- Drag any of the 4 corner points to resize

![Rectangle perimeter](../img/metadata/perimeter-rectangle.png)

## Editing Metadata

1. Click the **pencil** icon next to any metadata entry
2. Modify the key, value type, or value as needed
3. Click **Save** to confirm changes or **Cancel** to discard

## Deleting Metadata

1. Click the **trash** icon next to the metadata entry
2. Confirm deletion in the dialog

## Best Practices

- Use descriptive keys that clearly identify the metadata purpose
- Choose appropriate value types to ensure data integrity
- For location data, verify coordinates are accurate before saving
- When creating perimeters, ensure adequate zoom level for precision
- Use JSON metadata for complex structured data that doesn't fit other types
