import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Save } from 'lucide-react';

const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    assignedTo: '',
    status: 'New',
    value: ''
  });
  
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchLead = async () => {
        try {
          const res = await api.get(`/leads/${id}`);
          setFormData({
            ...res.data,
            value: res.data.value || ''
          });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        value: Number(formData.value) || 0
      };
      if (isEdit) {
        await api.put(`/leads/${id}`, payload);
      } else {
        await api.post('/leads', payload);
      }
      navigate('/leads');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        <Link to="/leads" className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Edit Lead' : 'Create New Lead'}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. Website, Referral"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Salesperson</label>
              <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Deal Value ($)</label>
              <input type="number" name="value" value={formData.value} onChange={handleChange} min="0" step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Link to="/leads" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg mr-4 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="flex items-center px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
              <Save className="w-5 h-5 mr-2" />
              {isEdit ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
