"use client"
// pages/index.js or app/page.js (depending on your Next.js version)
import { useEffect, useState } from 'react';
import MouseMovementAnalyzer from '../../components/MouseTracker';
import KeystrokeAnalytics from '@/components/Keystroke';

export default function Home() {
  const [validMovement, setValidMovement] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(1.0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  // Sample questions and answer options
  const questions = [
    {
      text: "What's your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"]
    },
    {
      text: "How often do you browse the web?",
      options: ["Daily", "Weekly", "Monthly", "Rarely"]
    },
    {
      text: "Which device are you using now?",
      options: ["Desktop", "Laptop", "Tablet", "Mobile"]
    },
    {
      text: "How would you rate your experience?",
      options: ["Excellent", "Good", "Average", "Poor"]
    }
  ];
  
  const handleValidityChange = (isValid, confidence) => {
    setValidMovement(isValid);
    setConfidenceScore(confidence);
    
    // You could send this data to your backend or handle it however you need
    if (!isValid && confidence < 0.4) {
      console.log('Potentially malicious activity detected');
      // Add your custom logic here: show CAPTCHA, log event, etc.
    }
  };
  
  const handleAnswerClick = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
    
    // Move to next question after a short delay
    if (questionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
      }, 500);
    }
  };
  
  const resetSurvey = () => {
    setCurrentQuestion(0);
    setAnswers([]);
  };
  
  return (
    <MouseMovementAnalyzer 
      onValidityChange={handleValidityChange}
      sensitivityLevel={1} // Adjust sensitivity (0.5-1.0)
      straightLineThreshold={0.85} // Set the threshold for suspicious activity
    >
      <main className="min-h-screen p-8">
        <KeystrokeAnalytics/>
        <h1 className="text-2xl font-bold mb-4">Interactive Survey Page</h1>
        <p className="mb-6">This page analyzes mouse movements while you answer questions.</p>
        
        {!validMovement && confidenceScore < 0.5 && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded mb-6">
            Unusual mouse movement detected. Please complete the verification below.
            {/* Add your CAPTCHA or other verification here */}
          </div>
        )}
        
        {/* Question and Answer Section */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          
          <p className="text-lg mb-4">{questions[currentQuestion].text}</p>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                id={`q${currentQuestion}-a${index}`}
                className={`w-full p-3 text-left rounded-md hover:bg-blue-50 transition-colors ${
                  answers[currentQuestion] === index ? 'bg-blue-100 border-blue-500 border' : 'border'
                }`}
                onClick={() => handleAnswerClick(currentQuestion, index)}
              >
                {option}
              </button>
            ))}
          </div>
          
          {answers.length === questions.length && (
            <button
              id="reset-survey"
              className="mt-6 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
              onClick={resetSurvey}
            >
              Start Over
            </button>
          )}
        </div>
        
        {/* Survey Analytics */}
        <div className="max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Movement Analysis:</h3>
          <p className="mb-1">Status: {validMovement ? 'Valid movements' : 'Suspicious activity'}</p>
          <p>Confidence: {(confidenceScore * 100).toFixed(1)}%</p>
        </div>
      </main>
    </MouseMovementAnalyzer>
  );
}