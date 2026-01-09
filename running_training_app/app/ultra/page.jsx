import runs from "../../data/ultra50km.json";

export default function UltraPage() {
  /* ------------------ Constants ------------------ */
  const TRAINING_START = new Date("2026-01-05");
  const RACE_DATE = new Date("2026-06-13");
  const WEEKLY_GOAL_MAX = 55;
  const WEEKLY_MILE_GOAL = 40;     // miles
  const WEEKLY_TIME_GOAL = 7 * 60 * 60; // 7 hours in seconds


  /* ------------------ Helpers ------------------ */
  const paceToSeconds = (pace) => {
    const [min, sec] = pace.split(":").map(Number);
    return min * 60 + sec;
  };

  const secondsToPace = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const timeToSeconds = (time) => {
    const [h = 0, m, s] = time.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const secondsToTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  /* ------------------ Filter Runs ------------------ */
  const trainingRuns = runs.filter((r) => {
    const d = new Date(r.Date);
    return d >= TRAINING_START && d <= RACE_DATE;
  });

  /* ------------------ Weekly Aggregates (ALL WEEKS) ------------------ */

  // get Monday of a date (timezone-safe)
  const getMonday = (dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    return monday.toISOString().slice(0, 10);
  };

  // generate every week from start → race day
  const generateWeeks = (start, end) => {
    const weeks = [];
    const current = new Date(start + "T12:00:00");

    while (current <= end) {
      weeks.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 7);
    }
    return weeks;
  };

  const trainingWeeks = generateWeeks(
    TRAINING_START.toISOString().slice(0, 10),
    RACE_DATE
  );

  // initialize ALL weeks with 0s
  const weeklyStats = {};
  trainingWeeks.forEach((w) => {
    weeklyStats[w] = { miles: 0, time: 0 };
  });

  // fill from runs
  trainingRuns.forEach((run) => {
    const week = getMonday(run.Date);
    if (!weeklyStats[week]) return;

    weeklyStats[week].miles += Number(run.Distance) || 0;
    weeklyStats[week].time += timeToSeconds(run.TotalTime);
  });

  const maxWeekMiles = Math.max(
    ...trainingWeeks.map((w) => weeklyStats[w].miles),
    1
  );

  const maxWeekTime = Math.max(
    ...trainingWeeks.map((w) => weeklyStats[w].time),
    1
  );

  /* ------------------ Overall Metrics ------------------ */
  const totalMiles = trainingRuns.reduce((s, r) => s + r.Distance, 0);

  const avgPaceSeconds =
    trainingRuns.reduce(
      (s, r) => s + paceToSeconds(r.AveragePace),
      0
    ) / (trainingRuns.length || 1);

  const avgHR =
    trainingRuns.reduce((s, r) => s + r.AvgHeartRate, 0) /
    (trainingRuns.length || 1);

  /* ------------------ UI ------------------ */
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            🏃 Ultra 50km Training
          </h1>
          <p className="text-slate-600">
            Dear Future Arnie, 
            2026 is going to be a big one. You will climb your first 14er, hike the Enchampments, and run your first ultramarathon. 
            Through all the hardwork and consistency ahead, I am really excited to see what the furure version of myself holds in June. 
          </p>
          <p className="text-slate-600">
            Welcome to my Ultra-marathon 50km dashbaord where I will be tracking all my runs before my big race day in June!
          </p>
        </div>
      </div>

      {/* Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Miles" value={totalMiles.toFixed(1)} />
        <Stat title="Avg Pace" value={secondsToPace(avgPaceSeconds)} />
        <Stat title="Avg HR" value={Math.round(avgHR)} />
        <Stat title="Runs" value={trainingRuns.length} />
      </section>

      {/* ---------------- Weekly Progression ---------------- */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Weekly Progression
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Miles */}
          <div>
            <h3 className="font-medium mb-3 text-slate-700">
              Miles per Week
            </h3>
            <div className="space-y-3">
              {trainingWeeks.map((week) => {
                const miles = weeklyStats[week].miles;
                // const width =
                //   maxWeekMiles > 0 ? (miles / maxWeekMiles) * 100 : 0;
                const width = Math.min((miles / WEEKLY_MILE_GOAL) * 100, 100);


                return (
                  <div key={week} className="space-y-1 p-2 rounded-lg">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{week}</span>
                      <span>{miles.toFixed(1)} mi</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time */}
          <div>
            <h3 className="font-medium mb-3 text-slate-700">
              Time per Week
            </h3>
            <div className="space-y-3">
              {trainingWeeks.map((week) => {
                const time = weeklyStats[week].time;
                // const width =
                //   maxWeekTime > 0 ? (time / maxWeekTime) * 100 : 0;
                const width = Math.min((time / WEEKLY_TIME_GOAL) * 100, 100);


                return (
                  <div key={week} className="space-y-1 p-2 rounded-lg">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{week}</span>
                      <span>{secondsToTime(time)}</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Run Log ---------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Runs</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trainingRuns.map((run, i) => (
            <RunCard key={i} run={run} />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ------------------ Components ------------------ */

function Stat({ title, value }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-1 text-slate-800">{value}</p>
    </div>
  );
}

function RunCard({ run }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2 hover:shadow-sm transition">
      <p className="font-semibold text-slate-800">{run.Date}</p>
      <p className="text-sm text-slate-600">
        {run.Distance} mi · {run.AveragePace}/mi
      </p>
      <p className="text-sm text-slate-700">
        {run.RunType} · {run.TerrainType}
      </p>
      <p className="text-xs text-slate-500">
        HR {run.AvgHeartRate} · Felt {run.Felt}/5
      </p>
    </div>
  );
}
