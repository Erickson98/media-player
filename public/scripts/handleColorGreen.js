import { spotifyPlayerAction } from "/scripts/spotifyPlayerActions.js";
import { localStorageGet, localStorageSet } from "/scripts/localStorage.js";

const CLASSNAME = "text-playing";
const PlayIcon = "/play.svg";
const PauseIcon = "/pause.svg";

function setColorGreen(element) {
  element.classList.add(CLASSNAME);
}

function removeColorGreen(element) {
  element.classList.remove(CLASSNAME);
}

function toggleBtnIcon(imgButton) {
  if (imgButton.dataset.state === "play") {
    imgButton.src = PauseIcon;
    imgButton.dataset.state = "stopped";
  } else {
    imgButton.src = PlayIcon;
    imgButton.dataset.state = "play";
  }
}

function setSongIcon(id, mode) {
  document.querySelectorAll(`.btn-hidden-pause-${id}`).forEach((img) => {
    if (mode === "playing") {
      img.src = PauseIcon;
      img.dataset.state = "stopped";
    } else {
      img.src = PlayIcon;
      img.dataset.state = "play";
    }
  });
}

async function togglePlayback({ id, trackId, contextUri, uris }) {
  const state = await window.player?.getCurrentState();
  const isThis = contextUri
    ? state?.context?.uri === contextUri
    : state?.track_window?.current_track?.id === trackId;
  const isPlayingThis = isThis && state && !state.paused;

  if (isPlayingThis) {
    setSongIcon(id, "paused");
    handlePlayerComponent("play");
    await spotifyPlayerAction("pause", { deviceId: window.deviceId });
    return "paused";
  }

  setSongIcon(id, "playing");
  handlePlayerComponent("stopped");

  if (isThis) {
    await spotifyPlayerAction("play", { deviceId: window.deviceId });
    return "resumed";
  }

  await spotifyPlayerAction("play", {
    deviceId: window.deviceId,
    ...(uris ? { uris } : {}),
    ...(contextUri ? { context_uri: contextUri } : {}),
  });
  return "new";
}

function removeLastPlayed(lastPlayed) {
  if (lastPlayed) {
    const textSong = document.querySelector(`.track-song-${lastPlayed.id}`);
    if (textSong !== null) {
      removeColorGreen(textSong);
    }
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

async function addCurrentSong(trackData) {
  const textSong = document.querySelector(`.track-song-${trackData.id}`);
  if (textSong !== null) {
    setColorGreen(textSong);
  }

  const result = await togglePlayback({
    id: trackData.id,
    trackId: trackData.id,
    uris: [trackData.uri],
  });
  if (result !== "new") return;

  try {
    const res = await fetch(
      `/api/genius/artist-bio?q=${encodeURIComponent(trackData.artists[0].name)}`
    );
    const resQue = await fetch("/api/spotify/me/player/queue");
    localStorageSet("queue", resQue);
    const { bio, image } = await res.json();
    localStorageSet("lastPlayedHistory", {
      albumId: trackData.album.id,
      trackId: trackData.id,
      trackName: trackData.name,
      imgAlbum: trackData.album.images[0].url,
      artistImg: image,
      trackArtists: trackData.artists,
      bioArtist: bio,
      artistName: trackData.artists[0].name,
      albumName: trackData.album.name,
    });
    window.dispatchEvent(new CustomEvent("route:playing"));
  } catch (e) {
    console.error("Error al reproducir:", e);
  }
}

function handleTopSongs(trackData) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }
  addCurrentSong(trackData);
}

async function handleMainTopSong(trackData) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }

  const result = await togglePlayback({
    id: trackData.id,
    trackId: trackData.id,
    uris: [trackData.uri],
  });
  if (result !== "new") return;

  try {
    const res = await fetch(
      `/api/genius/artist-bio?q=${encodeURIComponent(lastPlayed.artists[0].name)}`
    );
    const { bio, image } = await res.json();
    localStorageSet("lastPlayedHistory", {
      albumId: lastPlayed.album.id,
      trackId: lastPlayed.id,
      trackName: lastPlayed.name,
      imgAlbum: lastPlayed.album.images[0].url,
      artistImg: image,
      trackArtists: lastPlayed.artists,
      bioArtist: bio,
      artistName: lastPlayed.artists[0].name,
      albumName: lastPlayed.album.name,
    });
    window.dispatchEvent(new CustomEvent("route:playing"));
  } catch (e) {
    console.error("Error al reproducir:", e);
  }
}

async function handleArtistCarrousel(trackData) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }

  const result = await togglePlayback({
    id: trackData.id,
    contextUri: trackData.uri,
  });
  if (result !== "new") return;

  try {
    async function getTopArtistTrack(retries = 5, delay = 500) {
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
    let lastPlayedData = await getTopArtistTrack();
    if (lastPlayedData) {
      localStorage.setItem("lastPlayed", JSON.stringify(lastPlayedData));
      const res = await fetch(
        `/api/genius/artist-bio?q=${encodeURIComponent(
          lastPlayedData.tracks[0].artists[0].name
        )}`
      );
      const { bio, image } = await res.json();
      localStorageSet("lastPlayedHistory", {
        albumId: lastPlayedData.tracks[0].album.id,
        trackId: lastPlayedData.tracks[0].id,
        trackName: lastPlayedData.tracks[0].name,
        imgAlbum: lastPlayedData.tracks[0].album.images[0].url,
        artistImg: image,
        trackArtists: lastPlayedData.tracks[0].artists,
        bioArtist: bio,
        artistName: lastPlayedData.tracks[0].artists[0].name,
        albumName: lastPlayedData.tracks[0].album.name,
      });
      window.dispatchEvent(new CustomEvent("route:playing"));
    }
  } catch (e) {
    console.error("Error al reproducir:", e);
  }
}

async function handleAlbumCarrousel(trackData) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }
  const result = await togglePlayback({
    id: trackData.id,
    contextUri: trackData.uri,
  });
  if (result !== "new") return;

  try {
    async function getAlbumInfo(retries = 5, delay = 500) {
      for (let i = 0; i < retries; i++) {
        const res = await fetch(`/api/spotify/albums/${trackData.id}/tracks`);
        if (res.ok) {
          const data = await res.json();
          if (data?.items) return data;
        }
        await new Promise((r) => setTimeout(r, delay));
      }
      return null;
    }
    let lastPlayedData = await getAlbumInfo();
    const res = await fetch(
      `/api/genius/artist-bio?q=${encodeURIComponent(trackData.artists[0].name)}`
    );

    const { bio, image } = await res.json();
    localStorageSet("lastPlayedHistory", {
      albumId: trackData.id,
      trackId: lastPlayedData.items[0].id,
      trackName: lastPlayedData.items[0].name,
      imgAlbum: trackData.imgAlbum[0].url,
      artistImg: image,
      trackArtists: trackData.artists,
      bioArtist: bio,
      artistName: trackData.artists[0].name,
      albumName: trackData.name,
    });
    window.dispatchEvent(new CustomEvent("route:playing"));
  } catch (e) {
    console.error("Error al reproducir:", e);
  }
}

function handlePlayerComponent(action) {
  const playIcon = document.querySelector(".play-action-icon");
  const PlayIcon = "/iconPlay.svg";
  const PauseIcon = "/iconPause.svg";
  if (action === "stopped") {
    playIcon.src = PauseIcon;
    playIcon.dataset.action = "play";
  } else if (action === "play") {
    playIcon.dataset.action = "stopped";
    playIcon.src = PlayIcon;
  }
}

export function handleColorGreen(actions) {
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
