import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ReportForm from '../pages/ReportForm';
import ReportDetails from '../pages/ReportDetails';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/report" element={<ReportForm />} />
      <Route path="/report/:id" element={<ReportDetails />} />
    </Routes>
  );
};

export default AppRoutes;
