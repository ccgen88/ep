import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';

const Dashboard: React.FC = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/users" element={<UserManagement />} />
            </Routes>
        </AdminLayout>
    );
};

export default Dashboard;