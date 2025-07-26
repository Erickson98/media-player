import { useEffect, useState } from "react";
import Split from "split-grid";
import "../styles/SplitPanel.css";

export default function SplitLayout() {
  const [showRightPanel, setShowRightPanel] = useState(true);
  var parts_custom: any = "";
  function handleRightPanel(prev: any) {
    const gridTop = document.querySelector(".grid-default");
    if (gridTop === null) {
      return;
    }
    gridTop.classList.value = "grid-default";
    setShowRightPanel(prev);
  }

  useEffect(() => {
    let forcedStyle = null;
    let updateFirstColum = 0.420483;
    let updateSecondColum = 1.57696;
    let updateThirdColum = 1;
    let boolForce = false;
    const MAX_SIZE_THIRD_COLUM = 1;
    const SNAP_TOLERANCE = 0.01;
    const GUTTER = 5;
    Split({
      columnGutters: showRightPanel
        ? [
            {
              track: 1,
              element: document.querySelector(".gutter-1"),
            },
            {
              track: 3,
              element: document.querySelector(".gutter-3"),
            },
          ]
        : [
            {
              track: 1,
              element: document.querySelector(".gutter-1"),
            },
          ],
      columnMinSizes: { 0: 72, 2: 100, 4: 100 },
      onDrag(direction, track, gridTemplateStyle) {
        const parts = gridTemplateStyle
          .split(" ")
          .map((val) => parseFloat(val.replace("fr", "")));

        if (track === 1 && parts[0] > updateFirstColum) {
          console.log(updateFirstColum);
          const gridTemplateGrid = document.getElementById("HELLO")!;
          console.log(updateSecondColum);
          forcedStyle = `${updateFirstColum}fr ${GUTTER}px ${updateSecondColum}fr ${GUTTER}px ${updateThirdColum}fr`;
          gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
          console.log(boolForce);
          boolForce = true;
        }
        if (track === 3 && parts[4] < MAX_SIZE_THIRD_COLUM) {
          updateSecondColum = parts[2];
          updateThirdColum = parts[4];
        }
        if (track === 3 && parts[4] > MAX_SIZE_THIRD_COLUM) {
          // updateSecondColum = parts[2];
          // updateThirdColum = parts[4];
          const gridTemplateGrid = document.getElementById("HELLO")!;
          forcedStyle = `${parts[0]}fr ${GUTTER}px ${updateSecondColum}fr ${GUTTER}px ${updateThirdColum}fr`;
          gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
        }
        // // Snapping en la columna derecha (track 4)
        // if (track === 3 && Math.abs(parts[4] - TARGET_FR) < SNAP_TOLERANCE) {
        //   parts[4] = TARGET_FR;
        // }

        // Guardamos el estilo forzado
      },
    });
  }, [showRightPanel]);

  return (
    <>
      <div className="grid-layout">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: showRightPanel
              ? "0.420483fr 5px 1.57696fr 5px 1fr"
              : "1fr 5px 2fr",
            gridTemplateRows: "100%",
          }}
          id="HELLO"
        >
          <div className="panel">Izquierda</div>
          <div className="gutter-col gutter-1"></div>
          <div className="panel">Centro</div>
          {showRightPanel && <div className="gutter-col gutter-3"></div>}
          {showRightPanel && <div className="panel">Derecha</div>}
        </div>
        <div className="player">
          <button
            className="toggle-btn"
            onClick={() => setShowRightPanel((prev) => !prev)}
          >
            {showRightPanel
              ? "Ocultar columna derecha"
              : "Mostrar columna derecha"}
          </button>
        </div>
      </div>
    </>
  );
}
