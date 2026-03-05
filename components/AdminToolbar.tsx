import React from 'react';
import { useStore } from '../context/StoreContext';
import { LogOut, LayoutDashboard, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminToolbar: React.FC = () => {
  const { isAdmin, logout } = useStore();
  const location = useLocation();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center space-x-6 border border-gray-700 animate-fade-in">
      <div className="flex items-center space-x-2 border-r border-gray-600 pr-4">
        <span className="text-xs font-bold text-bullseye-red uppercase tracking-wider">Admin Mode</span>
      </div>

      {location.pathname === '/admin-login' ? (
         <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
            <Eye size={18} />
            <span className="text-sm font-medium">View Site</span>
         </Link>
      ) : (
        <Link to="/admin-login" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
      )}

      <button onClick={logout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors border-l border-gray-600 pl-4">
        <LogOut size={18} />
      </button>
    </div>
  );
};


export default AdminToolbar;