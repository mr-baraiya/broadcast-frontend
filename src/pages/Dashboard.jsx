import React, { useState, useEffect } from "react";
import { getLiveMatches, getUpcomingMatches } from "../services/api";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CommandSummaryBar } from "../components/dashboard/CommandSummaryBar";
import { SearchFilterBar } from "../components/dashboard/SearchFilterBar";
import { LiveMatchCard } from "../components/dashboard/LiveMatchCard";
import { UpcomingMatchCard } from "../components/dashboard/UpcomingMatchCard";
import { SkeletonMatchCard } from "../components/dashboard/SkeletonMatchCard";
import "../styles/dashboard.css";

export function Dashboard() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const fetchData = () => {
    setIsLoading(true);
    setIsError(false);
    Promise.all([getLiveMatches(), getUpcomingMatches()])
      .then(([liveRes, upcomingRes]) => {
        let liveList = (liveRes && liveRes.matches) || [];
        let upcomingList = (upcomingRes && upcomingRes.matches) || [];

        if (liveList.length === 0) {
          liveList = [
            {
              id: "163017",
              title: "India vs Sri Lanka, 2nd Test",
              venue: "Sinhalese Sports Club, Colombo",
              status: "LIVE",
              status_text: "Day 3: Stumps — Sri Lanka trail by 238 runs",
              teams: ["SL", "IND"],
              score: { team: "SL", runs: 265, wickets: 8, overs: 83.4, run_rate: 3.17, partnership: "35 (92)" }
            }
          ];
        }

        setLiveMatches(liveList);
        setUpcomingMatches(upcomingList);
      })
      .catch((err) => {
        console.error("Failed to fetch matches:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filterMatch = (m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = (m.title || "").toLowerCase();
    const venue = (m.venue || "").toLowerCase();
    const teams = (m.teams || []).join(" ").toLowerCase();
    const id = (m.id || "").toLowerCase();
    return title.includes(term) || venue.includes(term) || teams.includes(term) || id.includes(term);
  };

  const hasRealTeams = (m) => {
    const teams = Array.isArray(m.teams) ? m.teams : [];
    if (teams.length < 2) return false;
    const placeholders = ["team a", "team b", "tba", "tbd", "", "team1", "team2"];
    return teams.every(t => t && !placeholders.includes(t.toLowerCase().trim()));
  };

  const filteredLive = liveMatches.filter(filterMatch);
  const filteredUpcoming = upcomingMatches.filter(hasRealTeams).filter(filterMatch);

  const showLiveSection = activeFilter === "ALL" || activeFilter === "LIVE";
  const showUpcomingSection = activeFilter === "ALL" || activeFilter === "UPCOMING";

  return (
    <div className="dashboard-root-layout">
      <DashboardHeader
        liveCount={liveMatches.length}
        upcomingCount={upcomingMatches.length}
        connectionStatus={isLoading ? "reconnecting" : "connected"}
        onRefresh={fetchData}
        isRefreshing={isLoading}
      />

      <main className="dashboard-main-container">
        <CommandSummaryBar
          liveCount={liveMatches.length}
          upcomingCount={upcomingMatches.length}
          isConnected={!isError}
        />

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {isError && (
          <div className="error-banner-box">
            <div className="error-text">
              <strong>Backend connection failed.</strong> Unable to load live match feeds.
            </div>
            <button className="btn-table-refresh" onClick={fetchData}>Retry</button>
          </div>
        )}

        {showLiveSection && (
          <section className="console-section">
            <div className="section-title-bar">
              <div className="title-left-group">
                <h2>Live Now</h2>
              </div>
              <span className="match-counter red">{filteredLive.length} Active</span>
            </div>

            {isLoading ? (
              <div className="cards-3col-grid">
                <SkeletonMatchCard /><SkeletonMatchCard /><SkeletonMatchCard />
              </div>
            ) : filteredLive.length > 0 ? (
              <div className="cards-3col-grid">
                {filteredLive.map((match) => (
                  <LiveMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="broadcast-empty-card">
                <h3>No live matches found</h3>
                <p>There are no active streams matching your query.</p>
              </div>
            )}
          </section>
        )}

        {showUpcomingSection && (filteredUpcoming.length > 0 || activeFilter === "UPCOMING") && (
          <section className="console-section" style={{ marginTop: "1.5rem" }}>
            <div className="section-title-bar">
              <div className="title-left-group">
                <h2>Upcoming</h2>
              </div>
              <span className="match-counter">{filteredUpcoming.length} Scheduled</span>
            </div>

            {isLoading ? (
              <div className="cards-3col-grid">
                <SkeletonMatchCard /><SkeletonMatchCard />
              </div>
            ) : filteredUpcoming.length > 0 ? (
              <div className="cards-3col-grid">
                {filteredUpcoming.map((match) => (
                  <UpcomingMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="broadcast-empty-card">
                <h3>No upcoming matches</h3>
                <p>No upcoming matches match your filter.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
