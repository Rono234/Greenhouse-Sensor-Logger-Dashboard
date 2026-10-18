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

  /*
● Critical
    (pH < 5.0 OR pH > 7.5) AND (Temp < 55F OR Temp > 95F) AND (EC < 0.2 OR EC > 4.5 ) AND (RH < 30 OR RH > 90 )
● Optimal
    (5.5 <= pH <= 6.5) AND (64.4F <= Temp <= 71.6F) AND (1.0 <= EC <= 2.0) AND (50 <= RH <= 70)
● Warning
    (NOT Critical) AND (NOT Optimal) */

  function evaluateStatus(ph, temp, ec, humidity) {
    const critical =
      (ph < 5 || ph > 7.5) &&
      (temp < 55 || temp > 95) &&
      (ec < 0.2 || ec > 4.5) &&
      (humidity < 30 || humidity > 90);

    const optimal =
      ph >= 5.5 &&
      ph <= 6.5 &&
      temp >= 64.4 &&
      temp <= 71.6 &&
      ec >= 1 &&
      ec <= 2 &&
      humidity >= 50 &&
      humidity <= 70;

    if (critical) return { level: "critical", label: "Critical Hazard" };
    if (optimal) return { level: "optimal", label: "Optimal" };
    return { level: "warning", label: "Warning" };
  }

  function validateInput() {
    const errors = [];
    if (!inputBay.value) errors.push("select a greenhouse bay.");
    for (const input of sensorInputs) {
      const value = Number(input.value);
      if (
        !input.value.trim() ||
        !Number.isFinite(value) ||
        input.validity.valid
      ) {
        errors.push(
          `Enter a valid ${limits[input.id].label} reading${input.id === "ph" ? "(0 to 14) " : input.id === "humidity" ? " (0 to 100)" : input.id === "ec" ? " (0 or greater)" : ""} `,
        );
      }
    }
    return errors;
  }

  //   add a function for instant feedback
  function updateFieldState(input) {
    const rule = limits[input.id];
    const hint = document.getElementById(`${input.id}-hint`);
    input.classList.remove("valid", "warning", "critical", "invalid");
    input.removeAttribute("aria-invalid");

    if (input.value.trim() === "") {
      hint.textContent = rule.hint;
      return;
    }

    const value = Number(input.value);
    if (!input.validity.valid || !Number.isFinite(value)) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      hint.textContent = "Invalid value — check the allowed input limits.";
    } else if (value < rule.criticalMin || value > rule.criticalMax) {
      input.classList.add("critical");
      hint.textContent =
        "Outside critical threshold (reading can still be recorded).";
    } else if (value < rule.optimalMin || value > rule.optimalMax) {
      input.classList.add("warning");
      hint.textContent = "Outside optimal plant growth range.";
    } else {
      input.classList.add("valid");
      hint.textContent = "Within optimal growth range.";
    }
  }

  function render() {
    queueCount.textContent = records.length;
    btnClearAll.disabled = records.length === 0;

    if (records.length === 0) {
      emptyState.classList.remove("hidden");
      recordsList.innerHTML = "";
      return;
    }

    emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    records.forEach(function (rec) {
      const li = document.createElement("li");
      li.className = "record-card status-" + rec.status.level;

      li.innerHTML = `
        <div class="card-top">
        <div class="card-header">
          <div>
            <h3 class="bay-name">Bay ${escapeHTML(rec.bay)}</h3>
            <div class="timestamp">
              Logged at: ${escapeHTML(rec.timestamp)}
            </div>
          </div>

          <span class="status-badge ${rec.status.level}">
            ${escapeHTML(rec.status.label)}
          </span>
        </div>

        <div class="sensor-stats">
          <div class="stat-item">
            <span>pH Level</span>
            <strong>${rec.ph}</strong>
          </div>

          <div class="stat-item">
            <span>EC</span>
            <strong>${rec.ec} mS/cm</strong>
          </div>

          <div class="stat-item">
            <span>Air Temperature</span>
            <strong>${rec.temp} °F</strong>
          </div>

          <div class="stat-item">
            <span>Relative Humidity</span>
            <strong>${rec.humidity}%</strong>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-outline-danger btn-sm btn-delete"
          data-id="${escapeHTML(rec.id)}">
          Delete Reading
        </button>
      </div>
        
        `;

      fragment.appendChild(li);
    });

    recordsList.innerHTML = "";
    recordsList.appendChild(fragment);
  }

  // EVENT LISTENERS

  sensorInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateFieldState(input);
      hideError();
    });
  });

  sensorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sensorInputs.forEach(updateFieldState);
    const errors = validateInput();
    if (errors.length) {
      showError(errors.join(" "));
      return;
    }
    hideError();

    const reading = {
      id: crypto.randomUUID(),
      bay: inputBay.value,
      ph: Number(inputPh.value),
      ec: Number(inputEc.value),
      temperature: Number(inputTemp.value),
      humidity: Number(inputHumidity.value),
      timestamp: new Date().toISOString(),
    };

    reading.status = evaluateStatus(
      reading.ph,
      reading.temperature,
      reading.ec,
      reading.humidity,
    );

    records.unshift(reading);
    if (!saveRecords()) {
      records.shift();
      return;
    }

    render();
    sensorForm.reset();
    sensorInputs.forEach(updateFieldState);
    inputBay.focus();
  });

  recordsList.addEventListener("click", (event) => {
    const button = event.target.closest("button.btn-delete");
    if (!button || !recordsList.contains(button)) return;
    const previous = records;
    records = records.filter((rec) => rec.id !== button.dataset.id);
    if (!saveRecords()) {
      records = previous;
      return;
    }
    render();
  });

  btnClearAll.addEventListener("click", () => {
    if (records.length === 0) return;
    if (!window.confirm("are you sure you want to purge all greenhouse logs?"))
      return;
    const previous = records;
    records = [];
    if (!saveRecords()) {
      records = previous;
      return;
    }

    hideError();
    render();
  });

  render();
});
