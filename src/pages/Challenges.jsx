import Layout from "../components/layout/Layout";
import ChallengeCard from "../components/Cards/ChallengeCard";

const Challenges = () => {
  // Sample challenges data
  const challenges = [
    {
      id: "RKyP_2505",
      title: "Play and Win",
      categories: [
        { name: "Marketing Skills Challenge", color: "bg-[#f58220]" },
        { name: "Snqoing", color: "bg-purple-500" }
      ],
      participants: 17,
      questions: 10,
      duration: 15,
      eligibility: ["BBA", "MBA"],
      startDate: "February 18 12:00 PM",
      endDate: "May 31 12:00 PM"
    },
    {
      id: "MBzQ_3209",
      title: "Digital Mastery",
      categories: [
        { name: "E-commerce Challenge", color: "bg-blue-500" },
        { name: "SEO", color: "bg-green-500" }
      ],
      participants: 23,
      questions: 15,
      duration: 20,
      eligibility: ["MBA", "MCA"],
      startDate: "March 1 09:00 AM",
      endDate: "June 15 05:00 PM"
    },
    // Add more challenges as needed
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Active Challenges
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Challenges;