import React, { useState, useEffect } from 'react';
import { getParagraphReaders, createParagraphReader, updateParagraphReader, deleteParagraphReader } from '../api';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Sidebar from './Sidebar';

const AdminParagraphReaders = () => {
  const [readers, setReaders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState(null);
  const [formData, setFormData] = useState({
    paragraph_ReadID: 6, // Initialize with 0 for creating new records
    paragraphs: '',
    userID: 0,
  });

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      const response = await getParagraphReaders();
      setReaders(response.data);
    } catch (error) {
      console.error('Error fetching paragraph readers:', error);
      alert('Failed to fetch paragraph readers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReader) {
        // Update existing paragraph reader
        await updateParagraphReader(selectedReader.paragraph_ReadID, formData);
        alert('Paragraph reader updated successfully');
      } else {
        // Create new paragraph reader
        await createParagraphReader({
          ...formData,
          paragraph_ReadID: 0, // Ensure the ID is 0 for new records
        });
        alert('Paragraph reader created successfully');
      }
      setIsModalOpen(false);
      setFormData({ paragraph_ReadID: 0, paragraphs: '', userID: 0 });
      fetchReaders();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(selectedReader ? 'Failed to update paragraph reader' : 'Failed to create paragraph reader');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paragraph reader?')) {
      try {
        await deleteParagraphReader(id);
        alert('Paragraph reader deleted successfully');
        fetchReaders();
      } catch (error) {
        console.error('Error deleting paragraph reader:', error);
        alert('Failed to delete paragraph reader');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Paragraph Readers</h2>
        <button
          onClick={() => {
            setSelectedReader(null);
            setFormData({ paragraph_ReadID: 0, paragraphs: '', userID: 0 });
            setIsModalOpen(true);
          }}
          className="bg-[#159FFC] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Paragraph Reader</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paragraphs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {readers.map((reader) => (
              <tr key={reader.paragraph_ReadID}>
                <td className="px-6 py-4 whitespace-nowrap">{reader.paragraph_ReadID}</td>
                <td className="px-6 py-4">{reader.paragraphs}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reader.userID}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedReader(reader);
                        setFormData({
                          paragraph_ReadID: reader.paragraph_ReadID,
                          paragraphs: reader.paragraphs,
                          userID: reader.userID,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(reader.paragraph_ReadID)}
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
              {selectedReader ? 'Edit Paragraph Reader' : 'Add Paragraph Reader'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Paragraphs</label>
                <textarea
                  value={formData.paragraphs}
                  onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="number"
                  value={formData.userID}
                  onChange={(e) => setFormData({ ...formData, userID: parseInt(e.target.value) })}
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
                  {selectedReader ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParagraphReaders;
