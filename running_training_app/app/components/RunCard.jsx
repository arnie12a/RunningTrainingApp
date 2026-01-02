export default function RunCard({ date, distance, time, pace, notes }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{date}</h3>
        <span className="text-sm text-green-600 font-medium">
          {distance} mi
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>⏱ {time}</p>
        <p>⚡ {pace} / mi</p>
      </div>
    </div>
  );
}
