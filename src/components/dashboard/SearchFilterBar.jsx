import React from "react";
import { Search } from "lucide-react";

export function SearchFilterBar({ searchTerm, onSearchChange, activeFilter, onFilterChange }) {
  const filters = [
    { id: "ALL", label: "All Matches" },
    { id: "LIVE", label: "Live Now" },
    { id: "UPCOMING", label: "Upcoming" }
  ];

  return (
    <div className="search-filter-toolbar">
      <div className="search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input-field"
          placeholder="Search teams, matches, competitions or venues..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search matches"
        />
      </div>

      <div className="filter-chips-group">
        {filters.map(({ id, label }) => {
          const isSelected = activeFilter === id;
          return (
            <button
              key={id}
              className={`filter-chip ${isSelected ? "active" : ""}`}
              onClick={() => onFilterChange(id)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
