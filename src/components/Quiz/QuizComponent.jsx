/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CircularProgress = ({ percentage }) => {
  const radius = 40; // Smaller for mobile
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="relative w-28 h-28"> {/* Smaller container */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="none"
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className="text-orange-500"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          cx="50"
          cy="50"
          r={radius}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold"> {/* Smaller text */}
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const QuizComponent = ({ challenge, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(challenge.details.duration * 60 || 900);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateScore = () => {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === challenge.questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      setShowError(true);
      return;
    }

    setUserAnswers([...userAnswers, selectedOption]);

    if (currentQuestion < challenge.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setShowError(false);
    } else {
      setScore(calculateScore());
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setShowResults(false);
    setTimeLeft(challenge.details.duration * 60 || 900);
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    setShowError(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-orange-400 p-4 text-white flex justify-between items-center">
            <h2 className="text-lg font-bold">{challenge.subtitle}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-orange-500"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-5">
            {showResults ? (
              <div className="text-center space-y-6">
                <h2 className="text-xl font-bold">Quiz Results</h2>
                <div className="flex justify-center">
                  <CircularProgress
                    percentage={(score / challenge.questions.length) * 100}
                  />
                </div>
                <p className="text-lg">
                  You scored {score} out of {challenge.questions.length}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    Restart
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Quiz Info */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2 text-orange-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                  <span className="text-gray-500">
                    Q{currentQuestion + 1}/{challenge.questions.length}
                  </span>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {challenge.questions[currentQuestion].questionText}
                  </h3>
                  <div className="space-y-3">
                    {challenge.questions[currentQuestion].options.map(
                      (option, index) => (
                        <button
                          key={index}
                          className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                            selectedOption === index
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-orange-200"
                          }`}
                          onClick={() => handleOptionSelect(index)}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span> {option}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {showError && (
                  <div className="text-red-500 text-center mb-4">
                    Please select an answer
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 font-medium"
                >
                  {currentQuestion === challenge.questions.length - 1
                    ? "Submit Quiz"
                    : "Next Question"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;