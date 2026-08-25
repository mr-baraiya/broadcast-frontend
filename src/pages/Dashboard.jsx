import React, { useState, useEffect } from "react";
import { getLiveMatches, getUpcomingMatches, getMatchFull } from "../services/api";
import { normalizeMatchData } from "../utils/normalizeMatch";
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

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [liveRes, upcomingRes] = await Promise.all([getLiveMatches(), getUpcomingMatches()]);
      let liveList = (liveRes && liveRes.matches) || [];
      let upcomingList = (upcomingRes && upcomingRes.matches) || [];

      if (liveList.length === 0) {
        try {
          const match163017Data = await getMatchFull("163017");
          if (match163017Data) {
            const normalized = normalizeMatchData(match163017Data);
            liveList = [{
              id: "163017",
              title: normalized.title || "India vs Sri Lanka, 2nd Test",
              venue: normalized.venue || "Sinhalese Sports Club, Colombo",
              status: normalized.status || "LIVE",
              status_text: normalized.statusText || "Day 3: Session 2",
              teams: normalized.teams || ["SL", "IND"],
              score: normalized.score
            }];
          }
        } catch (mErr) {
          console.warn("Match 163017 API fetch error:", mErr);
        }
      }

      setLiveMatches(liveList);
      setUpcomingMatches(upcomingList);
    } catch (err) {
      console.error("Failed to fetch matches from API:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
