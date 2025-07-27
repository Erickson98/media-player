import SearchIcon from "./SearchIcon";
import "../styles/SearchBar.css";
import React, { useState } from "react";
import XIcon from "./XIcons";

type SearchBarsProps = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({ value, onChange }: SearchBarsProps) {
  return (
    <div className="container-search-bar">
      <SearchIcon />
      <label>
        <input
          name="inputSearch"
          placeholder="Search..."
          value={value}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      {value && (
        <button
          type="button"
          className="clear-button"
          aria-label="delete-content-for-searbar"
          onClick={() => onChange("")}
        >
          <XIcon width="12px" height="12px" fill="white" enableBackground={1} />
        </button>
      )}
    </div>
  );
}
