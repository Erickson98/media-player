import { OverlayScrollbars, ClickScrollPlugin } from "overlayscrollbars";
export function initCustomScroll() {
  debugger;
  const target = document.getElementById("album-list");
  if (!target) return;
  OverlayScrollbars(target, {
    scrollbars: {
      autoHide: "leave", // se oculta si no hay hover
    },
    overflow: {
      x: "hidden", // solo scroll vertical
    },
  });
}
initCustomScroll();
