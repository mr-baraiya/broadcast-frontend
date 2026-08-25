import React from "react";

export function SearchFilterBar({ searchTerm, onSearchChange, activeFilter, onFilterChange }) {
  const filters = [
    { id: "ALL", label: "All" },
    { id: "LIVE", label: "Live" },
    { id: "UPCOMING", label: "Upcoming" }
  ];

  return (
    <div className="search-filter-toolbar">
      <div className="search-input-wrap">
        <input
          type="text"
          className="search-input-field"
          placeholder="Search teams, matches, venues…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search matches"
        />
      </div>

      <div className="filter-chips-group">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            className={`filter-chip ${activeFilter === id ? "active" : ""}`}
            onClick={() => onFilterChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
