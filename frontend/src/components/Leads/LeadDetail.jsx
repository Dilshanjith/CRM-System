import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Building, Mail, Phone, MapPin, Tag, User, DollarSign, Clock, MessageSquare, Send, CheckCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';

const LeadDetail = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const [leadRes, notesRes] = await Promise.all([
          api.get(`/leads/${id}`),
          api.get(`/leads/${id}/notes`)
        ]);
        setLead(leadRes.data);
        setNotes(notesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadData();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const res = await api.post(`/leads/${id}/notes`, { content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
    </div>
  );
  if (!lead) return <div className="text-center py-20 text-gray-500 text-lg">Lead not found.</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Link to="/leads" className="mr-5 p-3 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 hover:shadow-md text-gray-500 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{lead.name}</h1>
              {lead.status === 'Won' && <CheckCircle className="w-6 h-6 text-green-500" />}
            </div>
            <p className="text-gray-500 font-medium flex items-center">
              <Building className="w-4 h-4 mr-2" /> {lead.company}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="px-6 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-gray-700 font-bold flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 mr-2"></span>
            {lead.status}
          </div>
          <Link to={`/leads/${lead.id}/edit`} className="p-3 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 hover:shadow-md text-gray-600 hover:text-brand-600 transition-all">
            <Edit className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="h-24 bg-gradient-to-br from-brand-500 to-brand-700 absolute top-0 w-full z-0"></div>
            
            <div className="relative z-10 px-8 pt-12 pb-8">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center text-3xl font-black text-brand-600 mb-6 mx-auto transform -translate-y-4">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Contact Information</h3>
              
              <div className="space-y-5">
                <div className="flex items-start bg-gray-50 p-4 rounded-2xl">
                  <Mail className="w-5 h-5 text-brand-500 mr-4 mt-0.5" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-gray-900 font-medium hover:text-brand-600 truncate block">{lead.email}</a>
                  </div>
                </div>
                
                <div className="flex items-start bg-gray-50 p-4 rounded-2xl">
                  <Phone className="w-5 h-5 text-brand-500 mr-4 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${lead.phone}`} className="text-gray-900 font-medium">{lead.phone || 'Not provided'}</a>
                  </div>
                </div>

                <div className="flex items-start bg-gray-50 p-4 rounded-2xl">
                  <User className="w-5 h-5 text-brand-500 mr-4 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Owner</p>
                    <p className="text-gray-900 font-medium">{lead.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-gray-50 p-4 rounded-2xl">
                  <Tag className="w-5 h-5 text-brand-500 mr-4 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Source</p>
                    <span className="inline-block bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm mt-1">{lead.source || 'Direct'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <DollarSign className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Deal Value</p>
              <h3 className="text-4xl font-black">${Number(lead.value).toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Activity */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[750px] overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-brand-100 p-2.5 rounded-xl mr-4">
                  <MessageSquare className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Timeline</h3>
                  <p className="text-sm text-gray-500 mt-1">Leave notes, track meetings, and update progress.</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
                
                {/* Timeline generation */}
                {notes.length === 0 ? (
                  <div className="text-center py-20 relative z-10">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                      <MessageSquare className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No activity yet</h3>
                    <p className="text-gray-500">Be the first to add a note to this lead's timeline!</p>
                  </div>
                ) : (
                  notes.map((note, idx) => (
                    <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-brand-100 text-brand-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                        {note.createdBy.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-gray-900">{note.createdBy.split('@')[0]}</span>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                            {note.createdAt?._seconds ? format(new Date(note.createdAt._seconds * 1000), 'MMM d, h:mm a') : 'Just now'}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </div>
                  ))
                )}
                
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <form onSubmit={handleAddNote} className="relative">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type a new note here..."
                  className="w-full pl-6 pr-16 py-4 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none shadow-inner"
                  rows="3"
                  required
                ></textarea>
                <button 
                  type="submit" 
                  disabled={!newNote.trim()}
                  className="absolute bottom-4 right-4 bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-xl disabled:opacity-50 transition-all transform hover:-translate-y-0.5 disabled:hover:translate-y-0 shadow-md"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
