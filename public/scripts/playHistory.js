const KEY = "playHistory";
const MAX = 100;

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "null");
    if (data && Array.isArray(data.items)) return data;
  } catch (_) {}
  return { items: [], index: -1 };
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function pushTrack(track) {
  if (!track?.uri) return;
  const state = load();
  const current = state.items[state.index];
  if (current && current.uri === track.uri) return;
  state.items = state.items.slice(0, state.index + 1);
  state.items.push(track);
  if (state.items.length > MAX) state.items.shift();
  state.index = state.items.length - 1;
  save(state);
}

export function goPrevious() {
  const state = load();
  if (state.index <= 0) return null;
  state.index -= 1;
  save(state);
  return state.items[state.index];
}

export function goNext() {
  const state = load();
  if (state.index >= state.items.length - 1) return null;
  state.index += 1;
  save(state);
  return state.items[state.index];
}

export function getCurrentHistory() {
  const state = load();
  return state.items[state.index] || null;
}
