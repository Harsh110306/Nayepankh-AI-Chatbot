import React, { useState, useEffect } from "react";

function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    total_conversations: 0,
    total_users: 0,
    total_volunteers: 0,
    total_internships: 0,
    total_subscribers: 0,
    top_queries: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const cards = [
    {
      title: "Total Conversations",
      value: metrics.total_conversations,
      color: "border-brand-green",
      icon: (
        <svg className="w-6 h-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "Total Users",
      value: metrics.total_users,
      color: "border-teal-600",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Volunteer Registrations",
      value: metrics.total_volunteers,
      color: "border-brand-orange",
      icon: (
        <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Internship Applications",
      value: metrics.total_internships,
      color: "border-purple-600",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Email Subscribers",
      value: metrics.total_subscribers,
      color: "border-brand-orange",
      icon: (
        <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-grow space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Analytics Dashboard</h2>
          <p className="text-xs text-slate-500">Live operational metrics and user feedback queries.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 dark:bg-brand-darkCard dark:border-brand-darkBorder rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-slate-700 dark:text-slate-200 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
          </svg>
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-500">Loading metrics data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-brand-darkCard p-5 rounded-xl border-l-4 ${card.color} shadow-sm border border-slate-200 dark:border-brand-darkBorder flex items-center justify-between`}
              >
                <div>
                  <p className="text-xxs font-bold uppercase tracking-wider text-slate-400">{card.title}</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{card.value}</p>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-brand-darkBg rounded-lg">{card.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-brand-darkCard p-6 rounded-xl shadow-sm border border-slate-200 dark:border-brand-darkBorder">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">Top 10 Most Asked Questions</h3>
              {metrics.top_queries.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                  No conversational queries recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-brand-darkBorder text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Question Query</th>
                        <th className="py-2.5 px-3 text-right">Frequency Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.top_queries.map((q, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-brand-darkBorder/50 hover:bg-slate-50 dark:hover:bg-brand-darkBg/30">
                          <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{q.query}</td>
                          <td className="py-3 px-3 text-right font-bold text-brand-green">{q.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
