import Split from "split-grid";

export default function initSplit(showRightPanel = true) {
  const gutter1 = {
    track: 1,
    element: document.querySelector(".gutter-col-1")! as HTMLElement,
  };

  const gutter3 = {
    track: 3,
    element: document.querySelector(".gutter-col-3")! as HTMLElement,
  };

  Split({
    snapOffset: 0,
    columnGutters: [gutter1, ...(showRightPanel ? [gutter3] : [])],
  });
}
