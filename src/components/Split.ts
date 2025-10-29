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
  const marqueeStates = new WeakMap();
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

            libraryContainer?.classList.remove(
              "container-library-center-style"
            );
            libraryContainer?.classList.add("library-container");
            const libraryContainerInner = document.querySelector(
              ".library-container"
            ) as HTMLElement;
            libraryContainerInner.style.padding = "0px 0px 0px 10px";
            libraryContainerInner.style.margin = "0px 0px 0px 8px";

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
          // const marqueeStates = new WeakMap();

          function startMarquee(container, opts = {}) {
            const span = container.querySelector("span");
            if (!span) return;

            // Aseguramos estilos base
            container.style.position = "relative";
            container.style.overflow = "hidden";
            span.style.position = "relative";
            span.style.whiteSpace = "nowrap";
            span.style.left = span.style.left || "0px";

            // Crear un nuevo estado reseteado siempre
            const state = {
              pos: 0,
              dir: -1, // -1 = izquierda, 1 = derecha
              paused: false,
              rafId: null,
              pauseTime: opts.pauseTime ?? 1000,
              speed: opts.speed ?? 0.5,
            };
            marqueeStates.set(container, state);

            const step = () => {
              const containerWidth = container.clientWidth;
              const textWidth = span.scrollWidth;

              // Si cabe, detener y resetear
              if (textWidth <= containerWidth) {
                span.style.left = "0px";
                if (state.rafId) cancelAnimationFrame(state.rafId);
                state.rafId = null;
                return;
              }

              if (!state.paused) {
                state.pos += state.dir * state.speed;
                span.style.left = state.pos + "px";

                // Extremo derecho (primer carácter)
                if (state.pos >= 0) {
                  state.paused = true;
                  setTimeout(() => {
                    state.dir = -1;
                    state.paused = false;
                  }, state.pauseTime);
                }

                // Extremo izquierdo (último carácter visible)
                if (state.pos <= containerWidth - textWidth) {
                  state.paused = true;
                  setTimeout(() => {
                    state.dir = 1;
                    state.paused = false;
                  }, state.pauseTime);
                }
              }

              state.rafId = requestAnimationFrame(step);
            };

            // Hover (solo se añade una vez)
            if (!container.dataset.marqueeHoverBound) {
              container.addEventListener("mouseenter", () => {
                const s = marqueeStates.get(container);
                if (s) s.paused = true;
              });
              container.addEventListener("mouseleave", () => {
                const s = marqueeStates.get(container);
                if (s) s.paused = false;
              });
              container.dataset.marqueeHoverBound = "1";
            }

            state.rafId = requestAnimationFrame(step);
          }

          function stopMarquee(container) {
            const state = marqueeStates.get(container);
            if (state?.rafId) {
              cancelAnimationFrame(state.rafId);
              state.rafId = null;
            }
          }

          function updateWidth() {
            const screenWidth = (
              document.querySelector(".container-right-panel") as HTMLElement
            ).offsetWidth;
            const newWidth = screenWidth;

            document
              .querySelectorAll(".container-meta-description-song-right-panel")
              .forEach((el) => {
                const span = el.querySelector("span");
                if (!span) return;

                // 1. Detenemos animación y reseteamos
                stopMarquee(el);
                span.style.left = "0px";

                // 2. Actualizamos ancho del contenedor
                el.style.width = newWidth + "px";

                // 3. Reiniciamos si el texto no cabe
                if (span.scrollWidth > el.clientWidth) {
                  startMarquee(el, { speed: 0.3, pauseTime: 2000 });
                }
              });
          }

          // Ejecutar al cargar y en resize (con reset)
          updateWidth();
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
      gridTemplateGrid.style.gridTemplateColumns = `401px ${GUTTER}px 1fr ${GUTTER}px 0px`;
    } else {
      if (rightVisible) {
        gridTemplateGrid.style.gridTemplateColumns = `${
          parts[0]
        }px ${GUTTER}px ${1}fr ${GUTTER}px ${290}px`;
      } else {
        gridTemplateGrid.style.gridTemplateColumns = `${
          parts[0]
        }px ${GUTTER}px ${1}fr ${GUTTER}px ${0}px`;
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
      libraryContainer?.classList.remove("container-library-center-style");
      libraryContainer?.classList.add("library-container");
      const containerLibraryCenterStyle = document.querySelector(
        ".library-container"
      ) as HTMLElement;
      containerLibraryCenterStyle.style.padding = "0px 0px 0px 10px";
      containerLibraryCenterStyle.style.margin = "0px 0px 0px 8px";
    } else if (isOpen === "OPEN") {
      console.log("SECOND INNER");
      if (eachItemOnLibrary !== null) {
        console.log(isOpen);
        eachItemOnLibrary.forEach((element) => {
          element.style.justifyContent = "center";
        });
      }
      const containerLibraryCenterStyle = document.querySelector(
        ".library-container"
      ) as HTMLElement;
      containerLibraryCenterStyle.style.padding = "0px";
      containerLibraryCenterStyle.style.margin = "0px";
      libraryItemNodeList.forEach((element) => {
        element.style.marginRight = "0px";
      });
      containerContentMedia.forEach((element) => {
        element.style.display = "none";
        containerSearchInput.style.display = "none";
        textYourLibrary.style.display = "none";

        // containerContentMedia.forEach((element) => {
        //   element.style.display = "none";
        // });
        containerActionLibraryButton.style.margin = "5px auto";

        libraryContainer?.classList.remove("library-container");
        libraryContainer?.classList.add("container-library-center-style");
        library.style.alignItems = "center";
      });
    }
  });
}

SplitComponent();
