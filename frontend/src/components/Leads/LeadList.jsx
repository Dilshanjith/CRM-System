import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Search, Filter, Trash2, Edit, MoreVertical, Briefcase, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const statusColors = {
  'New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Contacted': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Qualified': 'bg-purple-50 text-purple-700 border-purple-200',
  'Proposal Sent': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Won': 'bg-green-50 text-green-700 border-green-200',
  'Lost': 'bg-red-50 text-red-700 border-red-200',
};

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLeads = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      
      const res = await api.get('/leads', { params });
      setLeads(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-gray-500 mt-2">Manage and track your potential customers.</p>
        </div>
        <Link 
          to="/leads/new" 
          className="flex items-center bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Lead
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-2">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 p-2">
          <div className="flex-1 relative group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="w-full md:w-64 relative group">
            <Filter className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none font-medium text-gray-700"
            >
              <option value="">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pipeline Stage</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deal Value</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-3 h-3 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-3 h-3 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No leads found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/leads/${lead.id}`} className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold mr-4 border border-gray-200">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{lead.name}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-0.5">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {lead.company}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 flex items-center mb-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400 mr-2" />
                        {lead.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3.5 h-3.5 text-gray-400 mr-2" />
                        {lead.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select 
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-3 py-1.5 border ${statusColors[lead.status] || 'bg-gray-50 text-gray-700 border-gray-200'} cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 appearance-none pr-8 transition-colors`}
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <svg className={`w-3 h-3 ${statusColors[lead.status]?.split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(lead.value)}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {lead.createdAt?._seconds ? format(new Date(lead.createdAt._seconds * 1000), 'MMM d, yyyy') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/leads/${lead.id}/edit`} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(lead.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
