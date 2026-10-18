const dailyTips = [
  {
    title: "Make hydration a little more joyful",
    description:
      "Keep a glass of water where you can see it. Add a slice of citrus or cucumber for a refreshing reminder to sip throughout the day.",
  },
  {
    title: "Step outside for a few minutes",
    description:
      "A little daylight and fresh air can be a lovely reset. Take a short walk or simply pause on your doorstep and notice what’s around you.",
  },
  {
    title: "Give your shoulders a soft reset",
    description:
      "Let your shoulders drop, roll them gently back, and take one slow breath. A comfortable stretch is enough—no special equipment needed.",
  },
  {
    title: "Add one colorful thing to your plate",
    description:
      "Try adding a fruit or vegetable you enjoy to a meal today. Fresh, frozen, and canned options can all be part of a balanced plate.",
  },
  {
    title: "Make room for a real pause",
    description:
      "Take a minute between tasks to look away from your screen and breathe comfortably. Small breaks can help the day feel less rushed.",
  },
  {
    title: "Reach out to someone you care about",
    description:
      "A quick hello, a kind text, or a shared cup of tea can brighten both your day and someone else’s. Connection counts as care.",
  },
  {
    title: "Choose a bedtime wind-down",
    description:
      "If it works for you, dim the lights and set aside a few minutes for a calm activity before bed. A gentle routine can make rest feel more inviting.",
  },
];

const titleElement = document.querySelector("#daily-tip-title");
const descriptionElement = document.querySelector("#daily-tip-description");
const dateElement = document.querySelector("#tip-date");
const refreshButton = document.querySelector("#refresh-tip");

function getDayOfYear(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((date - startOfYear) / millisecondsPerDay);
}

function renderTip(index) {
  const tip = dailyTips[index];
  titleElement.textContent = tip.title;
  descriptionElement.textContent = tip.description;
}

const today = new Date();
const currentTipIndex = getDayOfYear(today) % dailyTips.length;
renderTip(currentTipIndex);
dateElement.textContent = today.toLocaleDateString("en-PH", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

refreshButton.addEventListener("click", () => {
  const nextTipIndex =
    (Number(refreshButton.dataset.tipIndex ?? currentTipIndex) + 1) %
    dailyTips.length;
  refreshButton.dataset.tipIndex = String(nextTipIndex);
  renderTip(nextTipIndex);
});

const checklistInputs = [...document.querySelectorAll('input[name="wellness"]')];
const progressBar = document.querySelector("#wellness-progress");
const progressLabel = document.querySelector("#progress-label");
const checklistStatus = document.querySelector("#checklist-status");
const resetChecklistButton = document.querySelector("#reset-checklist");
const checklistStorageKey = `wellnest-checklist-${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

function selectedChecklistItems() {
  return checklistInputs
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function updateChecklistProgress() {
  const completedCount = checklistInputs.filter((input) => input.checked).length;
  progressBar.value = completedCount;
  progressLabel.textContent = `${completedCount} of ${checklistInputs.length} complete`;
  progressBar.textContent = progressLabel.textContent;
}

function saveChecklist() {
  try {
    localStorage.setItem(checklistStorageKey, JSON.stringify(selectedChecklistItems()));
    checklistStatus.textContent = "Your check-in is saved on this device.";
  } catch (error) {
    checklistStatus.textContent =
      "Your check-in changed, but this browser could not save it on this device.";
    console.error("Unable to save the Wellnest checklist to localStorage.", error);
  }
}

try {
  const savedItems = localStorage.getItem(checklistStorageKey);
  if (savedItems !== null) {
    const parsedItems = JSON.parse(savedItems);
    if (
      !Array.isArray(parsedItems) ||
      parsedItems.some((item) => typeof item !== "string")
    ) {
      throw new TypeError("Saved checklist data has an invalid format.");
    }
    checklistInputs.forEach((input) => {
      input.checked = parsedItems.includes(input.value);
    });
  }
} catch (error) {
  checklistStatus.textContent =
    "A saved check-in could not be read. You can still use today’s checklist.";
  console.error("Unable to load the Wellnest checklist from localStorage.", error);
}

updateChecklistProgress();

checklistInputs.forEach((input) => {
  input.addEventListener("change", () => {
    updateChecklistProgress();
    saveChecklist();
  });
});

resetChecklistButton.addEventListener("click", () => {
  checklistInputs.forEach((input) => {
    input.checked = false;
  });
  updateChecklistProgress();
  saveChecklist();
});

const healthCenters = [
  {
    name: "Sample Barangay Health Center",
    location: "Boac",
    services: "Ask the municipal health office to confirm services and contact details.",
  },
  {
    name: "Sample Barangay Health Center",
    location: "Buenavista",
    services: "Ask the municipal health office to confirm services and contact details.",
  },
  {
    name: "Sample Barangay Health Center",
    location: "Gasan",
    services: "Ask the municipal health office to confirm services and contact details.",
  },
  {
    name: "Sample Barangay Health Center",
    location: "Mogpog",
    services: "Ask the municipal health office to confirm services and contact details.",
  },
  {
    name: "Sample Barangay Health Center",
    location: "Santa Cruz",
    aliases: ["Sta. Cruz"],
    services: "Ask the municipal health office to confirm services and contact details.",
  },
  {
    name: "Sample Barangay Health Center",
    location: "Torrijos",
    services: "Ask the municipal health office to confirm services and contact details.",
  },
];

const centerSearch = document.querySelector("#center-search");
const centerList = document.querySelector("#center-list");
const directoryResults = document.querySelector("#directory-results");

function renderHealthCenters(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("en");
  const matches = healthCenters.filter((center) =>
    `${center.name} ${center.location} ${center.aliases?.join(" ") ?? ""} ${center.services}`
      .toLocaleLowerCase("en")
      .includes(normalizedQuery),
  );

  centerList.replaceChildren();
  matches.forEach((center, index) => {
    const item = document.createElement("article");
    item.className = "resource-item";

    const number = document.createElement("span");
    number.className = "resource-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const details = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = `${center.name} — ${center.location}`;
    const services = document.createElement("small");
    services.textContent = center.services;
    details.append(name, services);

    const marker = document.createElement("span");
    marker.className = "resource-arrow";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "•";

    item.append(number, details, marker);
    centerList.append(item);
  });

  directoryResults.textContent =
    matches.length === 1
      ? "1 sample listing shown."
      : `${matches.length} sample listings shown.`;

  if (matches.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "directory-empty";
    emptyState.textContent =
      "No sample listings match that search. Try another municipality.";
    centerList.append(emptyState);
  }
}

centerSearch.addEventListener("input", () => {
  renderHealthCenters(centerSearch.value);
});

renderHealthCenters();