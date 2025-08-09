import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import "./DashboardDesign.css";
import levenshtein from "fast-levenshtein";

const ParagraphListener = () => {
  const navigate = useNavigate();
  const [paragraph, setParagraph] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [spokenWords, setSpokenWords] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const recognitionRef = useRef(null);
  const paragraphWordsRef = useRef([]);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    const savedParagraph = localStorage.getItem("selectedParagraph");
    if (!savedParagraph) {
      navigate("/paragraph-reader");
    } else {
      setParagraph(savedParagraph);
      paragraphWordsRef.current = cleanText(savedParagraph).split(" ");
    }
  }, [navigate]);

  // Clean text for processing
  const cleanText = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Levenshtein for word match (allow 1-2 edit distance based on word length)
  const levenshteinMatch = (inputWord, targetWord) => {
    const distance = levenshtein.get(inputWord, targetWord);
    const maxAllowedDistance = Math.max(1, Math.floor(targetWord.length / 4)); // Dynamic threshold based on word length
    return distance <= maxAllowedDistance ? targetWord : inputWord;
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true; // Allow continuous speech
      recognition.interimResults = true; // Show partial results
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenWords([]);
        console.log("Listening started...");
      };

      recognition.onresult = (event) => {
        // Get the last result only to avoid duplicates
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ")
          .toLowerCase();

        const words = cleanText(transcript).split(" ");

        // Match spoken words to paragraph words with fuzzy matching
        const correctedWords = words.map((word, index) => {
          if (index < paragraphWordsRef.current.length) {
            return levenshteinMatch(word, paragraphWordsRef.current[index]);
          }
          return word;
        });

        setSpokenWords(correctedWords);

        // Reset silence timeout for slow speakers
        resetSilenceTimeout();
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      resetSilenceTimeout();
      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Reset silence timeout to allow more time for slow speakers
  const resetSilenceTimeout = () => {
    clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
      stopListening(); // Stop after 10 seconds of silence
    }, 10000); // Increased timeout to 10 seconds
  };

  // Compare and assign colors in real-time
  const compareWords = (word, index) => {
    if (index < spokenWords.length) {
      return word.toLowerCase() === spokenWords[index].toLowerCase()
        ? "text-green-500"
        : "text-red-500";
    }
    return "text-gray-800";
  };

  const calculateAccuracy = () => {
    const paragraphWords = paragraphWordsRef.current;
    let correctCount = 0;

    paragraphWords.forEach((word, index) => {
      if (
        index < spokenWords.length &&
        word.toLowerCase() === spokenWords[index].toLowerCase()
      ) {
        correctCount++;
      }
    });

    return ((correctCount / paragraphWords.length) * 100).toFixed(2);
  };

  const handleSubmit = async () => {
    const userData = localStorage.getItem("user");
    let userID = null;

    if (userData) {
      try {
        const userObject = JSON.parse(userData);
        userID = userObject.userID;
      } catch (error) {
        alert("Failed to parse user data.");
        return;
      }
    }

    if (!userID) {
      alert("User not logged in.");
      return;
    }

    const paragraph_ReadID = 2;
    const accuracyScore = calculateAccuracy();
    setAccuracy(accuracyScore);

    const payload = {
      paragraph_SpeakID: 5,
      paragraph_Speak_UserName: spokenWords.join(" "),
      paragraph_ReadID,
      userID: parseInt(userID, 10),
      accuracy: accuracyScore,
    };

    try {
      const response = await fetch(
        "https://localhost:7106/api/Paragraph_Listener",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Data submitted successfully!");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      alert("An error occurred while submitting data.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl h-[700px] flex rounded-lg overflow-hidden shadow-2xl">
        <div className="w-1/2 bg-[#159FFC] opacity-20"></div>
        <div className="w-1/2 bg-white p-8 overflow-y-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-[#159FFC] mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Paragraph Listener
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <p className="text-gray-800 text-sm mb-6 paragraph-box">
              {paragraph.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={`${compareWords(word, index)} mx-1`}
                >
                  {word}
                </span>
              ))}
            </p>

            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center px-4 py-2 rounded-md ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#159FFC] hover:bg-[#0b8ee6]"
              } text-white text-sm mb-4`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" /> Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" /> Start Listening
                </>
              )}
            </button>

            <button onClick={handleSubmit} className="custom-button">
              Submit
            </button>

            {accuracy !== null && (
              <p className="text-lg font-bold text-gray-900 mt-4">
                Accuracy: {accuracy}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParagraphListener;
