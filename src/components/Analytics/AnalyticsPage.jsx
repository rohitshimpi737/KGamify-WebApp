
const analyticsData = [
  { type: "Quick Hit", 
    title: "Design Therapy - VIIT", 
    category: "Design and Creativity", 
    status: "Ongoing", 
    start: "February 13 12:00 PM", 
    end: "June 30 12:00 PM", 
    score: -3.68333, 
    link: "/leaderboard", 
  }, 
  { type: "Play and Win", 
    title: "Flutter Frenzy", 
    category: "Computers and Technology", 
    status: "Ongoing", 
    start: "February 5 12:00 AM", 
    end: "June 30 12:00 PM", 
    score: 0, 
    reward: true, 
    link: "#", 
  }
];

const AnalyticsPage = () => (

  <div className="p-4">
    <h1 className="text-xl font-bold mb-4">Analytics</h1>
    <p className="mb-4">April 22, 2025</p>
    {analyticsData.map((item, idx) => (
      <Card key={idx} className="mb-4 border-orange-300 border">
        <CardContent className="p-4">
          <p className="text-red-500 font-medium mb-2">{item.type}</p>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
            <span className="text-green-600 border border-green-600 px-2 py-1 rounded-md text-sm">
              {item.status}
            </span>
          </div>
          <hr className="my-2" />
          <div className="text-sm text-gray-700 mb-2">
            <p>Started: {item.start}</p>
            <p>End: {item.end}</p>
          </div>
          <p className="text-sm mb-2">Score: {item.score}</p>
          {item.reward && (
            <img
              src="https://static-cdn.jtvnw.net/jtv_user_pictures/fazeclan-profile_image-9e6cf1831ab63b1e-300x300.png"
              alt="Reward"
              className="w-24 h-24 object-cover mb-2"
            />
          )}
          <Link to={item.link}>
            <Button className="w-full bg-orange-400 hover:bg-orange-500">View Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    ))}
  </div>
); 

export default AnalyticsPage