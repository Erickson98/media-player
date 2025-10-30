import { debounce } from "/scripts/debounce.js";
const libraryContainer = document.querySelector(".library");
const searchBar = document.getElementById("inputSearch");
const clearButton = document.querySelector(".clear-button");

let contentLibrary;

function renderLibrary(items) {
  libraryContainer.innerHTML = items
    ? items
        .map((item) => {
          const src = item.album.images[2]?.url;
          return `
            <div class="library-item">
              <button class="album-btn album-btn-library-section" data-id=${item.album.id}>
                <img 
            src="${src}" 
            srcset="${src}?w=56 56w, ${src}?w=112 112w" 
            sizes="56px" 
            width="56" 
            height="56" 
            loading="lazy" 
            decoding="async"
            alt="${item.album.name}" 
            class="img-library-item"
          />
            <div class="container-title-meta">
              <div class="title">${item.album.name}</div>
                <div class="meta">
                
                ${item.album.artists[0].name ? ` ${item.album.artists[0].name}` : ""}
                </div>
              </div>
          </button>
          </div>
        `;
        })
        .join("")
    : "<p>No items found</p>";
}

function renderSkeleton(count) {
  libraryContainer.innerHTML = Array.from({ length: count })
    .map(
      () => `
      <div class="library-item">
        <div class="skeleton skeleton-img"></div>
        <div class="container-title-meta">
          <div class="skeleton skeleton-text skeleton-title"></div>
          <div class="skeleton skeleton-text skeleton-meta"></div>
        </div>
      </div>
    `
    )
    .join("");
}

const handleSearch = debounce((query) => {
  query = query.trim().toLowerCase();

  renderLibrary(
    contentLibrary.items.filter((x) =>
      x.album.name.toLowerCase().includes(query)
    )
  );
  // onInstance.update();
  SPANavigation();
  initScroll();
}, 200);

searchBar.addEventListener("input", (e) => {
  // if (contentLibrary.items) return;
  const target = e.target;
  handleSearch(target.value);
});

clearButton.addEventListener("click", () => {
  searchBar.value = "";
  handleSearch("");
  searchBar.focus();
  // onInstance.update();
});

function SPANavigation() {
  const buttons = document.querySelectorAll(".album-btn");
  const content = document.querySelector(".container-main");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const albumId = btn.dataset.id;
      window.dispatchEvent(
        new CustomEvent("nav:album", { detail: { albumId } })
      );
    });
  });

  window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    const match = path.match(/\/album\/(\d+)/);
    if (match) {
      const id = match[1];
      content.innerHTML = `<h2>Álbum ${id}</h2><p>Lista de canciones aquí...</p>`;
    } else {
      content.innerHTML = "<p>Selecciona un álbum...</p>";
    }
  });
}

import { OverlayScrollbars } from "https://cdn.jsdelivr.net/npm/overlayscrollbars/+esm";
export async function loadLibrary() {
  try {
    renderSkeleton(20);

    contentLibrary = await fetch("/api/spotify/me/albums?limit=20")
      .then((r) => r.json())
      .catch((error) => console.error(error));
    renderLibrary(contentLibrary.items);
    SPANavigation();

    // const target = document.getElementById("album-list");

    // onInstance = OverlayScrollbars(target, {
    //   scrollbars: { autoHide: "leave", theme: "os-theme-light" },
    //   overflow: { x: "hidden" },
    // });
    initScroll();
  } catch (err) {
    console.error("Failed to fetch library:", err);
    libraryContainer.innerHTML = "<p>Error loading items</p>";
  }
}
let osInstance = null;

function initScroll() {
  const target = document.getElementById("album-list");

  if (osInstance) {
    osInstance.destroy();
    osInstance = null;
  }

  osInstance = OverlayScrollbars(target, {
    scrollbars: { autoHide: "leave", theme: "os-theme-light" },
    overflow: { x: "hidden" },
  });
}
