// src/pages/Analytics.jsx
export default function Analytics() {
  // Static leaderboard data
  const leaderboard = [
    { id: 1, user: 'Alice', score: 95, time: '4:30', date: '2024-03-20' },
    { id: 2, user: 'Bob', score: 88, time: '5:15', date: '2024-03-19' },
    { id: 3, user: 'Charlie', score: 88, time: '6:00', date: '2024-03-18' },
    { id: 4, user: 'Diana', score: 82, time: '4:45', date: '2024-03-17' },
    { id: 5, user: 'You', score: 80, time: '5:30', date: '2024-03-16' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Leaderboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="w-full">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="text-left p-4 dark:text-gray-300">Rank</th>
              <th className="text-left p-4 dark:text-gray-300">User</th>
              <th className="text-left p-4 dark:text-gray-300">Score</th>
              <th className="text-left p-4 dark:text-gray-300">Time</th>
              <th className="text-left p-4 dark:text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-4 dark:text-white">{index + 1}</td>
                <td className="p-4 dark:text-white">{entry.user}</td>
                <td className="p-4 dark:text-white">{entry.score}/100</td>
                <td className="p-4 dark:text-white">{entry.time}</td>
                <td className="p-4 dark:text-white">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}