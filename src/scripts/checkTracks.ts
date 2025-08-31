export function checkTrack(tracks: [], ElementName: string) {
  const data = JSON.parse(btn.dataset.track);

  // buscar el track original en tu índice
  const original = TRACKS_BY_ID.get(data.id);

  if (!original) {
    console.warn("No se encontró el track original con id", data.id);
    return;
  }

  // verificar coincidencias simples
  const sameName = original.name === data.name;
  const sameAlbum = original.album.id === data.album.id;
  const sameArtists = data.artists.every(
    (a, idx) => a.id === original.artists[idx].id
  );

  if (sameName && sameAlbum && sameArtists) {
    console.log("El track reducido coincide con el original", data.id);
  } else {
    console.log("Diferencias detectadas entre data-track y el track original");
  }
}
