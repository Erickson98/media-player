export default async function tr() {
  const root = document.currentScript.closest(".albums-carousel");
  const track = root.querySelector("#albums-track");
  const endpoint = "/api/spotify/browse/new-releases?limit=10";

  if (!endpoint) {
    track.innerHTML = '<p style="opacity:.8">No se definió endpoint.</p>';
    return;
  }

  try {
    const res = await fetch(endpoint, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Error " + res.status);
    const data = await res.json();
    const items = data?.albums?.items ?? data?.items ?? [];

    if (!items.length) {
      track.innerHTML = '<p style="opacity:.8">No hay ítems para mostrar.</p>';
      return;
    }

    // Render final
    track.innerHTML = items
      .map((item) => {
        const img = item?.images?.[0]?.url || item?.images?.[2]?.url || "";
        const artists = (item?.artists || []).map((a) => a.name).join(", ");
        return `
          <div class="container-for-play" aria-busy="false">
            <button class="btn-album-go-to" data-album-id="${item.id}">
              <div>
                <img
                  class="img-album"
                  src="${img}"
                  alt="${item?.name ?? ""}"
                  width="153"
                  height="153"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
                <div class="text-style">
                  <div class="album-name">${item?.name ?? ""}</div>
                  <span class="album-artists">${artists}</span>
                </div>
              </div>
            </button>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("AlbumCarrousel fetch error:", err);
    track.innerHTML =
      '<p style="opacity:.8">No se pudo cargar el carrusel.</p>';
  }
}
