"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import RunCard from "../components/RunCard";
import runsData from "../../data/madison.json";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MadisonPage() {
  // Calculate stats
  const stats = useMemo(() => {
    const totalMiles = runsData.reduce((acc, run) => acc + run.Distance, 0);

    const totalSeconds = runsData.reduce((acc, run) => {
      const [h, m, s] = run.Time.split(":").map(Number);
      return acc + h * 3600 + m * 60 + s;
    }, 0);

    const avgPace = totalSeconds / totalMiles; // seconds per mile

    const avgMinutes = Math.floor(avgPace / 60);
    const avgSeconds = Math.round(avgPace % 60);

    // Marathon date and time
    const marathon = runsData[runsData.length - 1]; // assuming last run is marathon
    const marathonDate = marathon.Date;
    const marathonTime = marathon.Time;

    return {
      totalMiles: totalMiles.toFixed(2),
      totalTime: `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m`,
      avgPace: `${avgMinutes}:${avgSeconds < 10 ? "0" : ""}${avgSeconds} min/mi`,
      marathonDate,
      marathonTime
    };
  }, []);

  // Chart data
  const chartData = useMemo(() => {
    return {
      labels: runsData.map(run => run.Date),
      datasets: [
        {
          label: "Distance (mi)",
          data: runsData.map(run => run.Distance),
          borderColor: "rgba(34,197,94,1)",
          backgroundColor: "rgba(34,197,94,0.3)",
          tension: 0.3,
        },
      ],
    };
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">🏃 Madison Marathon Training</h1>

      <section className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Marathon Result</h2>
        <p>Date: {stats.marathonDate}</p>
        <p>Time: {stats.marathonTime}</p>
      </section>

      <section className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Training Summary</h2>
        <p>Total Miles: {stats.totalMiles} mi</p>
        <p>Total Time: {stats.totalTime}</p>
        <p>Average Pace: {stats.avgPace}</p>
      </section>

      <section className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Distance Over Time</h2>
        <Line data={chartData} />
      </section>

      <section className="space-y-4">
        {runsData.map((run, idx) => (
          <RunCard
            key={idx}
            date={run.Date}
            distance={run.Distance}
            time={run.Time}
            pace={run.AveragePace}
            notes={run.Notes}
          />
        ))}
      </section>
    </main>
  );
}
