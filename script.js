let data;
let activeCategory = "general";

const content = document.getElementById("content");
const searchInput = document.getElementById("search");
const categoryBar = document.getElementById("categories");

fetch("data.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    buildCategories();
    renderCategory("general");
  });

function buildCategories() {
  categoryBar.innerHTML = "";

  Object.keys(data.categories).forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => renderCategory(cat);
    categoryBar.appendChild(btn);
  });

  ["Differences", "Keywords"].forEach(extra => {
    const btn = document.createElement("button");
    btn.textContent = extra;
    btn.onclick = () => renderExtra(extra);
    categoryBar.appendChild(btn);
  });
}

function renderCategory(cat) {
  activeCategory = cat;
  content.innerHTML = "";

  const category = data.categories[cat];

  renderSection("Important", category.Important);
  renderSection("Other", category.Other);
}

function renderSection(title, words) {
  const section = document.createElement("div");
  section.innerHTML = `<h2>${title}</h2>`;

  words.forEach(w => {
    if (!matchesSearch(w)) return;

    const card = document.createElement("div");
    card.className = "word-card";
    card.innerHTML = `<h3>${w.word}</h3><p>${w.definition}</p>`;
    section.appendChild(card);
  });

  content.appendChild(section);
}

function renderExtra(type) {
  content.innerHTML = `<h2>${type}</h2>`;

  if (type === "Differences") {
    data.Differences.forEach(d => {
      content.innerHTML += `
        <div class="word-card">
          <h3>${d.items}</h3>
          <p>${d.explanation}</p>
        </div>`;
    });
  }

  if (type === "Keywords") {
    data.Keywords.forEach(k => {
      content.innerHTML += `
        <div class="word-card">
          <h3>${k.word}</h3>
          <p>${k.context}</p>
        </div>`;
    });
  }
}

searchInput.addEventListener("input", () => {
  if (data.categories[activeCategory]) {
    renderCategory(activeCategory);
  }
});

function matchesSearch(word) {
  const q = searchInput.value.toLowerCase();
  if (!q) return true;
  return (
    word.word.toLowerCase().includes(q) ||
    word.definition.toLowerCase().includes(q)
  );
}
