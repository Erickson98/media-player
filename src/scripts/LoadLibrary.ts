import type { SpotifySavedAlbumsResponse } from "@models/me.ts";

export async function loadLibrary(labelContainer: string) {
  const libraryContainer = document.querySelector(
    labelContainer
  ) as HTMLElement;
  if (libraryContainer === null) {
    return;
  }
  try {
    const libraryItems: SpotifySavedAlbumsResponse = await fetch(
      import.meta.env.DEV
        ? "../../api/albums.json"
        : "/api/spotify/me/albums?limit=5"
    ).then((r) => r.json());
    if (libraryItems.limit > 0) {
      libraryContainer.innerHTML = libraryItems.items
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
        .join("");
    } else {
      libraryContainer.innerHTML = "<p>No items found</p>";
    }
  } catch (err) {
    console.error("Failed to fetch library:", err);
    libraryContainer.innerHTML = "<p>Error loading items</p>";
  }
}
