import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Check } from 'lucide-react';
import "./DashboardDesign.css";

const ParagraphReader = () => {
  const navigate = useNavigate();
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch paragraphs from API
  useEffect(() => {
    const fetchParagraphs = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/Paragraph_Reader');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setParagraphs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load paragraphs.');
        setLoading(false);
      }
    };

    fetchParagraphs();
  }, []);

  const handleRead = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (text) => {
    localStorage.setItem('selectedParagraph', text);
    navigate('/paragraph-listener');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl h-[700px] flex rounded-lg overflow-hidden shadow-2xl">
        <div className="w-1/2 bg-[#159FFC] opacity-20"></div>
        <div className="w-1/2 bg-white p-8 overflow-y-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#159FFC] mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Paragraph Reader</h1>

          {loading ? (
            <p className="text-gray-700">Loading paragraphs...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-4">
              {paragraphs.map((paragraph) => (
                <div key={paragraph.paragraph_ReadID} className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-gray-800 text-sm mb-4">{paragraph.paragraphs}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRead(paragraph.paragraphs)}
                      className="custom-button"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Read
                    </button>
                    <button
                      onClick={() => handleSelect(paragraph.paragraphs)}
                      className="flex items-center px-3 py-2 border border-[#159FFC] text-[#159FFC] rounded-md hover:bg-[#159FFC] hover:text-white text-sm"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParagraphReader;
