import { useEffect, useState, type ReactNode } from "react";
import "../styles/SideBar.css";

export default function SideBar(): ReactNode {
  const [libraryItems, setLibraryItems] = useState([]);
  useEffect(() => {
    fetch("../../api/artist.json")
      .then((res) => res.json())
      .then(setLibraryItems);
  }, []);
  {
    return (
      <div className="library-container">
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
      </div>
    );
  }
}
