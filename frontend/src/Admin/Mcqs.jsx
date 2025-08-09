import React, { useState, useEffect } from 'react';
import { getMcqs, createMcq, updateMcq, deleteMcq } from '../api';
import { Pencil, Trash2, Plus } from 'lucide-react';

const Mcqs = () => {
  const [mcqs, setMcqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMcq, setSelectedMcq] = useState(null);
  const [formData, setFormData] = useState({
    userID: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: ''
  });

  useEffect(() => {
    fetchMcqs();
  }, []);

  const fetchMcqs = async () => {
    try {
      const response = await getMcqs();
      setMcqs(response.data);
    } catch (error) {
      alert('Failed to fetch MCQs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMcq) {
        await updateMcq(selectedMcq.mcqID, { ...formData, mcqID: selectedMcq.mcqID });
        alert('MCQ updated successfully');

        // Update state instead of reloading the page
        setMcqs((prevMcqs) =>
          prevMcqs.map((mcq) =>
            mcq.mcqID === selectedMcq.mcqID ? { ...mcq, ...formData } : mcq
          )
        );
      } else {
        const response = await createMcq(formData);
        alert('MCQ created successfully');

        // Append the new MCQ to the list
        setMcqs((prevMcqs) => [...prevMcqs, response.data]);
      }

      setIsModalOpen(false);
      setSelectedMcq(null);
      setFormData({
        userID: '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        answer: ''
      });
    } catch (error) {
      alert(selectedMcq ? 'Failed to update MCQ' : 'Failed to create MCQ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this MCQ?')) {
      try {
        await deleteMcq(id);
        alert('MCQ deleted successfully');
        fetchMcqs();
      } catch (error) {
        alert('Failed to delete MCQ');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">MCQs</h2>
        <button
          onClick={() => {
            setSelectedMcq(null);
            setFormData({
              userID: '',
              question: '',
              optionA: '',
              optionB: '',
              optionC: '',
              optionD: '',
              answer: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-[#159FFC] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add MCQ</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mcqs.map((mcq) => (
              <tr key={mcq.mcqID}>
                <td className="px-6 py-4 whitespace-nowrap">{mcq.question}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {mcq.optionA}, {mcq.optionB}, {mcq.optionC}, {mcq.optionD}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{mcq.answer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMcq(mcq);
                        setFormData(mcq);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(mcq.mcqID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{selectedMcq ? 'Edit MCQ' : 'Add MCQ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="number"
                  value={formData.userID}
                  onChange={(e) => setFormData({ ...formData, userID: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option A</label>
                <input
                  type="text"
                  value={formData.optionA}
                  onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option B</label>
                <input
                  type="text"
                  value={formData.optionB}
                  onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option C</label>
                <input
                  type="text"
                  value={formData.optionC}
                  onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option D</label>
                <input
                  type="text"
                  value={formData.optionD}
                  onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Answer</label>
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#159FFC] text-white rounded-md hover:bg-blue-600"
                >
                  {selectedMcq ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mcqs;
