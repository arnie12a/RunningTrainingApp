"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import runs from "../../data/run_data.json";
import hikes from "../../data/hike_data.json";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ActivityPage() {
  /* ------------------ Helpers ------------------ */
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

  /* ------------------ Metrics ------------------ */
  // Runs
  const totalRunMiles = runs.reduce((sum, run) => sum + run.Distance, 0);
  const totalRunTime = runs.reduce((sum, run) => sum + timeToSeconds(run.Time), 0);
  const totalRunCalories = runs.reduce((sum, run) => sum + run.Calories, 0);

  // Hikes
  const totalHikeMiles = hikes.reduce((sum, hike) => sum + hike.Distance, 0);
  const totalHikeTime = hikes.reduce((sum, hike) => sum + timeToSeconds(hike.Time), 0);
  const totalHikeCalories = hikes.reduce((sum, hike) => sum + parseInt(hike.Calories, 10), 0);

  /* ------------------ Chart Data ------------------ */
  const runsByDate = runs.reduce((acc, run) => {
    const date = new Date(run.Date);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + run.Distance;
    return acc;
  }, {});

  const chartLabels = Object.keys(runsByDate).sort();
  const chartData = chartLabels.map((label) => runsByDate[label]);

  const runChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Miles Run",
        data: chartData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const runChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Miles Run Over Time (Aggregated by Month)",
      },
    },
  };

  /* ------------------ UI ------------------ */
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            🏃 Runs & 🥾 Hikes Dashboard
          </h1>
          <p className="text-slate-600">
            Here is a dashbaord from all my recent hikes and runs tracked using my Garmin Forerunner 155.
          </p>
        </div>
      </div>

      {/* Runs Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">🏃 Running Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat title="Total Run Miles" value={totalRunMiles.toFixed(2)} />
          <Stat title="Total Run Time" value={secondsToTime(totalRunTime)} />
          <Stat title="Total Run Calories" value={totalRunCalories} />
          <Stat title="Total Runs" value={runs.length} />
        </div>
      </section>

      {/* Run Chart */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">📊 Run Visualization</h2>
        <Bar data={runChartData} options={runChartOptions} />
      </section>

      {/* Hikes Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">🥾 Hiking Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat title="Total Hike Miles" value={totalHikeMiles.toFixed(2)} />
          <Stat title="Total Hike Time" value={secondsToTime(totalHikeTime)} />
          <Stat title="Total Hike Calories" value={totalHikeCalories} />
          <Stat title="Total Hikes" value={hikes.length} />
        </div>
      </section>

      {/* Hike Photos */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">📷 Favorite Hike Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hikes.map((hike, i) => (
            <HikeCard key={i} hike={hike} />
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

function HikeCard({ hike }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2 hover:shadow-sm transition">
      <p className="font-semibold text-slate-800">{hike.Title}</p>
      <p className="text-sm text-slate-600">{hike.Date}</p>
      <img
        src={`/images/${hike.Title.replace(/\s+/g, "-").toLowerCase()}.jpg`}
        alt={hike.Title}
        className="w-full h-40 object-cover rounded-lg"
      />
    </div>
  );
}