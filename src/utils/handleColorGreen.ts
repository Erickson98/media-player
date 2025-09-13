import { spotifyPlayerAction } from "@/scripts/spotifyPlayerAction";
import { localStorageGet } from "./localStorage";
import PauseIcon from "src/assets/icons/pause.svg?url";
import PlayIcon from "src/assets/icons/play.svg?url";
const CLASSNAME = "text-playing";
type actions = {
  allowed:
    | "playSong-main-top-song"
    | "playSong-top-songs"
    | "playSong-Artists-Carrousel"
    | "playSong-Album-Carrousel";
  trackData: object;
};
function setColorGreen(element: HTMLElement | Element) {
  element.classList.add(CLASSNAME);
}
function removeColorGreen(element: HTMLElement | Element) {
  element.classList.remove(CLASSNAME);
}
function toggleBtnIcon(imgButton: HTMLImageElement | Element) {
  if (imgButton.dataset.state === "play") {
    imgButton.src = PauseIcon;
    imgButton.dataset.state = "stopped";
  } else {
    imgButton.src = PlayIcon;
    imgButton.dataset.state = "play";
  }
}

function removeLastPlayed(lastPlayed: string) {
  if (lastPlayed) {
    //search for the last song
    const textSong = document.querySelector(`.track-song-${lastPlayed.id}`);
    if (textSong !== null) {
      removeColorGreen(textSong);
    }
    // toggle icon
    const imgButton = document.querySelectorAll(
      `.btn-hidden-pause-${lastPlayed.id}`
    );
    if (imgButton !== null) {
      imgButton.forEach((img) => {
        img.dataset.state = "pause";
        toggleBtnIcon(img);
      });
    }
  } else if (lastPlayed && lastPlayed.class === "playSong-Artists-Carrousel") {
    const textSong = document.querySelector(`.track-song-${lastPlayed.id}`);
    if (textSong !== null) {
      removeColorGreen(textSong);
    }
  }
}
async function addCurrentSong(trackData: Object) {
  const textSong = document.querySelector(`.track-song-${trackData.id}`);
  if (textSong !== null) {
    setColorGreen(textSong);
  }
  const imgButton = document.querySelectorAll(
    `.btn-hidden-pause-${trackData.id}`
  );
  if (imgButton !== null) {
    imgButton.forEach((img) => {
      toggleBtnIcon(img);
    });
  }
  if (imgButton[0].dataset.state === "stopped") {
    try {
      await spotifyPlayerAction("play", {
        uris: [trackData.uri],
        deviceId: window.deviceId,
      });
      async function getLastPlayed() {
        const lastPlayed = await fetch(
          "/api/spotify/me/player/currently-playing"
        );
        return await lastPlayed.json();
      }
      let lastPlayed = await getLastPlayed();
      if (lastPlayed) {
        localStorage.setItem("lastPlayed", JSON.stringify(lastPlayed));
        window.dispatchEvent(
          new CustomEvent("ui:track", {
            detail: {
              albumId: lastPlayed.item.album.id,
              trackId: lastPlayed.item.id,
              trackName: lastPlayed.item.name,
              imgAlbum: lastPlayed.items[0].track.album.images[0].url,
              artistImg: lastPlayed.items[0].track.album.images[0].url,
              trackArtists: lastPlayed.item.artists,
              bioArtist: "Something",
              artistName: "SADE",
              albumName: lastPlayed.item.album.name,
            },
          })
        );
      }
    } catch (e) {
      console.error("Error al reproducir:", e);
    }
  } else {
    await spotifyPlayerAction("pause", { deviceId: window.deviceId });
  }
}

function handleTopSongs(trackData: Object) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }

  addCurrentSong(trackData);
}

async function handleMainTopSong(trackData: Object) {
  //remove top song
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }
  const imgButton = document.querySelectorAll(
    `.btn-hidden-pause-${trackData.id}`
  );
  if (imgButton !== null) {
    imgButton.forEach((img) => {
      toggleBtnIcon(img);
    });
  }
  if (imgButton[0].dataset.state === "stopped") {
    try {
      await spotifyPlayerAction("play", {
        uris: [trackData.uri],
        deviceId: window.deviceId,
      });

      async function getLastPlayed(retries = 5, delay = 500) {
        for (let i = 0; i < retries; i++) {
          const res = await fetch(
            `/api/spotify/artists/${trackData.id}/top-tracks`
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.item) return data;
          }
          await new Promise((r) => setTimeout(r, delay)); // esperar antes del próximo intento
        }
        return null; // si después de X intentos no hay nada
      }
      let sd = await getLastPlayed();
      if (sd) {
        localStorage.setItem("lastPlayed", JSON.stringify(sd));
        window.dispatchEvent(
          new CustomEvent("ui:track", {
            detail: {
              albumId: sd.item.album.id,
              trackId: sd.item.id,
              trackName: sd.item.name,
              imgAlbum: sd.item.album.images,
              artistImg: JSON.stringify(sd.item.album.images),
              trackArtists: sd.item.artists,
              bioArtist: "Something",
              artistName: "SADE",
              albumName: sd.item.album.name,
            },
          })
        );
      }
    } catch (e) {
      console.error("Error al reproducir:", e);
    }
  } else {
    await spotifyPlayerAction("pause", { deviceId: window.deviceId });
  }
}

async function handleArtistCarrousel(trackData: object) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }
  const imgButton = document.querySelectorAll(
    `.btn-hidden-pause-${trackData.id}`
  );
  if (imgButton !== null) {
    imgButton.forEach((img) => {
      toggleBtnIcon(img);
    });
  }
  if (imgButton[0].dataset.state === "stopped") {
    try {
      await spotifyPlayerAction("play", {
        context_uri: trackData.uri,
        deviceId: window.deviceId,
      });
      async function getLastPlayed(retries = 5, delay = 500) {
        for (let i = 0; i < retries; i++) {
          const res = await fetch(
            `/api/spotify/artists/${trackData.id}/top-tracks`
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.tracks) return data;
          }
          await new Promise((r) => setTimeout(r, delay));
        }
        return null;
      }
      let lastPlayed = await getLastPlayed();
      if (lastPlayed) {
        localStorage.setItem("lastPlayed", JSON.stringify(lastPlayed));
        window.dispatchEvent(
          new CustomEvent("ui:track", {
            detail: {
              albumId: lastPlayed.tracks[0].album.id,
              trackId: lastPlayed.tracks[0].id,
              trackName: lastPlayed.tracks[0].name,
              imgAlbum: lastPlayed.tracks[0].album.images,
              artistImg: JSON.stringify(lastPlayed.tracks[0].album.images),
              trackArtists: lastPlayed.tracks[0].artists,
              bioArtist: "Something",
              artistName: "SADE",
              albumName: lastPlayed.tracks[0].album.name,
            },
          })
        );
      }
    } catch (e) {
      console.error("Error al reproducir:", e);
    }
  } else {
    await spotifyPlayerAction("pause", { deviceId: window.deviceId });
  }
}

async function handleAlbumCarrousel(trackData: object) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }
  const imgButton = document.querySelectorAll(
    `.btn-hidden-pause-${trackData.id}`
  );
  if (imgButton !== null) {
    imgButton.forEach((img) => {
      toggleBtnIcon(img);
    });
  }

  if (imgButton[0].dataset.state === "stopped") {
    try {
      await spotifyPlayerAction("play", {
        context_uri: trackData.uri,
        deviceId: window.deviceId,
      });
    } catch (e) {
      console.error("Error al reproducir:", e);
    }
  } else {
    await spotifyPlayerAction("pause", { deviceId: window.deviceId });
  }
}

export function handleColorGreen(actions: actions) {
  switch (actions.allowed) {
    case "playSong-main-top-song":
      handleMainTopSong(actions.trackData);
      break;
    case "playSong-top-songs":
      handleTopSongs(actions.trackData);
      break;
    case "playSong-Artists-Carrousel":
      handleArtistCarrousel(actions.trackData);
      break;
    case "playSong-Album-Carrousel":
      handleAlbumCarrousel(actions.trackData);
      break;
  }
}
