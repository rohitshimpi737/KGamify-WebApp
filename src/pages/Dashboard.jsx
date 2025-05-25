import ChallengeCard from "../components/Cards/ChallengeCard";

const Dashboard = () => {
  return (
    <>
      {/* <div className="flex justify-center">
        <div className="bg-zinc-300 border border-zinc-700 w-1/2 text-center rounded-2xl h-full ">
          <h1 className="">Search</h1>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChallengeCard />
        <ChallengeCard />
        <ChallengeCard />
      </div>
    </>
  );
};

export default Dashboard;
