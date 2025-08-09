import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const Exam = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const questionsPerPage = 5;

  useEffect(() => {
    if (timer > 0 && !examStarted) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && !examStarted) {
      setExamStarted(true);
    }
  }, [timer, examStarted]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://localhost:7106/api/Mcqs');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (mcqID, answer) => {
    setAnswers((prev) => ({ ...prev, [mcqID]: answer }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.mcqID] === question.answer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setExamCompleted(true);
  };

  const downloadResult = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Exam Results', 20, 20);
    doc.setFontSize(14);
    doc.text(`Score: ${score}%`, 20, 40);
    doc.text('Questions and Answers:', 20, 60);

    let yPosition = 80;
    questions.forEach((question, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Your Answer: ${answers[question.mcqID] || 'Not answered'}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Correct Answer: ${question.answer}`, 30, yPosition);
      yPosition += 20;
    });

    doc.save('exam-results.pdf');
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-4xl h-[600px] flex rounded-lg overflow-hidden shadow-2xl">
          <div className="w-1/2 bg-[#159FFC] opacity-20"></div>
          <div className="w-1/2 flex items-center justify-center bg-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Get Ready for Exam</h1>
              <p className="text-xl mb-6">All the best!</p>
              <div className="text-6xl font-bold text-[#159FFC]">{timer}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (examCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Exam Completed!</h2>
          <p className="text-lg mb-4">Your Score: {score}%</p>
          <button className="downloadBtn" onClick={downloadResult}>
            <Download className="w-5 h-5 mr-2" />
            Download Results
          </button>
        </div>
      </div>
    );
  }

  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">LSRW EXAM!</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        {currentQuestions.map((question) => (
          <div key={question.mcqID} className="mb-6">
            <p className="font-medium mb-3">{question.question}</p>
            <div className="space-y-2">
              {[question.optionA, question.optionB, question.optionC, question.optionD].map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`question-${question.mcqID}`}
                      value={option}
                      checked={answers[question.mcqID] === option}
                      onChange={() => handleAnswerSelect(question.mcqID, option)}
                      className="form-radio text-[#159FFC]"
                    />
                    <span>{option}</span>
                  </label>
                )
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="font-medium">Page {currentPage + 1} of {Math.ceil(questions.length / questionsPerPage)}</span>
          <button
            onClick={() =>
              currentPage < Math.ceil(questions.length / questionsPerPage) - 1
                ? setCurrentPage((prev) => prev + 1)
                : handleSubmit()
            }
            className="bg-[#159FFC] text-white px-4 py-2 rounded-lg"
          >
            {currentPage < Math.ceil(questions.length / questionsPerPage) - 1
              ? 'Next'
              : 'Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exam;
