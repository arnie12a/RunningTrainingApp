import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Training Log</h1>

      <div className="flex gap-4">
        <Link
          href="/ultra"
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          50K Ultra
        </Link>

        <Link
          href="/madison"
          className="px-4 py-2 rounded-lg border"
        >
          Madison Marathon
        </Link>
      </div>
    </main>
  );
}
