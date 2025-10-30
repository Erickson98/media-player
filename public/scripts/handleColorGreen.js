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
      const res = await fetch(
        `/api/genius/artist-bio?q=${encodeURIComponent(
          trackData.artists[0].name
        )}`
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
  } else {
    try {
      await spotifyPlayerAction("pause", { deviceId: window.deviceId });
    } catch (error) {
      console.log(error);
    }
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
      const res = await fetch(
        `/api/genius/artist-bio?q=${encodeURIComponent(
          lastPlayed.artists[0].name
        )}`
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
  } else {
    try {
      await spotifyPlayerAction("pause", { deviceId: window.deviceId });
    } catch (error) {
      console.log(error);
    }
  }
}

async function handleArtistCarrousel(trackData) {
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
  } else {
    try {
      await spotifyPlayerAction("pause", { deviceId: window.deviceId });
    } catch (error) {
      console.log(error);
    }
  }
}

async function handleAlbumCarrousel(trackData) {
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
        `/api/genius/artist-bio?q=${encodeURIComponent(
          trackData.artists[0].name
        )}`
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
  } else {
    try {
      await spotifyPlayerAction("pause", { deviceId: window.deviceId });
    } catch (error) {
      console.error(error);
    }
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
