import React from "react";

export function SkeletonMatchCard() {
  return (
    <div className="card-broadcast-match skeleton-card">
      <div className="skeleton-line header" />
      <div className="skeleton-line row" />
      <div className="skeleton-line row" />
      <div className="skeleton-line footer" />
    </div>
  );
}
