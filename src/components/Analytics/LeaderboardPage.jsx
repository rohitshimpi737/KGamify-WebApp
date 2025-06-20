const leaderboardData = {
  leaderboard: [
    { name: "Sanved", points: 4.467, time: "1:07" },
    { name: "Vedant", points: 3.067, time: "0:56" },
    { name: "Sarvesh", points: 1.690, time: "2:12" },
    { name: "Shraddha", points: 1.617, time: "1:50" },
    { name: "Navneet", points: 1.450, time: "0:50" },
    { name: "Disha", points: 1.417, time: "1:11" },
  ],
  report: [
    { q: "Q1", total: -0.867, bonus: -1.87, points: 1, time: "2sec", expected: "1sec" },
    { q: "Q2", total: -0.933, bonus: -1.93, points: 1, time: "1sec", expected: "1sec" },
    { q: "Q3", total: -0.950, bonus: -1.95, points: 1, time: "1sec", expected: "2sec" },
    { q: "Q4", total: -0.933, bonus: -1.93, points: 1, time: "1sec", expected: "1sec" },
  ],
};


const LeaderboardPage = () => {
  const totalPoints = leaderboardData.report.reduce((sum, r) => sum + r.total, 0).toFixed(3); const totalBonus = leaderboardData.report.reduce((sum, r) => sum + r.bonus, 0).toFixed(3); const totalScore = leaderboardData.report.reduce((sum, r) => sum + r.points, 0); const totalTime = "5sec";

  return (<div className="p-4"> <h1 className="text-xl font-bold">Design and Creativity</h1> <p className="text-sm text-gray-600">Design Therapy - VIIT</p> <p className="text-sm mb-4">Started: February Thu 13 12:00 PM</p>

    <h2 className="text-lg font-semibold mb-2">Leaderboard</h2>
    <table className="w-full text-sm mb-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="text-left px-2 py-1">Rank</th>
          <th className="text-left px-2 py-1">Name</th>
          <th className="text-left px-2 py-1">Points</th>
          <th className="text-left px-2 py-1">Time</th>
        </tr>
      </thead>
      <tbody>
        {leaderboardData.leaderboard.map((item, idx) => (
          <tr key={idx} className="border-t">
            <td className="px-2 py-1">{idx + 1}st</td>
            <td className="px-2 py-1">{item.name}</td>
            <td className="px-2 py-1">{item.points}</td>
            <td className="px-2 py-1">{item.time}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2 className="text-lg font-semibold mb-2">Report Card</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-2 py-1">Q.No</th>
          <th className="px-2 py-1">Total Points</th>
          <th className="px-2 py-1">Bonus/Penalty</th>
          <th className="px-2 py-1">Points</th>
          <th className="px-2 py-1">Actual Time</th>
          <th className="px-2 py-1">Expected Time</th> 
        </tr>
      </thead>
      <tbody>
        {leaderboardData.report.map((r, idx) => (
          <tr key={idx} className="border-t">
            <td className="px-2 py-1">{r.q}</td>
            <td className="px-2 py-1">{r.total}</td>
            <td className="px-2 py-1">{r.bonus}</td>
            <td className="px-2 py-1">{r.points}</td>
            <td className="px-2 py-1">{r.time}</td>
            <td className="px-2 py-1">{r.expected}</td> 
          </tr>
        ))}
        <tr className="font-semibold border-t">
          <td className="px-2 py-1">Total</td>
          <td className="px-2 py-1">{totalPoints}</td>
          <td className="px-2 py-1">{totalBonus}</td>
          <td className="px-2 py-1">{totalScore}</td>
          <td className="px-2 py-1">{totalTime}</td>
          <td className="px-2 py-1">—</td>
        </tr>
      </tbody>
    </table>

  </div>

  );
};

export default LeaderboardPage