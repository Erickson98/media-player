import { useEffect, useState } from "react";
import type { library } from "../utils/interfaces";

type RenderListProps = {
  libraryItems: library[];
};
export default function RenderList({ libraryItems }: RenderListProps) {
  return (
    <>
      {libraryItems.map((item) => {
        return (
          <div key={item.title} className="library-item">
            <img src={item.image} alt={item.title} width={48} height={48} />
            <div>
              <div className="title">{item.title}</div>
              <div className="meta">
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                {item.owner && ` • ${item.owner}`}
                {item.extra && ` • ${item.extra}`}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
