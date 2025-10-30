import { OverlayScrollbars, ClickScrollPlugin } from "overlayscrollbars";
export function initCustomScroll() {
  const target = document.getElementById("album-list");
  if (!target) return;
  OverlayScrollbars(target, {
    scrollbars: {
      autoHide: "leave",
    },
    overflow: {
      x: "hidden",
    },
  });
}
initCustomScroll();
