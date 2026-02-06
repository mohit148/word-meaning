let data = [];
const container = document.getElementById("words");
const searchInput = document.getElementById("search");

/* Load data */
fetch("data.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    loadFavorites();
    importFavorites();
    render(data);
  });

/* Render words */
function render(words) {
  container.innerHTML = "";

  words.forEach(item => {
    const card = document.createElement("div");
    card.className = "word-card";

    const header = document.createElement("div");
    header.className = "word-header";

    const title = document.createElement("h3");
    title.textContent = item.word;

    const star = document.createElement("span");
    star.className = "star";
    star.textContent = item.favorite ? "⭐" : "☆";
    star.onclick = () => toggleFavorite(item.word);

    header.append(title, star);
    card.appendChild(header);

    item.definitions.forEach((def, i) => {
      const d = document.createElement("div");
      d.className = "definition";
      d.innerHTML = `<b>${i + 1}.</b> ${def.meaning}`;

      const tags = document.createElement("div");
      tags.className = "tags";

      def.tags.forEach(tag => {
        const t = document.createElement("span");
        t.textContent = tag;
        t.onclick = () => {
          searchInput.value = tag;
          render(filterData(tag));
        };
        tags.appendChild(t);
      });

      d.appendChild(tags);
      card.appendChild(d);
    });

    container.appendChild(card);
  });
}

/* Search */
searchInput.addEventListener("input", e => {
  render(filterData(e.target.value));
});

function filterData(query) {
  query = query.toLowerCase();
  return data.filter(item =>
    item.word.toLowerCase().includes(query) ||
    item.definitions.some(d =>
      d.meaning.toLowerCase().includes(query) ||
      d.tags.some(t => t.toLowerCase().includes(query))
    )
  );
}

/* Favorites */
function toggleFavorite(word) {
  const item = data.find(i => i.word === word);
  item.favorite = !item.favorite;
  saveFavorites();
  render(filterData(searchInput.value));
}

function saveFavorites() {
  const favs = {};
  data.forEach(i => favs[i.word] = i.favorite);
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function loadFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites"));
  if (!favs) return;
  data.forEach(i => i.favorite = !!favs[i.word]);
}

/* Export favorites */
document.getElementById("exportFavs").onclick = () => {
  const favWords = data.filter(i => i.favorite).map(i => i.word);
  const blob = new Blob(
    [JSON.stringify(favWords, null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "favorites.json";
  a.click();
};

/* Import favorites.json if exists */
function importFavorites() {
  fetch("favorites.json")
    .then(r => r.json())
    .then(favs => {
      data.forEach(i => i.favorite = favs.includes(i.word));
      saveFavorites();
    })
    .catch(() => {});
}
