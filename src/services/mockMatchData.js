export const MOCK_MATCH_DATA = {
  status: "success",
  data_status: "fresh",
  match: {
    id: "163017",
    title: "India vs Sri Lanka, 2nd Test",
    venue: "Premadasa Stadium, Colombo",
    status: "LIVE",
    status_text: "India lead by 117 runs • Day 3 Session 2",
    teams: ["India", "Sri Lanka"]
  },
  score: {
    team: "India",
    runs: 284,
    wickets: 4,
    overs: 68.2,
    run_rate: 4.16
  },
  partnership: "58 (74)",
  last_wicket: "V Kohli 76 (104) c Mendis b Hasaranga",
  toss: "India won the toss and elected to bat",
  crr: 4.16,
  rrr: null,
  current_batsmen: [
    {
      name: "R Sharma",
      runs: 112,
      balls: 154,
      fours: 12,
      sixes: 3,
      strike_rate: 72.72,
      active: true
    },
    {
      name: "R Jadeja",
      runs: 34,
      balls: 48,
      fours: 4,
      sixes: 1,
      strike_rate: 70.83,
      active: true
    }
  ],
  current_bowler: {
    name: "W Hasaranga",
    overs: 18.2,
    maidens: 3,
    runs: 72,
    wickets: 2,
    economy: 3.92
  },
  recent_balls: [
    { event_id: "e1", over: 68, ball: 2, event: "FOUR", runs: 4, text: "W Hasaranga to R Sharma — FOUR, beautifully driven through covers!" },
    { event_id: "e2", over: 68, ball: 1, event: "DOT", runs: 0, text: "W Hasaranga to R Sharma — no run" },
    { event_id: "e3", over: 67, ball: 6, event: "SINGLE", runs: 1, text: "M Theekshana to R Jadeja — 1 run" },
    { event_id: "e4", over: 67, ball: 5, event: "TWO", runs: 2, text: "M Theekshana to R Jadeja — 2 runs" },
    { event_id: "e5", over: 67, ball: 4, event: "WICKET", runs: 0, text: "M Theekshana to V Kohli — OUT!" },
    { event_id: "e6", over: 67, ball: 3, event: "SIX", runs: 6, text: "M Theekshana to V Kohli — SIX over long on!" }
  ],
  commentary: [
    { event_id: "e1", over: 68, ball: 2, event: "FOUR", runs: 4, text: "W Hasaranga to R Sharma — FOUR, beautifully driven through covers!" },
    { event_id: "e2", over: 68, ball: 1, event: "DOT", runs: 0, text: "W Hasaranga to R Sharma — no run" },
    { event_id: "e3", over: 67, ball: 6, event: "SINGLE", runs: 1, text: "M Theekshana to R Jadeja — 1 run" }
  ]
};
