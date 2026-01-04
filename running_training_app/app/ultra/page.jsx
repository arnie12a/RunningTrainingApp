import runs from "../../data/ultra50km.json";

export default function UltraPage() {
  /* ------------------ Constants ------------------ */
  const TRAINING_START = new Date("2026-01-05"); // Monday
  const RACE_DATE = new Date("2026-06-13"); // update if needed
  const WEEKLY_GOAL_MIN = 45;
  const WEEKLY_GOAL_MAX = 55;

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

  // Monday-based week key
  const getWeekKey = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay(); // 0 = Sun, 1 = Mon
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    return monday.toISOString().slice(0, 10);
  };

  const generateWeeks = (start, end) => {
    const weeks = [];
    const current = new Date(start);

    while (current <= end) {
      weeks.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 7);
    }
    return weeks;
  };

  /* ------------------ Filter Runs ------------------ */
  const trainingRuns = runs.filter((r) => {
    const d = new Date(r.Date);
    return d >= TRAINING_START && d <= RACE_DATE;
  });

  /* ------------------ Weekly Mileage ------------------ */
  const trainingWeeks = generateWeeks(TRAINING_START, RACE_DATE);

  const weeklyMileage = {};
  trainingWeeks.forEach((week) => {
    weeklyMileage[week] = 0;
  });

  trainingRuns.forEach((run) => {
    const week = getWeekKey(run.Date);
    if (weeklyMileage[week] !== undefined) {
      weeklyMileage[week] += run.Distance;
    }
  });

  const latestWeek = trainingWeeks[trainingWeeks.length - 1];
  const latestWeekMiles = weeklyMileage[latestWeek] || 0;

  /* ------------------ Metrics ------------------ */
  const totalMiles = trainingRuns.reduce(
    (sum, r) => sum + r.Distance,
    0
  );

  const avgPaceSeconds =
    trainingRuns.reduce(
      (sum, r) => sum + paceToSeconds(r.AveragePace),
      0
    ) / (trainingRuns.length || 1);

  const avgHR =
    trainingRuns.reduce((sum, r) => sum + r.AvgHeartRate, 0) /
    (trainingRuns.length || 1);

  /* ------------------ UI ------------------ */
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
          🏃 Ultra 50km Training
          </h1>
          <p className="text-gray-600">
            Monday → Sunday weeks · Jan 5 → Race Day
          </p>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium
                    text-gray-700 border border-gray-300 rounded-lg
                    px-4 py-2 hover:bg-gray-100 hover:text-gray-900
                    transition-colors"
        >
          ← Back
        </a>
        </div>


      {/* Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Miles" value={totalMiles.toFixed(1)} />
        <Stat title="Avg Pace" value={secondsToPace(avgPaceSeconds)} />
        <Stat title="Avg HR" value={Math.round(avgHR)} />
        <Stat title="Runs" value={trainingRuns.length} />
      </section>

      {/* Weekly Volume Progress */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Latest Week Volume</h2>

        <div className="flex justify-between text-sm text-gray-600">
          <span>{latestWeekMiles.toFixed(1)} miles</span>
          <span>
            Goal: {WEEKLY_GOAL_MIN}–{WEEKLY_GOAL_MAX}
          </span>
        </div>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{
              width: `${Math.min(
                (latestWeekMiles / WEEKLY_GOAL_MAX) * 100,
                100
              )}%`
            }}
          />
        </div>
      </section>

      {/* Weekly Breakdown */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Weekly Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {trainingWeeks.map((week) => {
            const miles = weeklyMileage[week];
            const inGoal =
              miles >= WEEKLY_GOAL_MIN && miles <= WEEKLY_GOAL_MAX;

            return (
              <div
                key={week}
                className={`flex justify-between p-3 rounded-lg border ${
                  inGoal
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-gray-50"
                }`}
              >
                <span>Week of {week}</span>
                <span className="font-semibold">
                  {miles.toFixed(1)} mi
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Run Log */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Runs</h2>

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
    <div className="border rounded-xl p-4 bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function RunCard({ run }) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-2">
      <p className="font-semibold">{run.Date}</p>
      <p className="text-sm text-gray-600">
        {run.Distance} mi · {run.AveragePace}/mi
      </p>
      <p className="text-sm">
        {run.RunType} · {run.TerrainType}
      </p>
      <p className="text-xs text-gray-500">
        HR {run.AvgHeartRate} · Felt {run.Felt}/5
      </p>
    </div>
  );
}
