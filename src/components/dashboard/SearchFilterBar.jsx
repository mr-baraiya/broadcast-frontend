import React from "react";
import { LayoutList, LayoutGrid } from "lucide-react";

export function SearchFilterBar({ searchTerm, onSearchChange, activeFilter, onFilterChange, viewMode = "TABLE", onViewModeChange }) {
  const filters = [
    { id: "ALL", label: "All" },
    { id: "LIVE", label: "Live" },
    { id: "RECENT", label: "Recent" },
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

      {onViewModeChange && (
        <div className="view-mode-toggle-group" style={{ display: "flex", gap: "0.2rem", marginLeft: "0.5rem" }}>
          <button
            type="button"
            className={`filter-chip ${viewMode === "TABLE" ? "active" : ""}`}
            onClick={() => onViewModeChange("TABLE")}
            title="Table View"
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <LayoutList size={14} />
            <span>Table</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${viewMode === "GRID" ? "active" : ""}`}
            onClick={() => onViewModeChange("GRID")}
            title="Grid Cards View"
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <LayoutGrid size={14} />
            <span>Cards</span>
          </button>
        </div>
      )}
    </div>
  );
}

