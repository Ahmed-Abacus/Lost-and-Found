import Link from 'next/link'; 
export default function Home() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Lost and Found Website</h2>
      <p className="mb-6">Help us reunite lost items with their owners!</p>
      <div className="flex justify-center gap-4">
        <Link href="/report-lost">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Report a Lost Item
          </button>
        </Link>
        <Link href="/register-found">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
            Register a Found Item
          </button>
        </Link>
      </div>
    </div>
  );
}