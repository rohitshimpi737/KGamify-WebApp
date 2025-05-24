// eslint-disable-next-line no-unused-vars
const ChallengeCard = ({ challenge }) => {
  
  return (
    <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Play and Win</h2>
        <p className="text-sm text-gray-500">ID: RKyP_2505</p>
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-[#f58220] text-white rounded-full text-sm">
          Marketing Skills Challenge
        </span>
        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
          ongoing
        </span>
      </div>

      {/* Details Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Sales and Marketing</span>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">17 participants</span>
            <svg
              className="w-4 h-4 ml-1 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span>10 Questions</span>
            <span className="mx-2">•</span>
            <span>15 Minutes</span>
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-600">Eligibility:</span>
        <div className="mt-1 flex gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
            BBA
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
            MBA
          </span>
        </div>
      </div>

      {/* Date Section */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 font-medium">Starts:</p>
          <p className="text-gray-700">February 18 12:00 PM</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Ends:</p>
          <p className="text-gray-700">May 31 12:00 PM</p>
        </div>
      </div>
    </div>
  );
}


export default ChallengeCard;
