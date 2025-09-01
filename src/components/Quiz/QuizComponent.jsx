// QuizComponent.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../services/api";
import { extractUserId, parseUserPlayResponse } from "../../utils/challengeUtils";
import KgamifyAdCarousel from '../ui/Advertisement';

export default function QuizComponent() {

  // ========================================
  // HOOKS & ROUTER
  // ========================================
  const navigate = useNavigate();
  const { id } = useParams();
  const { darkMode } = useTheme();
  const { user } = useAuth();

  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Quiz Core State
  const [challenge, setChallenge] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Current Question State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);

  // UI State
  const [showExitPopup, setShowExitPopup] = useState(false);

  // ========================================
  // INITIALIZATION LOGIC
  // ========================================

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get championship details to find mode_id
        const detailResult = await API.challenge.getChampionshipDetails(id);

        if (!detailResult.success || !detailResult.championship?.length) {
          throw new Error('Championship not found');
        }

        const championshipData = detailResult.championship[0];

        // Check championship and category status before proceeding
        const champStatus = championshipData.champ_status?.toString();
        const categoryStatus = championshipData.category_status?.toString();

        if (champStatus !== "1") {
          throw new Error('Championship is not active. Please try again later.');
        }

        if (categoryStatus !== "1") {
          throw new Error('Category is not active. Please try again later.');
        }

        // Check if user has already played this championship
        const currentUserId = extractUserId(user);

        if (currentUserId) {
          const playStatusResult = await API.challenge.checkUserPlayed(currentUserId, id);

          if (playStatusResult.success && playStatusResult.hasPlayed) {
            // Use centralized parsing logic
            const userHasPlayed = parseUserPlayResponse(playStatusResult.hasPlayed);

            if (userHasPlayed) {
              // Navigate to analytics page instead of allowing quiz
              navigate(`/app/analytics/${id}`, {
                state: {
                  message: 'You have already completed this championship. View your results below.',
                  championshipData: championshipData,
                  userId: currentUserId
                }
              });
              return; // Exit early, don't continue with quiz initialization
            }
          }
        }

        // Fetch questions using mode_id
        const questionsResult = await API.quiz.getQuestions(championshipData.mode_id);

        if (!questionsResult.success || !questionsResult.questions?.length) {
          throw new Error('No questions found');
        }

        // Get all available questions
        const allQuestions = questionsResult.questions;

        // Determine how many questions to select
        const totalQuestionsToPlay = parseInt(championshipData.no_of_question) || 10;
        const totalAvailableQuestions = allQuestions.length;

        // Randomly select questions from the pool
        let selectedQuestions;
        if (totalAvailableQuestions <= totalQuestionsToPlay) {
          selectedQuestions = [...allQuestions];
        } else {
          const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
          selectedQuestions = shuffledQuestions.slice(0, totalQuestionsToPlay);
        }

        // Set up quiz data
        setQuestions(selectedQuestions);
        setChallenge({
          id: id,
          title: championshipData.champ_name,
          modeId: championshipData.mode_id,
          championshipData: championshipData
        });

        // Initialize answer tracking based on selected questions
        setUserAnswers(new Array(selectedQuestions.length).fill(null));
        setQuestionTimes(new Array(selectedQuestions.length).fill(0));

        // Set timer (convert time_minutes to seconds)
        const timeStr = championshipData.time_minutes || "00:15:00";
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const totalSeconds = (hours * 3600) + (minutes * 60) + (seconds || 0);
        setTimeRemaining(totalSeconds);

        // Start timing first question
        setQuestionStartTime(Date.now());

      } catch (err) {
        setError(err.message || 'Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [id]);

  // ========================================
  // TIMER MANAGEMENT
  // ========================================

  useEffect(() => {
    if (loading || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeRemaining]);

  // ========================================
  // SCORING ENGINE
  // ========================================

  const calculateScoreForQuestion = (question, userAnswer, timeTaken) => {
    const expectedTimeStr = question.expected_time || "00:03:00";
    const [hours, minutes, seconds] = expectedTimeStr.split(':').map(Number);
    const expectedTimeSeconds = (hours * 3600) + (minutes * 60) + (seconds || 0);

    const coinPerQuestion = parseInt(question.total_coins || 5);
    const negativeMarks = coinPerQuestion;

    // Handle wrong question reports
    if (userAnswer === 'E') {
      return {
        score: 0,
        isCorrect: false,
        bonus: 0,
        penalty: 0,
        basePoints: coinPerQuestion,
        timeTaken,
        expectedTime: expectedTimeSeconds,
        correctAnswer: question.correct_answer,
        userAnswer: userAnswer
      };
    }

    // Answer matching logic
    let isCorrect = false;
    const correctAnswer = question.correct_answer?.toString().toLowerCase().trim();

    if (correctAnswer && userAnswer) {
      // Standard mapping A=1, B=2, C=3, D=4
      const userAnswerToNumber = {
        'A': '1',
        'B': '2',
        'C': '3',
        'D': '4'
      };

      const userAnswerMapped = userAnswerToNumber[userAnswer];

      if (userAnswerMapped === correctAnswer) {
        isCorrect = true;
      }

      // Alternative mappings if needed
      if (!isCorrect) {
        const correctAnswerLetter = {
          '1': 'A', '2': 'B', '3': 'C', '4': 'D',
          'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'
        };

        if (correctAnswerLetter[correctAnswer] === userAnswer) {
          isCorrect = true;
        }
      }

      // Special answer formats
      if (!isCorrect) {
        const specialAnswerMap = {
          'e': 'A', 'p': 'B', 'w': 'B', 'n': 'C', '0': 'B',
          'k': 'C', 's': 'D', 'y': 'A', 'd': 'D',
        };

        if (specialAnswerMap[correctAnswer] === userAnswer) {
          isCorrect = true;
        }
      }

      // Direct comparison as last resort
      if (!isCorrect && userAnswer?.toLowerCase() === correctAnswer) {
        isCorrect = true;
      }
    }

    let score = 0;
    let bonus = 0;
    let penalty = 0;

    if (isCorrect) {
      // Case A: Correct Answer
      if (timeTaken < expectedTimeSeconds) {
        // Formula: Score = C + (1 - Ta/Te) × C
        score = coinPerQuestion + ((1 - (timeTaken / expectedTimeSeconds)) * coinPerQuestion);
        bonus = (1 - (timeTaken / expectedTimeSeconds)) * coinPerQuestion;
      } else {
        // Formula: Score = C - (Ta/Te - 1) × C
        score = coinPerQuestion - (((timeTaken / expectedTimeSeconds) - 1) * coinPerQuestion);
        penalty = ((timeTaken / expectedTimeSeconds) - 1) * coinPerQuestion;
      }
    } else {
      // Case B: Wrong Answer
      if (timeTaken < expectedTimeSeconds) {
        // Formula: Score = -(C + (1 - Ta/Te) × C + N)
        score = -(coinPerQuestion + ((1 - (timeTaken / expectedTimeSeconds)) * coinPerQuestion) + negativeMarks);
        penalty = coinPerQuestion + ((1 - (timeTaken / expectedTimeSeconds)) * coinPerQuestion) + negativeMarks;
      } else {
        // Formula: Score = -C
        score = -coinPerQuestion;
        penalty = coinPerQuestion;
      }
    }

    return {
      score: Math.round(score * 100) / 100,
      isCorrect,
      bonus: Math.round(bonus * 100) / 100,
      penalty: Math.round(penalty * 100) / 100,
      basePoints: coinPerQuestion,
      timeTaken,
      expectedTime: expectedTimeSeconds,
      correctAnswer: question.correct_answer,
      userAnswer: userAnswer
    };
  };


  const calculateEarlyExitPenalty = (answeredQuestions, totalQuestions) => {
    if (answeredQuestions >= totalQuestions) return 0;

    // Formula: Penalty = -∑(Ci) for remaining questions
    let penalty = 0;
    for (let i = answeredQuestions; i < totalQuestions; i++) {
      if (questions[i]) {
        penalty += parseInt(questions[i].total_coins || 5);
      }
    }
    return penalty;
  };


  // ========================================
  // USER INTERACTION HANDLERS
  // ========================================

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    // Record time spent on current question
    if (questionStartTime) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      const updatedTimes = [...questionTimes];
      updatedTimes[currentQuestionIndex] = timeSpent;
      setQuestionTimes(updatedTimes);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuestionStartTime(Date.now());
    } else {
      handleSubmitQuiz();
    }
  };

  // Exit handlers
  const handleExitClick = () => setShowExitPopup(true);
  const handleClosePopup = () => setShowExitPopup(false);
  const handleConfirmExit = () => navigate('/app');

  // ========================================
  // QUIZ SUBMISSION & RESULT PROCESSING
  // ========================================


  const handleSubmitQuiz = async () => {
    // Better user ID extraction using centralized utility
    const userId = extractUserId(user);
    const userObject = user?.userData || user;

    // Record final question time
    if (questionStartTime) {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      const updatedTimes = [...questionTimes];
      updatedTimes[currentQuestionIndex] = timeSpent;
      setQuestionTimes(updatedTimes);
    }

    let results = {
      totalScore: 0,
      correctQuestions: 0,
      totalTimeSpent: 0,
      totalBonus: 0,
      totalPenalty: 0,
      totalNegativePoints: 0,
      questionResults: []
    };

    try {
      // Process each answered question
      const answeredQuestionsCount = Math.min(currentQuestionIndex + 1, questions.length);

      for (let idx = 0; idx < answeredQuestionsCount; idx++) {
        const question = questions[idx];
        const userAnswer = userAnswers[idx];
        const timeTaken = questionTimes[idx] || 60;
        results.totalTimeSpent += timeTaken;

        // Calculate score using logic
        const questionResult = calculateScoreForQuestion(question, userAnswer, timeTaken);
        results.questionResults.push(questionResult);

        // Handle wrong question reports
        if (userAnswer === 'E') {
          if (userId && challenge?.championshipData?.teacher_id) {
            await API.quiz.submitWrongQuestion({
              questionId: question.question_id,
              champId: challenge.id,
              teacherId: challenge.championshipData.teacher_id,
              userId: userId
            }).catch((error) => {
              console.error('Wrong question submission failed:', error);
            });
          }
          continue;
        }

        // Accumulate results
        results.totalScore += questionResult.score;
        if (questionResult.isCorrect) {
          results.correctQuestions++;
        }
        results.totalBonus += questionResult.bonus;
        results.totalPenalty += questionResult.penalty;

        // Submit individual question result to API with proper points_earned
        const champId = challenge?.id || challenge?.championshipData?.champ_id;

        // Allow negative points to be submitted for wrong answers
        if (userId && champId) {
          const answerForAPI = userAnswer === 'E' ? 'E' :
            userAnswer === 'A' ? '1' :
              userAnswer === 'B' ? '2' :
                userAnswer === 'C' ? '3' :
                  userAnswer === 'D' ? '4' : userAnswer;

          // Allow negative points for ALL questions - both correct and wrong can be negative
          let pointsEarned = Math.round(questionResult.score * 100) / 100; // Can be negative for both correct/wrong

          await API.quiz.submitResult({
            questionId: question.question_id,
            champId: champId,
            userId: userId,
            timeTaken: timeTaken,
            expectedTime: questionResult.expectedTime,
            pointsEarned: pointsEarned, // Allow negative values
            correctAns: question.correct_answer,
            submittedAns: answerForAPI
          }).catch((error) => {
            console.error('Individual result submission failed for question', idx + 1, ':', error);
          });
        }
      }

      // Calculate early exit penalty for unanswered questions
      const earlyExitPenalty = calculateEarlyExitPenalty(answeredQuestionsCount, questions.length);
      if (earlyExitPenalty > 0) {
        results.totalScore -= earlyExitPenalty;
        results.totalPenalty += earlyExitPenalty;
      }

      // Submit final quiz results with proper user ID extraction
      const champId = challenge?.id || challenge?.championshipData?.champ_id;
      const modeId = challenge?.championshipData?.mode_id || challenge?.modeId;

      if (userId && champId && challenge?.championshipData) {
        const expectedTotalTime = questions.reduce((total, question) => {
          const expectedTimeStr = question.expected_time || "00:03:00";
          const [hours, minutes, seconds] = expectedTimeStr.split(':').map(Number);
          return total + (hours * 3600) + (minutes * 60) + (seconds || 0);
        }, 0);

        // Calculate final score properly - allow negative scores for display
        const finalTotalScore = Math.round(results.totalScore);

        const finalPayload = {
          champId: champId,
          userId: userId,
          timeTaken: results.totalTimeSpent,
          expectedTime: expectedTotalTime,
          gameMode: modeId,
          totalQuestions: questions.length,
          correctQuestions: results.correctQuestions,
          totalScore: finalTotalScore, // Use non-negative score
          totalBonus: Math.round(results.totalBonus),
          totalPenalty: Math.round(results.totalPenalty),
          totalNegativePoints: Math.round(results.totalPenalty)
        };

        await API.quiz.submitFinalResult(finalPayload).catch((error) => {
          console.error('Final result submission failed:', error);
        });
      }

    } catch (error) {
      console.error('Quiz submission error:', error);
    }

    // Navigate to results
    const answeredQuestionsCount = Math.min(currentQuestionIndex + 1, questions.length);

    navigate(`/app/results/${id}`, {
      state: {
        score: Math.round(results.totalScore), // Show actual score (can be negative)
        total: questions.length,
        correctQuestions: results.correctQuestions,
        answeredQuestions: answeredQuestionsCount,
        questions: questions,
        userAnswers: userAnswers,
        timeSpent: results.totalTimeSpent,
        questionTimes: questionTimes,
        totalBonus: Math.round(results.totalBonus),
        totalPenalty: Math.round(results.totalPenalty),
        questionResults: results.questionResults,
        scoreDisplay: `${results.correctQuestions}/${answeredQuestionsCount}`,
        totalCoins: Math.round(results.totalScore) // Show actual coins (can be negative)
      }
    });
  };

  // ========================================
  // LOADING & ERROR STATES
  // ========================================

  if (loading) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}>
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-orange-500 rounded-full mx-auto mb-4"></div>
          <p>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/app')}
            className="px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}>
        <div className="text-center">
          <p>No questions found for this quiz.</p>
          <button
            onClick={() => navigate('/app')}
            className="px-4 py-2 bg-orange-500 text-white rounded-md mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER DATA PREPARATION
  // ========================================

  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const questionText = currentQuestion.question_text || currentQuestion.questionText;
  const questionImage = currentQuestion.question_image;

  const questionOptions = [
    currentQuestion.option1_text,
    currentQuestion.option2_text,
    currentQuestion.option3_text,
    currentQuestion.option4_text
  ].filter(option => option && option.trim() !== '');

  const options = [
    ...questionOptions.map((opt, idx) => {
      let cleanOpt = opt.replace(/<\/?p>/g, '').trim();
      cleanOpt = cleanOpt.replace(/^[A-D]\)\s*/, '');
      return `${String.fromCharCode(65 + idx)}) ${cleanOpt}`;
    }),
    "E) Report question as wrong"
  ];

  // ========================================
  // MAIN QUIZ UI RENDER
  // ========================================

  return (
    <div className={`fixed inset-0 z-50 overflow-auto ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}>
      <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">

        {/* ========== HEADER SECTION ========== */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"
              }`}>
              {challenge?.title || `Quiz ${id}`}
            </h2>
          </div>
          <button
            onClick={handleExitClick}
            className={`transition-colors ${darkMode ? "text-gray-300 hover:text-red-400" : "text-gray-500 hover:text-red-500"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <KgamifyAdCarousel
        endpoint={`https://kgamify.in/championshipmaker/apis/fetch_champ_advertisements.php?champ_id=${challenge.id}`}
        radius={0}
        />

        {/* ========== STATUS BAR ========== */}
        <div className={`flex justify-between text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
          <span>⏱ {formattedTime}</span>
          <span>🗨️ {currentQuestionIndex + 1}/{questions.length}</span>
          <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full">
            {currentQuestion.total_coins || 5} pts
          </span>
        </div>

        {/* ========== QUESTION POINTS INFO ========== */}
        <div className={`text-xs mb-3 p-2 rounded-lg ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
          <div className="flex justify-between items-center">
            <span>💰 Points: {currentQuestion.total_coins || 5}</span>
            <span>⏰ Expected: {currentQuestion.expected_time || '03:00'}</span>
          </div>
        </div>

        {/* ========== QUESTION SECTION ========== */}
        <div className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-800"
          }`}>
          <div className="mb-2">
            <span className="font-bold">Q {currentQuestionIndex + 1}) </span>
            <div
              className="inline"
              dangerouslySetInnerHTML={{
                __html: questionText?.replace(/<p>/g, '').replace(/<\/p>/g, '') || 'Question text not available'
              }}
            />
          </div>

          {questionImage && (
            <div className="mt-2 mb-2">
              <img
                src={questionImage}
                alt="Question"
                className="max-w-full h-auto rounded-lg border"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        {/* ========== OPTIONS DISPLAY ========== */}
        <div className="mb-4 flex-grow">
          <ul className="space-y-2">
            {options.map((option, index) => (
              <li
                key={index}
                className={`p-2 rounded ${index === options.length - 1 ? "font-semibold text-red-500" : ""
                  }`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>

        {/* ========== ANSWER BUTTONS ========== */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {["A", "B", "C", "D", "E"].map((opt) => {
            const isSelected = selectedOption === opt;
            const isReportButton = opt === "E";

            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className={`py-2 rounded-md border font-medium transition-colors ${isSelected
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

        {/* ========== NEXT QUESTION BUTTON ========== */}
        <button
          onClick={handleNextQuestion}
          disabled={!selectedOption}
          className="w-full py-2 font-medium rounded-md transition-colors bg-orange-500 hover:bg-orange-600 text-black mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit Quiz" : "Next Question"}
        </button>

        {/* ========== EXIT CONFIRMATION POPUP ========== */}
        {showExitPopup && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className={`p-6 rounded-lg shadow-md w-full max-w-sm text-center ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"
                }`}>
                Are you sure you want to exit the quiz?
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"
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
                  className={`px-4 py-2 border rounded-md transition-colors ${darkMode
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