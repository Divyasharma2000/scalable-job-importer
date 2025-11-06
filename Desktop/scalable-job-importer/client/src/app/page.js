"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    fetch("http://localhost:3001/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // 5 सेकंड में ऑटो-रिफ्रेश
    return () => clearInterval(interval);
  }, []);

  const triggerImport = async () => {
    try {
      await fetch("http://localhost:3001/api/test-fetch");
      alert("New import started!");
      fetchHistory();
    } catch (error) {
      alert("Failed to start import");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {/* --- SIMPLE NAV --- */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Job Importer Dashboard</h1>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Import History
          </h2>
          <button
            onClick={triggerImport}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            Run New Import
          </button>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading && history.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50  sticky top-0 z-10 shadow-sm ">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source / Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-600 uppercase bg-green-50">
                    New
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-yellow-600 uppercase bg-yellow-50">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-red-600 uppercase bg-red-50">
                    Failed
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((log) => (
                  <tr key={log._id}>
                   <td className="px-6 py-4">
  {/* --- DYNAMIC NAME GENERATOR --- */}
  <div className="text-sm font-bold text-gray-900 capitalize">
    {(() => {
      try {
        const urlObj = new URL(log.fileName);
        let domainName = urlObj.hostname.replace('www.', '').split('.')[0];
        return domainName.charAt(0).toUpperCase() + domainName.slice(1) + " Feed";
      } catch (e) {
        return "Job Import Feed";
      }
    })()}
  </div>

  {/* --- ORIGINAL URL --- */}
  <div className="text-xs text-gray-400 truncate w-64 mt-1" title={log.fileName}>
    {log.fileName}
  </div>

  {/* --- DATE --- */}
  <div className="text-xs text-gray-500 mt-1">
    {new Date(log.importDateTime).toLocaleString()}
  </div>
</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-gray-500">
                      {log.totalFetched}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-green-600 bg-green-50">
                      +{log.newJobs || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-yellow-600 bg-yellow-50">
                      {log.updatedJobs || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-red-600 bg-red-50">
                      {log.failedJobs || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                     <span className={`inline-flex items-center justify-center w-36 h-8 px-2 text-xs font-bold leading-5 rounded-full
  ${log.status === 'Processing' ? 'bg-blue-100 text-blue-800 animate-pulse' : 
    log.failedJobs > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
  {log.status === 'Processing' ? 'Processing' : (log.failedJobs > 0 ? 'Error' : 'Success')}
</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="bg-gray-200 text-center p-4 text-gray-600 text-sm">
        © 2025 JobImporter Pro. Technical Assessment.
      </footer>
    </div>
  );
}
