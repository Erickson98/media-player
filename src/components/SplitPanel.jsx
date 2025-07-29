import { useEffect, useState } from "react";
import Split from "split-grid";

export default function SplitLayout() {
  const [showRightPanel, setShowRightPanel] = useState(true);

  useEffect(() => {
    if (showRightPanel) {
      Split({
        columnGutters: [
          {
            track: 1,
            element: document.querySelector(".gutter-1"),
          },
          {
            track: 3,
            element: document.querySelector(".gutter-3"),
          },
        ],
        columnMinSize: 200,
      });
    } else {
      Split({
        columnGutters: [
          {
            track: 1,
            element: document.querySelector(".gutter-1"),
          },
        ],
      });
    }
  }, [showRightPanel]);

  return (
    <>
      <style>
        {`
          .grid-layout {
            display: grid;
            height: 100vh;
            grid-template-rows: 1fr auto;
          }

          .grid-top {
            display: grid;
            grid-template-columns: ${
              showRightPanel ? "1fr 10px 1fr 10px 1fr" : "1fr 10px 2fr"
            };
            grid-template-rows: 100%;
          }

          .panel {
            padding: 1rem;
            overflow: auto;
            background: #1e1e1e;
            color: white;
            border: 1px solid #333;
          }

          .gutter-col {
            background: #444;
            cursor: col-resize;
            width: 10px;
          }

          .player {
            background: #111;
            color: white;
            padding: 1rem;
            text-align: center;
          }

          .toggle-btn {
            background: #222;
            color: white;
            border: 1px solid #444;
            padding: 0.5rem 1rem;
            cursor: pointer;
          }
        `}
      </style>

      <div className="grid-layout">
        <div className="grid-top">
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
