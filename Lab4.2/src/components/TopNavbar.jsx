import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv, faSearch } from "@fortawesome/free-solid-svg-icons";

function TopNavbar({ onSearch }) {
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
      setSearchMode(false);
    }
  };

  return (
    <div className="top-navbar">
      <FontAwesomeIcon icon={faTv} className="icon" />

      {!searchMode ? (
        <h2>
          Following | <span>For You</span>
        </h2>
      ) : (
        <input
          type="text"
          className="search-input"
          placeholder="Enter hashtag (e.g. #coding)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      <FontAwesomeIcon
        icon={faSearch}
        className="icon"
        onClick={() => setSearchMode(!searchMode)}
      />
    </div>
  );
}

export default TopNavbar;