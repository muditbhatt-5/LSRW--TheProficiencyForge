import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Mic, PenTool, LogOut, Github } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./DashboardDesign.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showUserDetails, setShowUserDetails] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const features = [
    { title: "Paragraph Reader", description: "Read and listen to paragraphs to improve pronunciation", icon: Book, path: "/paragraph-reader" },
    { title: "Paragraph Listener", description: "Practice speaking and get instant feedback", icon: Mic, path: "/paragraph-listener" },
    { title: "Take Exam", description: "Test your knowledge and track progress", icon: PenTool, path: "/exam" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative">
      <div className={`w-full h-full absolute top-0 left-0 ${showUserDetails ? "blur-background" : ""}`} />

      <div className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer" onClick={() => setShowUserDetails(true)}>
        <img src={user.userImage} alt="User" className="w-12 h-12 rounded-full border-2 border-[#159FFC] profile-glow" />
        <span className="text-lg font-semibold text-gray-900">Hey, {user.userName}</span>
      </div>

      {showUserDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-96 bg-white rounded-lg p-6 shadow-lg profile-modal-glow relative">
            <button onClick={() => setShowUserDetails(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            <div className="flex justify-center">
              <img src={user.userImage} alt="User" className="w-24 h-24 rounded-full border-4 profile-glow" />
            </div>
            <div className="mt-4 text-center">
            <span className="bg-green-200 text-green-1000 rounded-full px-2 py-1 text-xs font-semibold">Active</span>
              <h2 className="text-xl font-semibold text-gray-900">{user.userName}</h2>
              <p className="text-sm text-gray-600">{user.userEmail} </p>
            </div>
            <div className="mt-6">
              <p><strong>ID:</strong> {user.userID}</p>
              <p><strong>Mobile:</strong> {user.userMobile}</p>
              <p><strong>Enrollment:</strong> {user.enrollment}</p>
            </div>
            <div className="mt-4 pt-2 ps-2 flex justify-center">
              <button onClick={logout} className="downloadBtn">
                <span className="text"><LogOut className="w-5 h-5" /> Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl h-[700px] flex flex-col rounded-lg overflow-hidden shadow-2xl relative">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[80%] py-4 px-[100px] bg-[#159FFC] bg-opacity-30 backdrop-blur-lg rounded-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Dashboard</h1>
        </div>
        <div className="w-full bg-white p-8 flex-1 mt-20">
          <div className="grid gap-6">
            {features.map((feature) => (
              <button key={feature.path} onClick={() => navigate(feature.path)} className="flex items-start p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <feature.icon className="w-6 h-6 text-[#159FFC] mt-1" />
                <div className="ml-4 text-left">
                  <h2 className="text-lg font-semibold text-gray-900">{feature.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 w-full max-w-4xl text-center p-6 bg-gray-100 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">About Us</h2>
          <p className="text-gray-600 mt-2">LSRW is a cutting-edge Text-To-Speech platform designed to enhance language skills through Listening, Speaking, Reading, and Writing (LSRW) techniques. Our mission is to make language learning more interactive and efficient.</p>
          <div className="mt-6 flex justify-center space-x-8">
            <div>
              <h3 className="text-lg font-semibold">Connect with Us</h3>
              <a href="https://github.com/muditbhatt-5" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <Github className="w-6 h-6" />
                GitHub
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Need Help?</h3>
              <p className="text-gray-600">Contact us at <a href="mailto:bhattmudit213@gmail.com" className="text-blue-600 hover:text-blue-800">bhattmudit213@gmail.com</a></p>
            </div>
          </div>
          <p className="mt-6 text-gray-500">© {new Date().getFullYear()} LSRW. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
