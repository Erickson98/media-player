export function localStorageGet(key: string) {
  return JSON.parse(localStorage.getItem(key) ?? "");
}

export function localStorageSet(key: string, element: any) {
  localStorage.setItem(key, JSON.stringify(element));
}
