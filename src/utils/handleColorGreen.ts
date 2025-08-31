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
  debugger;
  console.log(imgButton.dataset.state);
  if (imgButton.dataset.state === "play") {
    imgButton.src = PauseIcon;
    imgButton.dataset.state = "stopped";
  } else {
    imgButton.src = PlayIcon;
    imgButton.dataset.state = "play";
  }
}

function removeLastPlayed(lastPlayed: string) {
  if (lastPlayed && lastPlayed.class === "playSong-top-songs") {
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
function addCurrentSong(trackData: Object) {
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
}

function handleTopSongs(trackData: Object) {
  const lastPlayed = localStorageGet("lastPlayedTrack");
  if (lastPlayed.id !== trackData.id) {
    removeLastPlayed(lastPlayed);
  }

  addCurrentSong(trackData);
}

function handleMainTopSong(trackData: Object) {
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
}

function handleArtistCarrousel(trackData: object) {
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
}

function handleAlbumCarrousel(trackData: object) {
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
