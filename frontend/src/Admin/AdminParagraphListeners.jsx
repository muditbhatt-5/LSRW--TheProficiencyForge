import React, { useState, useEffect } from 'react';
import { getParagraphListeners, createParagraphListener, updateParagraphListener, deleteParagraphListener } from '../api';
import { Pencil, Trash2, Plus } from 'lucide-react';

const AdminParagraphListeners = () => {
  const [listeners, setListeners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListener, setSelectedListener] = useState(null);
  const [formData, setFormData] = useState({
    paragraph_Speak_UserName: '',
    paragraph_ReadID: 0,
    userID: 0,
    accuracy: ''
  });

  useEffect(() => {
    fetchListeners();
  }, []);

  const fetchListeners = async () => {
    try {
      const response = await getParagraphListeners();
      setListeners(response.data);
    } catch (error) {
      console.error('Failed to fetch paragraph listeners');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedListener) {
        await updateParagraphListener(selectedListener.paragraph_SpeakID, {
          ...formData,
          paragraph_SpeakID: selectedListener.paragraph_SpeakID
        });
      } else {
        await createParagraphListener(formData);
      }
      setIsModalOpen(false);
      fetchListeners();
    } catch (error) {
      console.error('Failed to save paragraph listener');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paragraph listener?')) {
      try {
        await deleteParagraphListener(id);
        fetchListeners();
      } catch (error) {
        console.error('Failed to delete paragraph listener');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Paragraph Listeners</h2>
        <button
          onClick={() => {
            setSelectedListener(null);
            setFormData({ paragraph_Speak_UserName: '', paragraph_ReadID: 0, userID: 0, accuracy: '' });
            setIsModalOpen(true);
          }}
          className="bg-[#159FFC] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Paragraph Listener</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speak ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Read ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listeners.map((listener) => (
              <tr key={listener.paragraph_SpeakID}>
                <td className="px-6 py-4 whitespace-nowrap">{listener.paragraph_SpeakID}</td>
                <td className="px-6 py-4">{listener.paragraph_Speak_UserName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{listener.paragraph_ReadID}</td>
                <td className="px-6 py-4 whitespace-nowrap">{listener.userID}</td>
                <td className="px-6 py-4 whitespace-nowrap">{listener.accuracy}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedListener(listener);
                        setFormData({
                          paragraph_Speak_UserName: listener.paragraph_Speak_UserName,
                          paragraph_ReadID: listener.paragraph_ReadID,
                          userID: listener.userID,
                          accuracy: listener.accuracy
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 me-3"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(listener.paragraph_SpeakID)}
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
            <h3 className="text-xl font-bold mb-4">
              {selectedListener ? 'Edit Paragraph Listener' : 'Add Paragraph Listener'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User Name</label>
                <input
                  type="text"
                  value={formData.paragraph_Speak_UserName}
                  onChange={(e) => setFormData({ ...formData, paragraph_Speak_UserName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Accuracy</label>
                <input
                  type="text"
                  value={formData.accuracy}
                  onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-[#159FFC] text-white rounded-md hover:bg-blue-600">
                {selectedListener ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParagraphListeners;
