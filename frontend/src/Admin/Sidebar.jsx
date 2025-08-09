import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-[#159FFC] text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="hover:text-gray-300">User Panel</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin" className="hover:text-gray-300">Users</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/admin-paragraph-readers" className="hover:text-gray-300">Paragraph Readers</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/admin-paragraph-listeners" className="hover:text-gray-300">Paragraph Listeners</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/mcqs" className="hover:text-gray-300">MCQs</Link> {/* Add link for MCQs */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
