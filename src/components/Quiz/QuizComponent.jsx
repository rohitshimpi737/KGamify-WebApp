// QuizComponent.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Challenges } from "../../data_sample/Challenges";
import { useTheme } from "../../contexts/ThemeContext"; // Import useTheme hook

export default function QuizComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { darkMode } = useTheme(); // Get dark mode state
  const [challenge, setChallenge] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);





/*This part is logic of calculating the results only */
const handleSubmit = () => {
  let score = 0;
  challenge.questions.forEach((q, idx) => {
    if (q.correctAnswer === userAnswers[idx]) score++;
  });

  navigate(`/app/results/${id}`, { state: { score, total: challenge.questions.length } });
};

const handleSelectOption = (option) => {
  setSelectedOption(option);
  const updatedAnswers = [...userAnswers];
  updatedAnswers[currentQuestionIndex] = option;
  setUserAnswers(updatedAnswers);
};




  // Find challenge by ID
  useEffect(() => {
    const foundChallenge = Challenges.find(c => c.id === id);
    if (foundChallenge) {
      setChallenge(foundChallenge);
      // Convert duration (e.g., "15 Minutes") to seconds
      const minutes = parseInt(foundChallenge.details.duration);
      setTimeRemaining(minutes * 60);
    } else {
      navigate('/app');
    }
  }, [id, navigate]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || !challenge) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, challenge]);

  // Start quiz on component mount
  useEffect(() => {
    setQuizStarted(true);
  }, []);

  const handleExitClick = () => setShowExitPopup(true);
  const handleClosePopup = () => setShowExitPopup(false);
  
  const handleConfirmExit = () => {
    navigate('/app');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < challenge.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      handleSubmit();
    }
  };


  if (!challenge) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}>
        Loading quiz...
      </div>
    );
  }

  const currentQuestion = challenge.questions[currentQuestionIndex];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const options = [
    ...currentQuestion.options.map((opt, idx) => 
      `${String.fromCharCode(65 + idx)}) ${opt}`
    ),
    "E) Report question as wrong"
  ];

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    }`}>
      <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              {challenge.title}
            </h2>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              Ad
            </span>
          </div>
          <button
            onClick={handleExitClick}
            className={`transition-colors ${
              darkMode ? "text-gray-300 hover:text-red-400" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Timer & Status */}
        <div className={`flex justify-between text-sm mb-2 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          <span>⏱ {formattedTime}</span>
          <span>🗨️ {currentQuestionIndex + 1}/{challenge.questions.length}</span>
          <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full">
            k 25
          </span>
        </div>

        {/* Question */}
        <p className={`font-medium mb-2 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}>
          Q {currentQuestionIndex + 1}) {currentQuestion.questionText}
        </p>

        {/* Options */}
        <div className="mb-4 flex-grow">
          <ul className="space-y-2">
            {options.map((option, index) => (
              <li
                key={index}
                className={`p-2 rounded cursor-pointer   ${index === options.length - 1 ? "font-semibold text-red-500" : ""}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>

        {/* Answer Buttons */}
       {/* Answer Buttons */}
<div className="grid grid-cols-5 gap-2 mb-4">
  {["A", "B", "C", "D", "E"].map((opt) => {
    const isSelected = selectedOption === opt;
    const isReportButton = opt === "E";
    
    return (
      <button
        key={opt}
        onClick={() => handleSelectOption(opt)}
        className={`py-2 rounded-md border font-medium transition-colors ${
          isSelected
            ? isReportButton
              ? "bg-red-500 text-white border-red-500"
              : darkMode
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-orange-500 text-white border-orange-500"
            : isReportButton
              ? darkMode
                ? "border-red-500 text-red-500 hover:bg-gray-800"
                : "border-red-500 text-red-500 hover:bg-red-50"
              : darkMode
                ? "border-orange-500 text-white hover:bg-gray-800"
                : "border-orange-300 text-gray-700 hover:bg-gray-100"
        }`}
      >
        {opt}
      </button>
    );
  })}
</div>

        {/* Next Question Button */}
        <button 
          onClick={handleNextQuestion}
          disabled={!selectedOption}
          className={`w-full py-2 font-medium rounded-md transition-colors bg-orange-500 hover:bg-orange-600 text-black mb-8 `}
        >
          {currentQuestionIndex === challenge.questions.length - 1 
            ? "Submit Quiz" 
            : "Next Question"}
        </button>

        {/* Exit Confirmation Popup */}
        {showExitPopup && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`p-6 rounded-lg shadow-md w-full max-w-sm text-center ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className={`text-lg font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                Are you sure you want to exit the quiz?
              </h3>
              <p className={`text-sm mb-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Your progress will not be saved.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmExit}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleClosePopup}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    darkMode 
                      ? "border-gray-600 hover:bg-gray-700 text-white" 
                      : "border-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}