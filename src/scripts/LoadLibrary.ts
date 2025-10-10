import type {
  SpotifySavedAlbumsResponse,
  SpotifySavedAlbumItem,
} from "@models/me.ts";
const libraryContainer = document.querySelector(".library")!;
const searchBar = document.getElementById("inputSearch") as HTMLInputElement;
const clearButton = document.querySelector(".clear-button");

let contentLibrary: SpotifySavedAlbumsResponse;

function renderLibrary(items: SpotifySavedAlbumItem[]) {
  libraryContainer.innerHTML = items
    ? items
        .map((item) => {
          const src = item.album.images[2]?.url;
          return `
            <div class="library-item">
              <button class="album-btn" data-id=${item.album.id}>
                <img 
            src="${src}" 
            srcset="${src}?w=56 56w, ${src}?w=112 112w" 
            sizes="56px" 
            width="56" 
            height="56" 
            loading="lazy" 
            decoding="async"
            alt="${item.album.name}" 
          />
            </button>
            <div class="container-title-meta">
              <div class="title">${item.album.name}</div>
              <div class="meta">
                
                ${
                  item.album.artists[0].name
                    ? ` ${item.album.artists[0].name}`
                    : ""
                }
              </div>
            </div>
          </div>
        `;
        })
        .join("")
    : "<p>No items found</p>";
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((query: string) => {
  query = query.trim().toLowerCase();

  renderLibrary(
    contentLibrary.items.filter((x) =>
      x.album.name.toLowerCase().includes(query)
    )
  );
  SPANavigation();
}, 200);

searchBar!.addEventListener("input", (e: Event) => {
  if (!contentLibrary.items) return;
  const target = e.target as HTMLInputElement;
  handleSearch(target.value);
});

clearButton!.addEventListener("click", () => {
  searchBar!.value = "";
  handleSearch("");
  searchBar!.focus();
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

export async function loadLibrary() {
  try {
    contentLibrary = await fetch(
      import.meta.env.DEV
        ? "../../api/albums.json"
        : "/api/spotify/me/albums?limit=5"
    ).then((r) => r.json());
    renderLibrary(contentLibrary.items);
    SPANavigation();
  } catch (err) {
    console.error("Failed to fetch library:", err);
    libraryContainer.innerHTML = "<p>Error loading items</p>";
  }
}
