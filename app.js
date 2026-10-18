(function () {
  "use strict";

  const STORAGE_KEY = "greenhouse_sensor_records";

  // HTML ELEMENTS
  const sensorForm = document.getElementById("sensor-form");
  const recordsList = document.getElementById("records-list");
  const queueCount = document.getElementById("queue-count");
  const emptyState = document.getElementById("empty-state");
  const btnClearAll = document.getElementById("btn-clear-all");
  const inputBay = document.getElementById("bay");
  const inputPh = document.getElementById("ph");
  const inputEc = document.getElementById("ec");
  const inputTemp = document.getElementById("temp");
  const inputHumidity = document.getElementById("humidity");

  const limits = {
    ph: {
      label: "pH",
      optimalMin: 5.5,
      optimalMax: 6.5,
      criticalMin: 5.0,
      criticalMax: 7.5,
      hint: "Optimal: 5.5 - 6.5 | Valid: 0 - 14",
    },
    ec: {
      label: "EC",
      optimalMin: 1,
      optimalMax: 2,
      criticalMin: 0.2,
      criticalMax: 4.5,
      hint: "Optimal: 1.0 - 2.0 mS/cm",
    },
    temp: {
      label: "Temperature",
      optimalMin: 64.4,
      optimalMax: 71.6,
      criticalMin: 55,
      criticalMax: 95,
      hint: "Optimal: 64.4 - 71.6 °F",
    },
    humidity: {
      label: "Humidity",
      optimalMin: 50,
      optimalMax: 70,
      criticalMin: 30,
      criticalMax: 90,
      hint: "Optimal: 50 - 70%",
    },
  };

  const sensorInputs = [inputPh, inputEc, inputTemp, inputHumidity];
  let records = loadRecords();

  function loadRecords() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("failed to load Greenhouse logs:", error);
      return [];
    }
  }

  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
        console.error("Failed to save greeen house logs:", error); 
        return false;
    }
  }
});
