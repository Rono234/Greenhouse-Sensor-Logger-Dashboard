# Greenhouse-Sensor-Logger-Dashboard

**Author:** Raneen AlRammahi  
**Course:** CSI-3150  
**Date:** October 11, 2026

# Section 1: The Less-than-or-Equal-to-4-Click User Journey Funnel
- **Starting State:**  
    The user lands on the Greenhouse Sensor Logger dashboard. The initial viewport displays the greenhouse branding, a sensor input form, and a log history panel containing previously saved readings retrieved from localStorage. If no readings are stored, the panel displays an empty-state message.

- **Action 1:**  
    The user selects a greenhouse bay and enters pH, electrical conductivity (EC), air temperature, and relative humidity into their corresponding input fields. the input values are monitored in real time and visual feedback is given when the entered readings violate constraints.

- **Action 2:**  
    The user clicks the "Record Reading" button to submit the form. JavaScript validates the input values, calculates the environmental status (Optimal, Warning, or Critical Hazard), and stores the new reading as a JavaScript object within an array that is saved to localStorage.

- **Action 3:**  
    The newly recorded entry is dynamically added to the sensor log history panel, displaying the greenhouse bay, timestamp, recorded sensor values, and a color-coded environmental status badge. The active log counter is also updated to reflect the new entry.

- **Action 4:**  
    The user can select the "Delete Reading" button on an individual log to remove that entry or activate the "Purge Logs" button to clear the entire history. The interface updates the displayed records and synchronizes the changes with localStorage.

- **Terminal State:**  
    The browser displays the updated sensor log history containing the remaining recorded entries and their calculated environmental statuses. If all entries have been removed, the dashboard returns to its initial empty-state display, indicating that no active sensor readings are logged.

# Section 2: Don Norman Usability & Constraint Audit


| Norman Principle | UI Component / Feature | Context Specific HTML Element or Attribute Used to Enforce Principle |
| :--- | :--- | :--- |
| Gulf of Execution | Typing numeric sensor metrics (pH, ElectricalConductivity[EC], Temp, Humidity) | The `<label>` tag associated with each `<input>` through the `for` and `id` attributes identifies the expected sensor measurement. Unit labels such as °F, mS/cm, and % along with the `placeholder` attribute provide examples of the expected input format. |
| Gulf of Evaluation | Ingesting sensor values after clicking "Record Reading" | After the user submits the form, JavaScript evaluates the recorded sensor values and dynamically creates a log entry with a `<span>` status badge displaying "Optimal", "Warning", or "Critical Hazard". CSS classes provide color-coded feedback to communicate the resulting environmental condition. |
| System Constraint | E.g. Water pH Boundaries (0.0 <= pH <= 14.0) | The `<input type="number">` tag uses native `min`, `max`, `step`, and `required` attributes to constrain the accepted values. For example, pH is restricted to values between 0 and 14, while relative humidity is restricted to 0–100%. JavaScript additionally checks input validity before allowing the reading to be stored. |
| Visual Feedback State | Real-Time Input Error / Out-of-Bounds | JavaScript `input` event listeners monitor the sensor fields as the user types. When a value violates physical constraints or exceeds the optimal growth range, JavaScript applies a CSS class to the corresponding `<input>` element to change its border color and displays an error or warning message through a `<small>` element. |
| Error Recovery | Accidental or test data submissions | A `<button>` element attached to each dynamically generated log entry allows users to remove an individual reading, while the "Purge Logs" button clears the entire log history. JavaScript `click` event listeners update the in-memory array, localStorage, and displayed DOM elements to reflect these changes. |

# Section 3: Semantic Component & Layout Tree

```text
index.html
│
├── <body> [STATIC]
│   │
│   ├── <header> [STATIC] (CSS: display: flex; justify-content: center)
│   │   ├── <div class="header-content"> [STATIC]
│   │       (CSS: display: flex; justify-content: space-between)
│   │       │
│   │       ├── <div class="brand"> [STATIC]
│   │       │   (CSS: display: flex; align-items: center)
│   │       │   │
│   │       │   ├── <span class="brand-icon"> [STATIC]
│   │       │   │   └── Greenhouse Icon
│   │       │   │
│   │       │   └── <h1> [STATIC]
│   │       │       └── "Greenhouse Sensor Logger"
│   │       │
│   │       └── <p class="header-status"> [STATIC]
│   │           ├── "Active Logs:"
│   │           └── <span id="queue-count"> [STATIC]
│   │               └── "0" (JS: textContent updated)
│   │
│   ├── <main> [STATIC]  (CSS: display: grid; grid-template-columns: 1fr 1fr)
│   │   │
│   │   ├── <section class="panel form-panel"> [STATIC] (CSS: display: flex; flex-direction: column)
│   │   │   │
│   │   │   ├── <h2 class="panel-title"> [STATIC]
│   │   │   │   └── "Record Sensor Readings"
│   │   │   │
│   │   │   ├── <p id="form-error-banner" class="alert alert-danger hidden" role="alert">[STATIC] {JS:textContent/classList updated}
│   │   │   │
│   │   │   └── <form id="sensor-form"> [STATIC]
│   │   │       ├── novalidate
│   │   │       ├── Event: submit
│   │   │       │
│   │   │       ├── <div class="form-group"> [STATIC]
│   │   │       │   ├── <label for="bay"> [STATIC]
│   │   │       │   │   └── "Greenhouse Bay"
│   │   │       │   │
│   │   │       │   └── <select> [STATIC]
│   │   │       │       ├── id="bay"
│   │   │       │       ├── name="bay"
│   │   │       │       ├── required
│   │   │       │       ├── <option value="">
│   │   │       │       │   └── "Select Bay"
│   │   │       │       ├── <option value="A">
│   │   │       │       │   └── "Bay A"
│   │   │       │       ├── <option value="B">
│   │   │       │       │   └── "Bay B"
│   │   │       │       └── <option value="C">
│   │   │       │           └── "Bay C"
│   │   │       │
│   │   │       ├── <div class="form-row"> [STATIC] (CSS: display: grid; grid-template-columns: 1fr 1fr)
│   │   │       │   │
│   │   │       │   ├── <div class="form-group"> [STATIC]
│   │   │       │   │   ├── <label for="ph"> [STATIC]
│   │   │       │   │   │   └── "pH Level"
│   │   │       │   │   │
│   │   │       │   │   ├── <input> [STATIC]
│   │   │       │   │   │   ├── id="ph"
│   │   │       │   │   │   ├── name="ph"
│   │   │       │   │   │   ├── type="number"
│   │   │       │   │   │   ├── min="0"
│   │   │       │   │   │   ├── max="14"
│   │   │       │   │   │   ├── step="any"
│   │   │       │   │   │   ├── placeholder="6.0"
│   │   │       │   │   │   ├── required
│   │   │       │   │   │   └── Event: input
│   │   │       │   │   │
│   │   │       │   │   └── <small id="ph-error"> [STATIC] {JS: error text / class updated}
│   │   │       │   │
│   │   │       │   └── <div class="form-group"> [STATIC]
│   │   │       │       ├── <label for="ec"> [STATIC]
│   │   │       │       │   └── "EC (mS/cm)"
│   │   │       │       │
│   │   │       │       ├── <input> [STATIC]
│   │   │       │       │   ├── id="ec"
│   │   │       │       │   ├── name="ec"
│   │   │       │       │   ├── type="number"
│   │   │       │       │   ├── min="0"
│   │   │       │       │   ├── max="none"
│   │   │       │       │   ├── step="any"
│   │   │       │       │   ├── placeholder="1.5"
│   │   │       │       │   ├── required
│   │   │       │       │   └── Event: input
│   │   │       │       │
│   │   │       │       └── <small id="ec-error"> [STATIC] {JS: error text / class updated}
│   │   │       │
│   │   │       ├── <div class="form-row"> [STATIC] (CSS: display: grid; grid-template-columns: 1fr 1fr)
│   │   │       │   │
│   │   │       │   ├── <div class="form-group"> [STATIC]
│   │   │       │   │   ├── <label for="temp"> [STATIC]
│   │   │       │   │   │   └── "Air Temperature (°F)"
│   │   │       │   │   │
│   │   │       │   │   ├── <input> [STATIC]
│   │   │       │   │   │   ├── id="temp"
│   │   │       │   │   │   ├── name="temp"
│   │   │       │   │   │   ├── type="number"
│   │   │       │   │   │   ├── min="none"
│   │   │       │   │   │   ├── max="none"
│   │   │       │   │   │   ├── step="any"
│   │   │       │   │   │   ├── placeholder="68.0"
│   │   │       │   │   │   ├── required
│   │   │       │   │   │   └── Event: input
│   │   │       │   │   │
│   │   │       │   │   └── <small id="temp-error"> [STATIC] {JS: error text / class updated}
│   │   │       │   │
│   │   │       │   └── <div class="form-group"> [STATIC]
│   │   │       │       ├── <label for="humidity"> [STATIC]
│   │   │       │       │   └── "Relative Humidity (%)"
│   │   │       │       │
│   │   │       │       ├── <input> [STATIC]
│   │   │       │       │   ├── id="humidity"
│   │   │       │       │   ├── name="humidity"
│   │   │       │       │   ├── type="number"
│   │   │       │       │   ├── min="0"
│   │   │       │       │   ├── max="100"
│   │   │       │       │   ├── step="any"
│   │   │       │       │   ├── placeholder="60"
│   │   │       │       │   ├── required
│   │   │       │       │   └── Event: input
│   │   │       │       │
│   │   │       │       └── <small id="humidity-error"> [STATIC]
│   │   │       │           └── JS: error text / class updated
│   │   │       │
│   │   │       └── <button> [STATIC]
│   │   │           ├── id="btn-submit"
│   │   │           ├── type="submit"
│   │   │           └── "Record Reading"
│   │   │
│   │   └── <section class="panel records-panel"> [STATIC]
│   │       (CSS: display: flex; flex-direction: column)
│   │       │
│   │       ├── <header class="records-header"> [STATIC]
│   │       │   (CSS: display: flex; justify-content: space-between)
│   │       │   │
│   │       │   ├── <h2 class="panel-title"> [STATIC]
│   │       │   │   └── "Sensor Log History"
│   │       │   │
│   │       │   └── <button> [STATIC]
│   │       │       ├── id="btn-clear-all"
│   │       │       ├── type="button"
│   │       │       ├── Event: click
│   │       │       └── "Purge Logs"
│   │       │
│   │       ├── <section id="empty-state"> [STATIC]
│   │       │   ├── CSS: text-align: center
│   │       │   ├── JS: classList show/hide
│   │       │   │
│   │       │   ├── <span class="empty-icon"> [STATIC]
│   │       │   │   └── Greenhouse Icon
│   │       │   │
│   │       │   └── <p> [STATIC]
│   │       │       └── "No Sensor Readings Logged"
│   │       │
│   │       └── <ul id="records-list"> [STATIC]
│   │           ├── class="records-grid"
│   │           ├── aria-live="polite"
│   │           ├── CSS: display: grid
│   │           ├── Event: click (delegated delete)
│   │           ├── JS: child nodes inserted / removed
│   │           │
│   │           └── <li class="record-card"> [DYNAMIC]
│   │               │
│   │               └── <article> [DYNAMIC]
│   │                   ├── <h3> [DYNAMIC]
│   │                   │   └── Greenhouse Bay Name
│   │                   │
│   │                   ├── <time> [DYNAMIC]
│   │                   │   └── Reading Timestamp
│   │                   │
│   │                   ├── <p> [DYNAMIC]
│   │                   │   └── pH Value
│   │                   │
│   │                   ├── <p> [DYNAMIC]
│   │                   │   └── EC Value (mS/cm)
│   │                   │
│   │                   ├── <p> [DYNAMIC]
│   │                   │   └── Temperature (°F)
│   │                   │
│   │                   ├── <p> [DYNAMIC]
│   │                   │   └── Humidity (%)
│   │                   │
│   │                   ├── <span class="status-badge"> [DYNAMIC]
│   │                   │   └── "Optimal / Warning / Critical Hazard"
│   │                   │
│   │                   └── <button class="btn-delete"> [DYNAMIC]
│   │                       ├── type="button"
│   │                       └── "Delete Reading"
│   │
│   └── <footer class="portal-footer"> [STATIC]
│       └── <p> [STATIC]
│           └── "© 2026 Greenhouse Sensor Logger"
```

# Section 4: Data Schema

The Greenhouse Sensor Logger application will store each recorded sensor reading as a JavaScript object. Each object contains the greenhouse bay identifier, the four sensor measurements, the calculated environmental classification, and a timestamp. The individual objects are stored within an array and saved persistently using the browser's localStorage.
 ```
const sensorReadingSchema = {
  id: "String",           // Unique identifier for each sensor log
  bay: "String",          // Greenhouse bay identifier (A, B, or C)
  ph: "Number",           // pH measurement (0–14)
  ec: "Number",           // Electrical conductivity (mS/cm)
  temperature: "Number",  // Air temperature in Fahrenheit
  humidity: "Number",     // Relative humidity percentage (0–100)
  status: "String",       // Optimal, Warning, or Critical Hazard
  timestamp: "String"     // Date and time of recorded reading (ISO 8601)
};
```
The application maintains an array of recorded sensor objects in memory. When a new reading is submitted, JavaScript appends the object to the array and saves the updated collection to localStorage using JSON.stringify(). When the page is refreshed, JSON.parse() retrieves the stored collection and restores the sensor log history.

When an individual record is deleted or the entire history is purged, the updated array is saved back to localStorage to maintain consistency between the displayed interface and the stored data.
