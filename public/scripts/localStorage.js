export function localStorageGet(key) {
  return JSON.parse(localStorage.getItem(key) ?? "");
}

export function localStorageSet(key, element) {
  localStorage.setItem(key, JSON.stringify(element));
}
