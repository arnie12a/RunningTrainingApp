import runs from "@/data/ultra50km.json";

export default function UltraPage() {
  /* ------------------ helpers ------------------ */
  const paceToSeconds = (pace) => {
    const [min, sec] = pace.split(":").map(Number);
    return min * 60 + sec;
  };

  const secondsToPace = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const getWeekKey = (dateStr) => {
    const d = new Date(dateStr);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return start.toISOString().slice(0, 10);
  };

  /* ------------------ metrics ------------------ */
  const totalMiles = runs.reduce((sum, r) => sum + r.Distance, 0);

  const avgPaceSeconds =
    runs.reduce((sum, r) => sum + paceToSeconds(r.AveragePace), 0) /
    runs.length;

  const avgHR =
    runs.reduce((sum, r) => sum + r.AvgHeartRate, 0) / runs.length;

  const weeklyMileage = {};
  runs.forEach((run) => {
    const week = getWeekKey(run.Date);
    weeklyMileage[week] = (weeklyMileage[week] || 0) + run.Distance;
  });

  const latestWeekMiles =
    Object.values(weeklyMileage).slice(-1)[0] || 0;

  const WEEKLY_GOAL_MIN = 45;
  const WEEKLY_GOAL_MAX = 55;

  /* ------------------ UI ------------------ */
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          🏃 Ultra 50km Training
        </h1>
        <p className="text-gray-600 mt-2">
          Progressive overload · Weekly volume · Long-term durability
        </p>
      </div>

      {/* Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Miles" value={totalMiles.toFixed(1)} />
        <Stat title="Avg Pace" value={secondsToPace(avgPaceSeconds)} />
        <Stat title="Avg HR" value={Math.round(avgHR)} />
        <Stat title="Runs" value={runs.length} />
      </section>

      {/* Weekly Volume */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Weekly Volume</h2>

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

      {/* Run Log */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Runs</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {runs.map((run, i) => (
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
