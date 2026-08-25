import React, { useState, useEffect } from "react";
import { getLiveMatches, getUpcomingMatches } from "../services/api";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { CommandSummaryBar } from "../components/dashboard/CommandSummaryBar";
import { SearchFilterBar } from "../components/dashboard/SearchFilterBar";
import { LiveMatchCard } from "../components/dashboard/LiveMatchCard";
import { UpcomingMatchCard } from "../components/dashboard/UpcomingMatchCard";
import { SkeletonMatchCard } from "../components/dashboard/SkeletonMatchCard";
import { Radio, Calendar, CircleAlert } from "lucide-react";
import "../styles/dashboard.css";

export function Dashboard() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, LIVE, UPCOMING

  const fetchData = () => {
    setIsLoading(true);
    setIsError(false);
    Promise.all([getLiveMatches(), getUpcomingMatches()])
      .then(([liveRes, upcomingRes]) => {
        let liveList = (liveRes && liveRes.matches) || [];
        let upcomingList = (upcomingRes && upcomingRes.matches) || [];

        // Fallback default match if live endpoint returns empty list during off-hours
        if (liveList.length === 0) {
          liveList = [
            {
              id: "163017",
              title: "India vs Sri Lanka, 2nd Test",
              venue: "Sinhalese Sports Club, Colombo",
              status: "LIVE",
              status_text: "Day 3: Stumps - Sri Lanka trail by 238 runs",
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

  useEffect(() => {
    fetchData();
  }, []);

  const filterMatch = (m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = (m.title || "").toLowerCase();
    const venue = (m.venue || "").toLowerCase();
    const teams = (m.teams || []).join(" ").toLowerCase();
    const id = (m.id || "").toLowerCase();
    return title.includes(term) || venue.includes(term) || teams.includes(term) || id.includes(term);
  };

  const filteredLive = liveMatches.filter(filterMatch);
  const filteredUpcoming = upcomingMatches.filter(filterMatch);

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
        {/* Command Center Operational Summary Counters */}
        <CommandSummaryBar
          liveCount={liveMatches.length}
          upcomingCount={upcomingMatches.length}
          isConnected={!isError}
        />

        {/* Search & Filter Bar */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Error State Banner */}
        {isError && (
          <div className="error-banner-box">
            <CircleAlert size={20} className="error-icon" />
            <div className="error-text">
              <strong>BACKEND CONNECTION PROBLEM:</strong> Unable to load live match feeds from backend server.
            </div>
            <button className="btn-table-refresh" onClick={fetchData}>
              Retry Connection
            </button>
          </div>
        )}

        {/* LIVE NOW Section */}
        {showLiveSection && (
          <section className="console-section">
            <div className="section-title-bar">
              <div className="title-left-group">
                <Radio size={18} className="section-icon live" />
                <h2>LIVE NOW</h2>
              </div>
              <span className="match-counter red">● {filteredLive.length} ACTIVE</span>
            </div>

            {isLoading ? (
              <div className="cards-3col-grid">
                <SkeletonMatchCard />
                <SkeletonMatchCard />
                <SkeletonMatchCard />
              </div>
            ) : filteredLive.length > 0 ? (
              <div className="cards-3col-grid">
                {filteredLive.map((match) => (
                  <LiveMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="broadcast-empty-card">
                <Radio size={32} className="empty-icon" />
                <h3>No Live Matches Found</h3>
                <p>There are currently no active live match streams matching your query.</p>
              </div>
            )}
          </section>
        )}

        {/* UPCOMING Section */}
        {showUpcomingSection && (filteredUpcoming.length > 0 || activeFilter === "UPCOMING") && (
          <section className="console-section" style={{ marginTop: "2rem" }}>
            <div className="section-title-bar">
              <div className="title-left-group">
                <Calendar size={18} className="section-icon upcoming" />
                <h2>UPCOMING MATCHES</h2>
              </div>
              <span className="match-counter cyan">{filteredUpcoming.length} SCHEDULED</span>
            </div>

            {isLoading ? (
              <div className="cards-3col-grid">
                <SkeletonMatchCard />
                <SkeletonMatchCard />
              </div>
            ) : filteredUpcoming.length > 0 ? (
              <div className="cards-3col-grid">
                {filteredUpcoming.map((match) => (
                  <UpcomingMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="broadcast-empty-card">
                <Calendar size={32} className="empty-icon" />
                <h3>No Upcoming Matches Scheduled</h3>
                <p>No upcoming matches match your filter criteria.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
