import { useParams, useNavigate } from 'react-router-dom';
import { Challenges } from '../../data_sample/Challenges';
import QuizComponent from './QuizComponent';

const QuizPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const challenge = Challenges.find(c => c.id === challengeId);

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-xs mx-auto">
          <h2 className="text-xl font-bold text-red-500 mb-2">Challenge Not Found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-orange-400 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <QuizComponent 
        challenge={challenge} 
        onClose={() => navigate(-1)} 
      />
    </div>
  );
};

export default QuizPage;