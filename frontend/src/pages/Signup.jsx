import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    UserEmail: '',
    UserMobile: '',
    Enrollment: '',
    Password: '',
    UserImage: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7106/api/User',
        {
          UserName: formData.UserName,
          UserEmail: formData.UserEmail,
          UserMobile: formData.UserMobile,
          Enrollment: formData.Enrollment,
          Password: formData.Password,
          UserImage: formData.UserImage || null, // Ensure optional field is handled
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl h-[700px] flex rounded-lg overflow-hidden shadow-2xl">
        <div className="w-1/2 bg-[#159FFC] opacity-20"></div>
        <div className="w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            <div className="text-center">
              <UserPlus className="mx-auto h-12 w-12 text-[#159FFC]" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
            </div>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {[
                { name: 'UserName', label: 'Full Name', type: 'text' },
                { name: 'UserEmail', label: 'Email address', type: 'email' },
                { name: 'UserMobile', label: 'Mobile Number', type: 'tel' },
                { name: 'Enrollment', label: 'Enrollment Number', type: 'text' },
                { name: 'Password', label: 'Password', type: 'password' },
                { name: 'UserImage', label: 'Profile Image URL', type: 'url' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#159FFC] focus:border-[#159FFC]"
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#159FFC] hover:bg-[#0b8ee6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#159FFC] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-[#159FFC] hover:text-[#0b8ee6]"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
