// src/components/Quiz/QuizPage.jsx
import { useParams } from 'react-router-dom';
import { challenges } from '../../data_sample/Challenges';
import QuizComponent from './QuizComponent';

const QuizPage = () => {
  const { challengeId } = useParams();
  const challenge = challenges.find(c => c.id === challengeId);

  if (!challenge) {
    return <div className="p-4 text-red-500">Challenge not found</div>;
  }

  return <QuizComponent challenge={challenge} />;
};

export default QuizPage;