/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Analytics from "../Analytics/Analytics";

const CircularProgress = ({ percentage }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 140 140">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="none"
          cx="70"
          cy="70"
          r={radius}
        />
        <circle
          className="text-orange-500"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          cx="70"
          cy="70"
          r={radius}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const QuizComponent = ({ challenge, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const [viewAnalytics, setViewAnalytics] = useState(false);

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
    setTimeLeft(900);
  };

  const handleClose = () => navigate(-1);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    setShowError(false);
  };

  const handleViewAnalytics = ()=>{
    
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl p-6">
        {showResults ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Quiz Results</h2>
            <div className="flex justify-center mb-6">
              <CircularProgress
                percentage={(score / challenge.questions.length) * 100}
              />
            </div>
            <p className="text-xl mb-4">
              {score} out of {challenge.questions.length} correct
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
              >
                Restart Quiz
              </button>


              {/* View Analytics button  */}

               <button className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
                onClick={()=> setViewAnalytics(true)}
              >
                View Analytics
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>

             


            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{challenge.subtitle}</h2>
              <button
                onClick={handleClose}
                className="p-2  cursor-pointer hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
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

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-orange-500">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              <span className="text-gray-500">
                {currentQuestion + 1}/{challenge.questions.length} Questions
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg  font-semibold mb-4">
                {challenge.questions[currentQuestion].questionText}
              </h3>
              <div className="grid gap-3 ">
                {challenge.questions[currentQuestion].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`p-3 cursor-pointer text-left rounded-lg border ${
                        selectedOption === index
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  )
                )}
              </div>
            </div>

            {showError && (
              <div className="text-red-500 text-sm mb-4 text-center">
                Please select an option before proceeding
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 cursor-pointer bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
              >
                {currentQuestion === challenge.questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          </>
        )}
      </div>
      

    </div>
  );
};

export default QuizComponent;