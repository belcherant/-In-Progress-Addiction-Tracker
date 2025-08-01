// Global Variables
let currentUser = "";
let type = "";
let vapeUsage = 0;
let pouchMg = 0;
let pouchUsage = 0;

// Step 1: Username
function askDeviceType() {
  const name = document.getElementById("username").value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  currentUser = name;
  document.getElementById("entry-screen").classList.add("hidden");
  document.getElementById("device-modal").classList.remove("hidden");
}

// Step 2: Device Type Selection
function askUsageDetails() {
  const device = document.getElementById("device-choice").value;
  if (!device) {
    alert("Please select a device type.");
    return;
  }
  type = device;
  document.getElementById("device-modal").classList.add("hidden");
  document.getElementById("usage-modal").classList.remove("hidden");

  const form = document.getElementById("usage-form");
  form.innerHTML = "";

  if (type === "vape" || type === "both") {
    form.innerHTML += `
      <h3>Vape Usage</h3>
      <label>Puffs per day:</label>
      <input type="number" id="vape-puffs" placeholder="e.g. 250" />
    `;
  }

  if (type === "pouch" || type === "both") {
    form.innerHTML += `
      <h3>Pouch Usage</h3>
      <label>Strength (mg per pouch):</label>
      <input type="number" id="pouch-mg" placeholder="e.g. 6mg" />
      <label>Pouches per day:</label>
      <input type="number" id="pouch-daily" placeholder="e.g. 4" />
    `;
  }
}

// Step 3: Finalize Setup
function finishSetup() {
  if (type === "vape" || type === "both") {
    vapeUsage = parseInt(document.getElementById("vape-puffs").value);
  }
  if (type === "pouch" || type === "both") {
    pouchMg = parseInt(document.getElementById("pouch-mg").value);
    pouchUsage = parseInt(document.getElementById("pouch-daily").value);
  }

  // Validation
  if (
    (type === "vape" && isNaN(vapeUsage)) ||
    (type === "pouch" && (isNaN(pouchMg) || isNaN(pouchUsage))) ||
    (type === "both" && (isNaN(vapeUsage) || isNaN(pouchMg) || isNaN(pouchUsage)))
  ) {
    alert("Please fill out usage details correctly.");
    return;
  }

  // Update UI
  document.getElementById("usage-modal").classList.add("hidden");
  document.getElementById("tracker-screen").classList.remove("hidden");
  document.getElementById("user-display").textContent = currentUser;
  document.getElementById("type-display").textContent = type;

  let baselineText = "";
  if (type === "vape") {
    baselineText = `${vapeUsage} puffs/day`;
  } else if (type === "pouch") {
    baselineText = `${pouchUsage} pouches/day at ${pouchMg}mg`;
  } else {
    baselineText = `${vapeUsage} puffs/day + ${pouchUsage} pouches/day at ${pouchMg}mg`;
  }
  document.getElementById("baseline-display").textContent = baselineText;
}

// Log Daily Usage
function submitUsage() {
  const todayUsage = parseInt(document.getElementById("daily-input").value);
  if (isNaN(todayUsage)) {
    alert("Please enter a valid number.");
    return;
  }

  const result = document.getElementById("result");
  const history = document.getElementById("log-history");
  const date = new Date().toLocaleDateString();

  let baselineTotal = 0;
  if (type === "vape") {
    baselineTotal = vapeUsage;
  } else if (type === "pouch") {
    baselineTotal = pouchUsage;
  } else {
    // Combined: normalize for comparison
    baselineTotal = vapeUsage + pouchUsage * pouchMg;
  }

  let feedback = "";
  if (todayUsage < baselineTotal) {
    feedback = `✅ Good job! You're cutting down compared to your baseline.`;
  } else if (todayUsage > baselineTotal) {
    feedback = `⚠️ You used more than your baseline today. Consider reducing.`;
  } else {
    feedback = `🔁 Same as baseline. Try cutting back tomorrow!`;
  }

  result.textContent = feedback;

  const entry = document.createElement("li");
  entry.textContent = `${date}: ${todayUsage} total units`;
  history.appendChild(entry);
}

