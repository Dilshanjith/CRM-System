import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, UserPlus, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center transition-all hover:shadow-md">
    <div className={`p-4 rounded-full ${colorClass} mr-5`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wide">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
    </div>
  );

  if (!stats) return <div className="text-center py-10 text-red-500">Failed to load dashboard data.</div>;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const pipelineData = [
    { name: 'New', count: stats.newLeads, color: '#FBBF24' },
    { name: 'Qualified', count: stats.qualifiedLeads, color: '#A78BFA' },
    { name: 'Won', count: stats.wonLeads, color: '#34D399' },
    { name: 'Lost', count: stats.lostLeads, color: '#F87171' },
  ];

  const pieData = [
    { name: 'Won Deals', value: stats.wonLeads, color: '#34D399' },
    { name: 'Lost Deals', value: stats.lostLeads, color: '#F87171' }
  ].filter(d => d.value > 0);

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Here's what is happening with your sales pipeline today.</p>
      </div>
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Total Leads" 
          value={stats.totalLeads} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="New Leads" 
          value={stats.newLeads} 
          icon={UserPlus} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
        <StatCard 
          title="Qualified" 
          value={stats.qualifiedLeads} 
          icon={CheckCircle} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Won Deals" 
          value={stats.wonLeads} 
          icon={TrendingUp} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Lost Deals" 
          value={stats.lostLeads} 
          icon={XCircle} 
          colorClass="bg-red-100 text-red-600" 
        />
      </div>

      {/* Revenue & Graphical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Summaries */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <p className="text-brand-100 font-semibold uppercase tracking-wider mb-2">Total Pipeline Value</p>
              <h3 className="text-4xl font-bold">{formatCurrency(stats.totalEstimatedValue)}</h3>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <p className="text-green-100 font-semibold uppercase tracking-wider mb-2">Total Won Value</p>
              <h3 className="text-4xl font-bold">{formatCurrency(stats.totalWonValue)}</h3>
            </div>
          </div>
        </div>

        {/* Bar Chart: Sales Pipeline */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Pipeline Stages</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Win/Loss Ratio */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-gray-900 w-full mb-2">Win / Loss Ratio</h3>
          <div className="h-64 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No closed deals yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
