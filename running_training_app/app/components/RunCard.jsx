export default function RunCard({ date, distance, time, pace, notes }) {
    return (
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <h2 className="font-semibold">{date}</h2>
        <p>Distance: {distance} mi</p>
        <p>Time: {time}</p>
        <p>Pace: {pace}</p>
      </div>
    );
  }
  