import { useEffect, useMemo, useState, type ReactNode } from "react";
import "../styles/SideBar.css";
import RenderList from "./RenderList";
import SearchBar from "./SearchBar";
import type { library } from "../models/interfaces";

export default function SideBar(): ReactNode {
  const [libraryItems, setLibraryItems] = useState<library[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("../../api/artist.json")
      .then((res) => res.json())
      .then(setLibraryItems)
      .catch((err) => console.error("Failed to fetch albums:", err));
  }, []);
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return libraryItems;

    return libraryItems.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [libraryItems, search]);
  return (
    <div className="library-container">
      <SearchBar value={search} onChange={setSearch} />
      <RenderList libraryItems={filteredItems} />
    </div>
  );
}
