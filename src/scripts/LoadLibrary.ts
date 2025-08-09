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
        .map(
          (item) => `
            <div class="library-item">
              <img src="${
                item.album.images[2]?.url
              }" class="img-library" alt="${
            item.album.name
          }" width="56" height="56" />
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
        `
        )
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

export async function loadLibrary() {
  try {
    contentLibrary = await fetch(
      import.meta.env.DEV
        ? "../../api/albums.json"
        : "/api/spotify/me/albums?limit=5"
    ).then((r) => r.json());
    console.log(contentLibrary);
    renderLibrary(contentLibrary.items);
  } catch (err) {
    console.error("Failed to fetch library:", err);
    libraryContainer.innerHTML = "<p>Error loading items</p>";
  }
}
