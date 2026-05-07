import { Routes, Route } from 'react-router-dom';
import LeadList from '../components/Leads/LeadList';
import LeadForm from '../components/Leads/LeadForm';
import LeadDetail from '../components/Leads/LeadDetail';

const Leads = () => {
  return (
    <Routes>
      <Route path="/" element={<LeadList />} />
      <Route path="/new" element={<LeadForm />} />
      <Route path="/:id/edit" element={<LeadForm />} />
      <Route path="/:id" element={<LeadDetail />} />
    </Routes>
  );
};

export default Leads;
