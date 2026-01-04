"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import RunCard from "../components/RunCard";
import runsData from "../../data/madison.json";
import { useState } from "react";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MadisonPage() {

  function groupByWeek(runs) {
    const weeks = {};
  
    runs.forEach(run => {
      const date = new Date(run.Date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      weeks[weekKey] = (weeks[weekKey] || 0) + run.Distance;
    });
  
    return weeks;
  }
  
  function groupByMonth(runs) {
    const months = {};
  
    runs.forEach(run => {
      const date = new Date(run.Date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      months[monthKey] = (months[monthKey] || 0) + run.Distance;
    });
  
    return months;
  }
  
  
  
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
  const monthlyMiles = groupByMonth(runsData);

const chartData = {
  labels: Object.keys(monthlyMiles),
  datasets: [
    {
      label: "Miles per Month",
      data: Object.values(monthlyMiles),
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.3)",
      tension: 0.3,
      fill: true,
    },
  ],
};


  return (
    <main className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            🏃 Madison Marathon Training
          </h1>
          <p className="text-gray-600">
            From first mile to marathon day — a complete training breakdown.
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


      <section className="mb-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-3">🏁 Marathon Result</h2>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm opacity-80">Race Date</p>
            <p className="text-xl font-bold">{stats.marathonDate}</p>
          </div>

          <div>
            <p className="text-sm opacity-80">Finish Time</p>
            <p className="text-xl font-bold">{stats.marathonTime}</p>
          </div>
        </div>
      </section>


      <section className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-sm text-gray-500 mb-1">Total Miles</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalMiles}
            <span className="text-base font-medium ml-1">mi</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-sm text-gray-500 mb-1">Total Time</p>
          <p className="text-3xl font-bold">{stats.totalTime}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-sm text-gray-500 mb-1">Avg Pace</p>
          <p className="text-3xl font-bold">{stats.avgPace}</p>
        </div>
      </section>
      
      <section className="mb-12 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          📈 Monthly Distance
        </h2>
        <Line data={chartData} />
      </section>




      <section>
        <h2 className="text-2xl font-bold mb-6">📅 Training Runs</h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

    </main>
  );
}
