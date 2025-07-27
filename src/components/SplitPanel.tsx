import { useEffect, useState } from "react";
import Split from "split-grid";
import "../styles/SplitPanel.css";
import SideBar from "./SideBar";

export default function SplitLayout() {
  const [showRightPanel, setShowRightPanel] = useState(true);

  useEffect(() => {
    let forcedStyle = null;
    let updateFirstColum = 0.420483;
    let updateSecondColum = 1.57696;
    let updateThirdColum = 1;
    let boolForce = false;
    const MAX_SIZE_THIRD_COLUM = 1;
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
      columnMinSizes: { 0: 80, 2: 100, 4: 100 },
      onDrag(direction, track, gridTemplateStyle) {
        const parts = gridTemplateStyle
          .split(" ")
          .map((val) => parseFloat(val.replace("fr", "")));

        if (track === 1 && parts[0] > updateFirstColum) {
          const gridTemplateGrid = document.getElementById("HELLO")!;
          forcedStyle = `${updateFirstColum}fr ${GUTTER}px ${updateSecondColum}fr ${GUTTER}px ${updateThirdColum}fr`;
          gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
          boolForce = true;
        }
        if (track === 3 && parts[4] < MAX_SIZE_THIRD_COLUM) {
          updateSecondColum = parts[2];
          updateThirdColum = parts[4];
        }
        if (track === 3 && parts[4] > MAX_SIZE_THIRD_COLUM) {
          const gridTemplateGrid = document.getElementById("HELLO")!;
          forcedStyle = `${parts[0]}fr ${GUTTER}px ${updateSecondColum}fr ${GUTTER}px ${updateThirdColum}fr`;
          gridTemplateGrid.style.gridTemplateColumns = forcedStyle;
        }
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
            overflowY: "auto",
          }}
          id="HELLO"
        >
          <div className="panel">
            <SideBar />
          </div>
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
