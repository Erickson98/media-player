import Split from "split-grid";

function SplitComponent() {
  const gutterLeft = document.querySelector(".gutter-1");
  const gutterRight = document.querySelector(".gutter-right");
  const rightPanel = document.querySelector(".right-panel");
  const toggleBtn = document.querySelector(".toggle");
  const gridTemplateGrid = document.getElementById("split-wrapper")!;

  const MAX_SIZE_THIRD_COLUM = 409;
  const MIN_SIZE_THIRD_COLUMN = 290;
  const GUTTER = 10;
  const SNAPOFFSET = 230;
  const MIN_SIZE_FIRST_GUTTER = 260;
  const MIN_SIZE_LEFT_PANEL = 104;
  const MAX_SIZE_FIRST_COLUMN = 409;

  let rightVisible = true;
  const TwoSplit = [
    {
      track: 1,
      element: gutterLeft!,
    },
    {
      track: 3,
      element: gutterRight!,
    },
  ];
  const OneSplit = [
    {
      track: 1,
      element: gutterLeft!,
    },
  ];

  const containerSearchInput = document.querySelector(
    ".container-search-bar"
  ) as HTMLElement;
  const icon = document.querySelector(".library-icon") as any;
  const textYourLibrary = document.querySelector(
    ".label-your-library"
  ) as HTMLElement;

  const library = document.querySelector(".library") as HTMLElement;
  const libraryContainer = document.querySelector(".library-container");
  const containerActionLibraryButton = document.querySelector(
    ".container-action-library-button"
  ) as HTMLElement;
  const ClosedLibrary = "/closedLibrary.svg";
  const OpenLibrary = "/openLibrary.svg";
  const setupSplit = () => {
    let forcedStyle = null;

    Split({
      columnGutters: rightVisible ? [...TwoSplit] : [...OneSplit],
      onDrag(direction, track, gridTemplateStyle) {
        const parts = gridTemplateStyle
          .split(" ")
          .map((val) => parseFloat(val.replace("fr", "")));
        if (rightVisible) {
          const containerContentMedia = document.querySelectorAll(
            ".container-title-meta"
          ) as NodeListOf<HTMLElement>;
          const eachItemOnLibrary = document.querySelectorAll(
            ".album-btn"
          ) as NodeListOf<HTMLElement>;
          const containerLibraryCenterStyle = document.querySelector(
            ".container-library-center-style"
          ) as HTMLElement;
          const libraryContainerInner = document.querySelector(
            ".library-container"
          ) as HTMLElement;
          const libraryItemNodeList = document.querySelectorAll(
            ".library-item"
          ) as NodeListOf<HTMLElement>;

          if (track === 1 && parts[0] < MIN_SIZE_FIRST_GUTTER) {
            forcedStyle = `${MIN_SIZE_LEFT_PANEL}px ${GUTTER}px ${1.73604}fr ${GUTTER}px ${
              parts[4]
            }px`;
            gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
            containerSearchInput.style.display = "none";
            textYourLibrary.style.display = "none";

            icon.id = "CLOSE";
            icon.src = ClosedLibrary;

            eachItemOnLibrary.forEach((element) => {
              element.style.justifyContent = "center";
            });
            libraryContainerInner.style.padding = "0px";
            libraryContainerInner.style.margin = "0px";
            libraryItemNodeList.forEach((element) => {
              element.style.marginRight = "0px";
            });
            containerContentMedia.forEach((element) => {
              element.style.display = "none";
            });

            libraryContainer?.classList.remove("library-container");
            libraryContainer?.classList.add("container-library-center-style");
            library.style.alignItems = "center";
            containerActionLibraryButton.style.margin = "5px auto";
          } else if (track === 1 && parts[0] > MIN_SIZE_FIRST_GUTTER) {
            if (eachItemOnLibrary !== null) {
              eachItemOnLibrary.forEach((element) => {
                element.style.justifyContent = "flex-start";
              });
            }
            // containerLibraryCenterStyle.style.padding = "0px 0px 0px 10px";
            // containerLibraryCenterStyle.style.margin = "0px 0px 0px 8px";
            libraryItemNodeList.forEach((element) => {
              element.style.marginRight = "10px";
            });
            console.log("IS OPEN");
            icon.id = "OPEN";
            icon.src = OpenLibrary;
            textYourLibrary.style.display = "block";
            containerSearchInput.style.display = "flex";
            library.style.alignItems = "start";
            containerActionLibraryButton.style.margin = "13px 8px";

            containerContentMedia.forEach((element) => {
              element.style.display = "inline-grid";
            });
          }

          if (track === 1 && parts[0] > MAX_SIZE_FIRST_COLUMN) {
            forcedStyle = `${MAX_SIZE_FIRST_COLUMN}px ${GUTTER}px ${parts[2]}fr ${GUTTER}px ${parts[4]}px`;
            gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
          }
          if (track === 3 && parts[4] < MIN_SIZE_THIRD_COLUMN) {
            forcedStyle = `${parts[0]}px ${GUTTER}px ${parts[2]}fr ${GUTTER}px ${MIN_SIZE_THIRD_COLUMN}px`;
            gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
          }
          if (track === 3 && parts[4] > MAX_SIZE_THIRD_COLUM) {
            const gridTemplateGrid = document.getElementById("split-wrapper")!;
            forcedStyle = `${parts[0]}px ${GUTTER}px ${parts[2]}fr ${GUTTER}px ${MAX_SIZE_THIRD_COLUM}px`;
            gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
          }
        } else {
          if (track === 1 && parts[0] < MIN_SIZE_FIRST_GUTTER) {
            forcedStyle = `${MIN_SIZE_LEFT_PANEL}px ${GUTTER}px ${1.73604}fr`;
            gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
            containerSearchInput.style.display = "none";
          } else if (track === 1 && parts[0] > MIN_SIZE_FIRST_GUTTER) {
            containerSearchInput.style.display = "flex";
          }

          if (track === 1 && parts[0] > MAX_SIZE_FIRST_COLUMN) {
            forcedStyle = `${MAX_SIZE_FIRST_COLUMN}px ${GUTTER}px ${parts[2]}fr`;
            gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
          }
        }
      },
      onDragStart(direction, track) {
        if (track === 1) {
          const gutter = document.querySelector(".gutter-left-row");
          gutter?.classList.add("active");
        } else if (track === 3) {
          const gutter = document.querySelector(".gutter-right");
          gutter?.classList.add("active");
        }
      },
      onDragEnd(direction, track) {
        if (track === 1) {
          const gutter = document.querySelector(".gutter-left-row");
          gutter?.classList.remove("active");
        } else if (track === 3) {
          const gutter = document.querySelector(".gutter-right");
          gutter?.classList.remove("active");
        }
      },
    });
  };

  setupSplit();

  toggleBtn.addEventListener("click", () => {
    rightVisible = !rightVisible;
    const gridTemplateGrid = document.getElementById("split-wrapper")!;
    rightPanel.style.display = rightVisible ? "" : "none";
    gutterRight.style.display = rightVisible ? "" : "none";
    const parts = gridTemplateGrid.style.gridTemplateColumns
      .split(" ")
      .map((val) => parseFloat(val.replace("fr", "")));
    if (Number.isNaN(parts[0])) {
      gridTemplateGrid.style.gridTemplateColumns = "401px 5px 1fr 5px 0px";
    } else {
      if (rightVisible) {
        gridTemplateGrid.style.gridTemplateColumns = `${
          parts[0]
        }px 5px ${1}fr 5px ${290}px`;
      } else {
        gridTemplateGrid.style.gridTemplateColumns = `${
          parts[0]
        }px 5px ${1}fr 5px ${0}px`;
      }
    }
    // setupSplit();
  });

  const button = document.querySelector(".button-to-collapse-library");
  const searchBar = document.querySelector(
    ".container-search-bar"
  ) as HTMLElement;
  button?.addEventListener("click", () => {
    const eachItemOnLibrary = document.querySelectorAll(
      ".album-btn"
    ) as NodeListOf<HTMLElement>;
    const containerContentMedia = document.querySelectorAll(
      ".container-title-meta"
    ) as NodeListOf<HTMLElement>;
    const containerLibraryCenterStyle = document.querySelector(
      ".library-container"
    ) as HTMLElement;
    const libraryItemNodeList = document.querySelectorAll(
      ".library-item"
    ) as NodeListOf<HTMLElement>;

    const isOpen = icon.id;
    icon.src = isOpen === "CLOSE" ? OpenLibrary : ClosedLibrary;
    icon.id = isOpen === "CLOSE" ? "OPEN" : "CLOSE";

    const gridTemplateGrid = document.getElementById("split-wrapper")!;
    const styles = window.getComputedStyle(gridTemplateGrid);
    const gridTemplateColumns = styles.gridTemplateColumns;

    const parts = gridTemplateColumns
      .split(" ")
      .map((val) => parseFloat(val.replace("fr", "")));

    const OPEN_PANEL = `${MAX_SIZE_THIRD_COLUM}px ${GUTTER}px ${parts[2]}fr ${GUTTER}px ${parts[4]}px`;
    const CLOSE_PANEL = `${MIN_SIZE_LEFT_PANEL}px ${GUTTER}px ${parts[2]}fr ${GUTTER}px ${parts[4]}px`;

    searchBar.style.display = isOpen === "CLOSE" ? "flex" : "none";

    gridTemplateGrid.style.gridTemplateColumns =
      isOpen === "CLOSE" ? OPEN_PANEL : CLOSE_PANEL;

    textYourLibrary.style.display = isOpen === "CLOSE" ? "block" : "none";
    if (isOpen === "CLOSE") {
      console.log("INNEr");
      if (eachItemOnLibrary !== null) {
        console.log(isOpen);
        eachItemOnLibrary.forEach((element) => {
          element.style.justifyContent = "flex-start";
        });
      }
      // containerLibraryCenterStyle.style.padding = "0px 0px 0px 10px";
      // containerLibraryCenterStyle.style.margin = "0px 0px 0px 8px";
      libraryItemNodeList.forEach((element) => {
        element.style.marginRight = "10px";
      });
      containerContentMedia.forEach((element) => {
        element.style.display = "inline-grid";
      });
      textYourLibrary.style.display = "block";
      containerSearchInput.style.display = "flex";
      library.style.alignItems = "start";
      containerActionLibraryButton.style.margin = "13px 8px";
    } else if (isOpen === "OPEN") {
      console.log("SECOND INNER");
      if (eachItemOnLibrary !== null) {
        console.log(isOpen);
        eachItemOnLibrary.forEach((element) => {
          element.style.justifyContent = "center";
        });
      }
      containerLibraryCenterStyle.style.padding = "0px";
      containerLibraryCenterStyle.style.margin = "0px";
      libraryItemNodeList.forEach((element) => {
        element.style.marginRight = "0px";
      });
      containerContentMedia.forEach((element) => {
        element.style.display = "none";
        containerSearchInput.style.display = "none";
        textYourLibrary.style.display = "none";

        containerContentMedia.forEach((element) => {
          element.style.display = "none";
        });
        containerActionLibraryButton.style.margin = "5px auto";

        libraryContainer?.classList.remove("library-container");
        libraryContainer?.classList.add("container-library-center-style");
        library.style.alignItems = "center";
      });
    }
  });
}

SplitComponent();
