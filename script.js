const content = document.getElementById("content");
const search = document.getElementById("search");

let FULL_DATA = {};

// Load the data
fetch("data.json")
  .then((r) => r.json())
  .then((d) => {
    FULL_DATA = d;
    showHome();
  })
  .catch((err) => {
    content.innerHTML = `<div class="word-card">Error loading data. Check if data.json exists.</div>`;
    console.error(err);
  });

/* ---------- Home: List of Categories ---------- */

function showHome() {
  search.style.display = "none";
  search.value = "";
  content.innerHTML = "";

  // 1. Render standard categories (General, Economics, etc.)
  if (FULL_DATA.categories) {
    for (const name in FULL_DATA.categories) {
      createCategoryCard(name, () =>
        showCategory(name, FULL_DATA.categories[name]),
      );
    }
  }

  // 2. Render the "Differences" section specifically
  if (FULL_DATA.Differences) {
    createCategoryCard("Differences", () =>
      showDifferences(FULL_DATA.Differences),
    );
  }
}

// Helper to create the big buttons on the home screen
function createCategoryCard(text, action) {
  const card = document.createElement("div");
  card.className = "word-card";
  card.style.cursor = "pointer";
  card.style.fontSize = "20px";
  card.style.textAlign = "center";
  card.style.padding = "20px";
  card.style.textTransform = "capitalize";

  card.textContent = text;
  card.onclick = action;

  content.appendChild(card);
}

/* ---------- Category View (General, Law, Grammar, etc.) ---------- */

function showCategory(name, catData) {
  search.style.display = "block";
  search.value = "";

  content.innerHTML = `
    <button onclick="showHome()" style="margin-bottom:20px; cursor:pointer; padding: 8px 16px; border-radius: 5px; border:none; background:#333; color:white;">
      ← Back to Categories
    </button>
    <h2 style="text-transform: capitalize;">${name}</h2>
  `;

  // Dynamically loop through sub-sections (Important, Other, preposition, etc.)
  for (const sectionName in catData) {
    renderSection(sectionName, catData[sectionName]);
  }
}

/* ---------- Render Words inside a Category ---------- */

function renderSection(title, words) {
  if (!words || !Array.isArray(words)) return;

  const section = document.createElement("div");
  // Make the section title (e.g., "preposition") look nice
  section.innerHTML = `<div class="section-title" style="text-transform: capitalize; font-weight: bold; margin-top: 25px;">${title}</div>`;

  words.forEach((w) => {
    const card = document.createElement("div");
    card.className = "word-card";

    card.innerHTML = `
      <div class="word">${w.word}</div>
      <div class="definition">${w.definition}</div>
    `;

    section.appendChild(card);
  });

  content.appendChild(section);
}

/* ---------- Differences View ---------- */

function showDifferences(diffData) {
  search.style.display = "block";
  search.value = "";

  content.innerHTML = `
    <button onclick="showHome()" style="margin-bottom:20px; cursor:pointer; padding: 8px 16px; border-radius: 5px; border:none; background:#333; color:white;">
      ← Back to Categories
    </button>
    <h2>Key Differences</h2>
  `;

  diffData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "word-card";

    // Note: This uses .items and .explanation based on your JSON structure
    card.innerHTML = `
  <div class="word">${item.items}</div>
  <div class="definition">${item.explanation}</div>
`;

    content.appendChild(card);
  });
}

/* ---------- Search Logic ---------- */

search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  // Target all cards currently visible in the content div
  const currentCards = content.querySelectorAll(".word-card");

  currentCards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(q) ? "block" : "none";
  });
});
