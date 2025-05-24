import ChallengeCard from "../components/Cards/ChallengeCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ChallengeCard />
      <ChallengeCard />
      <ChallengeCard />
      <ChallengeCard />
      <ChallengeCard />
      
    </div>
  );
};

export default Dashboard;