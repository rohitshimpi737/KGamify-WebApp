// LeaderboardPage.jsx
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const LeaderboardPage = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const leaderboards = {
    1: {
      title: "Sales and Marketing",
      subtitle: "Marketing Skills Challenge",
      start: "February Tue 18 12:00 PM",
      leaderboard: [
        { name: "Vinit", points: 87.172, time: "1:59" },
        { name: "Kiran", points: 86.769, time: "5:53" },
        { name: "Latika", points: 86.756, time: "2:40" },
        { name: "Abhishek", points: 65.286, time: "2:36" },
        { name: "Samrudhi", points: 28.106, time: "2:25" },
        { name: "Amodini", points: 26.336, time: "1:07" },
        { name: "Diwate", points: 17.394, time: "0:33" },
        { name: "Stimit", points: 11.489, time: "0:32" },
        { name: "Vedant", points: 4.831, time: "0:15" },
      ],
      report: [
        { q: "Q1", total: -5.0, bonus: -10.0, points: 5, time: "0sec", expected: "120sec" },
        { q: "Q2", total: -6.806, bonus: -13.81, points: 7, time: "5sec", expected: "180sec" },
        { q: "Q3", total: -6.961, bonus: -13.96, points: 7, time: "1sec", expected: "180sec" },
        { q: "Q4", total: 14.0, bonus: 7.0, points: 7, time: "0sec", expected: "180sec" },
        { q: "Q5", total: -5.0, bonus: -10.0, points: 5, time: "0sec", expected: "120sec" },
        { q: "Q6", total: -6.961, bonus: -13.96, points: 7, time: "1sec", expected: "180sec" },
        { q: "Q7", total: -5.0, bonus: -10.0, points: 5, time: "0sec", expected: "180sec" },
        { q: "Q8", total: -7.0, bonus: -14.0, points: 7, time: "0sec", expected: "180sec" },
        { q: "Q9", total: -7.0, bonus: -14.0, points: 7, time: "0sec", expected: "180sec" },
        { q: "Q10", total: -10.0, bonus: -20.0, points: 10, time: "0sec", expected: "240sec" },
      ]
    }
  };

  const data = leaderboards[id] || leaderboards[1];
  const { leaderboard, report } = data;

  const totalPoints = report.reduce((sum, r) => sum + r.total, 0).toFixed(3);
  const totalBonus = report.reduce((sum, r) => sum + r.bonus, 0).toFixed(3);
  const totalScore = report.reduce((sum, r) => sum + r.points, 0);
  const totalTime = report.reduce((sum, r) => sum + parseInt(r.time), 0) + " sec";

  return (
    <div className={`p-4 min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
        {/* Header with back button and title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/app/analytics" 
            className={`p-2 rounded-full ${
              darkMode ? "bg-zinc-800 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </Link>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Leaderboard</h2>
        <div className="divide-y">
          {leaderboard.map((entry, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 text-sm">
              <div className="flex gap-2 items-center">
                <span className="font-bold text-orange-500">{idx + 1}{["st", "nd", "rd"][idx] || "th"}</span>
                <span>{entry.name}</span>
              </div>
              <div className="flex gap-6">
                <span>Score: {entry.points.toFixed(3)}</span>
                <span>{entry.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Card Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Report Card</h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Q.No</th>
                <th className="p-2 text-left">Total Points</th>
                <th className="p-2 text-left">Bonus/Penalty</th>
                <th className="p-2 text-left">Points</th>
                <th className="p-2 text-left">Actual Time</th>
                <th className="p-2 text-left">Expected Time</th>
              </tr>
            </thead>
            <tbody>
              {report.map((q, idx) => (
                <tr key={idx} className="border-t dark:border-gray-700">
                  <td className="p-2">{q.q}</td>
                  <td className="p-2">{q.total}</td>
                  <td className="p-2">{q.bonus}</td>
                  <td className="p-2">{q.points}</td>
                  <td className="p-2">{q.time}</td>
                  <td className="p-2">{q.expected}</td>
                </tr>
              ))}
              <tr className="font-semibold border-t dark:border-gray-600">
                <td className="p-2">Total</td>
                <td className="p-2">{totalPoints}</td>
                <td className="p-2">{totalBonus}</td>
                <td className="p-2">{totalScore}</td>
                <td className="p-2">{totalTime}</td>
                <td className="p-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-sm">
        <h3 className="font-semibold mb-1">Reward you can win</h3>
        <p>Internship at <strong>My Travel</strong></p>
        <p>Join the Marketing Skills Challenge and showcase your skills. Your performance determines your stipend!</p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
