import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
          Travel Itinerary Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Plan your perfect trip in minutes
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center max-w-2xl mx-auto w-full">
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Duration (days)
              </label>
              <input
                type="number"
                id="duration"
                min="1"
                max="30"
                placeholder="e.g., 5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Generate Itinerary
            </button>
          </form>
        </div>

        {/* Result section - Initially hidden, show when results are available */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hidden">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Your Itinerary
          </h2>
          {/* Itinerary results will be displayed here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600 dark:text-gray-400">
        <p>© 2024 Travel Itinerary Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
