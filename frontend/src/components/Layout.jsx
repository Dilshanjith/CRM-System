import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Briefcase } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads Pipeline', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside className="w-72 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100 flex flex-col z-20 transition-all duration-300">
        <div className="p-8 flex items-center">
          <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-2 rounded-xl shadow-md mr-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Nexus<span className="text-brand-600">CRM</span></h1>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-brand-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center mb-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-inner">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-8 lg:p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
