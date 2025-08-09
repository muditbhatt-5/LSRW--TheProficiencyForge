import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [UserEmail, setUserEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7106/api/User/login", {
        UserEmail,
        Password,
      });

      if (response.data?.token) {
        const { userID, userName, userEmail, userMobile, userImage, enrollment, token, role, userAccess } = response.data;

        if (role === "admin") {
          login({ userID, userName, userEmail, userMobile, userImage, enrollment }, token);
          navigate("/admin");
        } else if (role === "user") {
          if(userAccess === "active")
            {
              login({ userID, userName, userEmail, userMobile, userImage, enrollment }, token);
              navigate("/dashboard");
            }
            else
            {
              setError("User is not active. Please contact admin.");
            }

        } else {
          setError("Invalid role. Access denied.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email Or Password.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl h-[600px] flex rounded-lg overflow-hidden shadow-2xl">
        <div className="w-1/2 bg-[#159FFC] opacity-20"></div>
        <div className="w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <LogIn className="mx-auto h-12 w-12 text-[#159FFC]" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
            </div>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="UserEmail" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="UserEmail"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#159FFC] focus:border-[#159FFC]"
                  value={UserEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="Password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#159FFC] focus:border-[#159FFC]"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-blue rounded-md shadow-sm text-sm font-medium text-white bg-[#159FFC] hover:bg-[#0b8ee6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#159FFC]"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/signup")}
                className="text-sm text-[#159FFC] hover:text-[#0b8ee6]"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
