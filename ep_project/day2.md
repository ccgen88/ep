# DAY 2 - 8 HOUR SPRINT PLAN
## Admin Dashboard & User Management

**Date:** December 23, 2024  
**Duration:** 8 Hours  
**Goal:** Build complete Admin Dashboard with User Management (CRUD)  

---

## RECAP - DAY 1 ACHIEVEMENTS ✅
- ✅ Backend & Frontend project setup
- ✅ PostgreSQL database connected
- ✅ Complete database schema created
- ✅ Authentication system (JWT + bcrypt)
- ✅ Login/Register APIs working
- ✅ Login page created

---

## HOUR 1: Protected Routes & Auth Context (9:00 AM - 10:00 AM)

### Authentication Context Setup (30 minutes)

**frontend/src/contexts/AuthContext.tsx:**
```typescript
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Protected Route Component (20 minutes)

**frontend/src/components/ProtectedRoute.tsx:**
```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Update App.tsx (10 minutes)

**frontend/src/App.tsx:**
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import ExaminerDashboard from './pages/Examiner/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Examiner Routes */}
          <Route
            path="/examiner/*"
            element={
              <ProtectedRoute allowedRoles={['examiner']}>
                <ExaminerDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Unauthorized Access</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

**✓ Checkpoint:** Protected routes with role-based access working

---

## HOUR 2: Admin Dashboard Layout & Navigation (10:00 AM - 11:00 AM)

### Sidebar Component (30 minutes)

**frontend/src/components/Admin/Sidebar.tsx:**
```typescript
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/exams', label: 'Exams', icon: '📝' },
    { path: '/admin/results', label: 'Results', icon: '📈' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-indigo-800">
        <h1 className="text-2xl font-bold">Exam Portal</h1>
        <p className="text-sm text-indigo-300 mt-1">Admin Panel</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-indigo-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <p className="font-medium">{user?.full_name}</p>
            <p className="text-xs text-indigo-300">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
```

### Admin Layout Component (20 minutes)

**frontend/src/components/Admin/AdminLayout.tsx:**
```typescript
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Administration Dashboard
            </h2>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
```

### Admin Dashboard Home Page (10 minutes)

**frontend/src/pages/Admin/Dashboard.tsx:**
```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/" element={<DashboardHome />} />
      </Routes>
    </AdminLayout>
  );
};

export default Dashboard;
```

**frontend/src/pages/Admin/DashboardHome.tsx:**
```typescript
import React from 'react';

const DashboardHome: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Overview</h3>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Exams</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Students</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <div className="text-4xl">🎓</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Examiners</p>
              <p className="text-2xl font-bold mt-1">0</p>
            </div>
            <div className="text-4xl">👨‍🏫</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
            <span className="text-2xl mb-2 block">➕</span>
            <span className="font-medium">Add New User</span>
          </button>
          <button className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
            <span className="text-2xl mb-2 block">📝</span>
            <span className="font-medium">Create Exam</span>
          </button>
          <button className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
            <span className="text-2xl mb-2 block">📊</span>
            <span className="font-medium">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
```

**✓ Checkpoint:** Admin dashboard layout with navigation working

---

## HOUR 3: Backend User Management APIs (11:00 AM - 12:00 PM)

### User Controller (45 minutes)

**backend/src/controllers/userController.ts:**
```typescript
import { Request, Response } from 'express';
import pool from '../config/database';
import { hashPassword } from '../utils/password';
import { AuthRequest } from '../middleware/auth';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new user
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, full_name, role } = req.body;

    // Validate role
    if (!['admin', 'student', 'examiner'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
      [email, hashedPassword, full_name, role]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, full_name, role, is_active } = req.body;

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    const result = await pool.query(
      'UPDATE users SET email = $1, full_name = $2, role = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, email, full_name, role, is_active',
      [email, full_name, role, is_active, id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by role
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;

    const result = await pool.query(
      'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      [role]
    );

    res.json({
      success: true,
      users: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
```

### User Routes (15 minutes)

**backend/src/routes/userRoutes.ts:**
```typescript
import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Protect all routes with authentication and admin authorization
router.use(authenticate);
router.use(authorize('admin'));

// User routes
router.get('/', getAllUsers);
router.get('/role/:role', getUsersByRole);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

### Update Main Server (5 minutes)

**backend/src/index.ts - Add user routes:**
```typescript
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';  // ← Add this

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // ← Add this

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});
```

**✓ Checkpoint:** User management APIs ready and tested

---

## HOUR 4: Frontend User Service & Types (12:00 PM - 1:00 PM)

### TypeScript Types (20 minutes)

**frontend/src/types/user.ts:**
```typescript
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'student' | 'examiner';
  is_active: boolean;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'student' | 'examiner';
}

export interface UpdateUserData {
  email: string;
  full_name: string;
  role: 'admin' | 'student' | 'examiner';
  is_active: boolean;
}
```

### User Service (40 minutes)

**frontend/src/services/userService.ts:**
```typescript
import api from './api';
import { User, CreateUserData, UpdateUserData } from '../types/user';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.users;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  },

  // Get users by role
  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await api.get(`/users/role/${role}`);
    return response.data.users;
  },

  // Create user
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data.user;
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.user;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
```

**✓ Checkpoint:** Frontend services ready to consume APIs

---

## LUNCH BREAK (1:00 PM - 2:00 PM) 🍽️

---

## HOUR 5: User List Component (2:00 PM - 3:00 PM)

### User Management Page (60 minutes)

**frontend/src/pages/Admin/UserManagement.tsx:**
```typescript
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types/user';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter((user) => user.role === filterRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">User Management</h3>
        <button
          onClick={() => {/* Will add modal later */}}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Role:
        </label>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="examiner">Examiner</option>
        </select>
        <span className="ml-4 text-gray-600">
          Total: {filteredUsers.length} user(s)
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'student'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {/* Edit modal - will add */}}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
```

**✓ Checkpoint:** User list displaying with filter and delete functionality

---

## HOUR 6: Create User Modal (3:00 PM - 4:00 PM)

### Modal Component (30 minutes)

**frontend/src/components/Admin/AddUserModal.tsx:**
```typescript
import React, { useState } from 'react';
import { CreateUserData } from '../../types/user';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => Promise<void>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    full_name: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'student',
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Add New User</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="student">Student</option>
              <option value="examiner">Examiner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
```

### Update UserManagement to use Modal (30 minutes)

**Update frontend/src/pages/Admin/UserManagement.tsx:**
```typescript
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User, CreateUserData } from '../../types/user';
import AddUserModal from '../../components/Admin/AddUserModal';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);  // ← Add this

  // ... (keep existing useEffect and fetchUsers)

  // ← Add this function
  const handleCreateUser = async (userData: CreateUserData) => {
    const newUser = await userService.createUser(userData);
    setUsers([newUser, ...users]);
  };

  // ... (keep rest of the code)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">User Management</h3>
        <button
          onClick={() => setIsModalOpen(true)}  // ← Update this
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add New User
        </button>
      </div>

      {/* ... (keep existing code) */}

      {/* ← Add this at the end */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default UserManagement;
```

**✓ Checkpoint:** Create user functionality working with modal

---

## HOUR 7: Edit User Modal (4:00 PM - 5:00 PM)

### Edit User Modal Component (40 minutes)

**frontend/src/components/Admin/EditUserModal.tsx:**
```typescript
import React, { useState, useEffect } from 'react';
import { User, UpdateUserData } from '../../types/user';

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (id: number, userData: UpdateUserData) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UpdateUserData>({
    email: '',
    full_name: '',
    role: 'student',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      await onSubmit(user.id, formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Edit User</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="student">Student</option>
              <option value="examiner">Examiner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
```

### Update UserManagement with Edit functionality (20 minutes)

**Update frontend/src/pages/Admin/UserManagement.tsx:**
```typescript
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User, CreateUserData, UpdateUserData } from '../../types/user';
import AddUserModal from '../../components/Admin/AddUserModal';
import EditUserModal from '../../components/Admin/EditUserModal';  // ← Add this

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // ← Rename
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // ← Add this
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  // ← Add this

  // ... (keep existing code)

  // ← Add this function
  const handleEditUser = async (id: number, userData: UpdateUserData) => {
    const updatedUser = await userService.updateUser(id, userData);
    setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
  };

  // ← Add this function
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // ... (keep rest of the code, but update the Edit button)

  return (
    <div>
      {/* ... existing code ... */}

      {/* In the table, update the Edit button: */}
      <button
        onClick={() => openEditModal(user)}  // ← Update this
        className="text-indigo-600 hover:text-indigo-900 mr-4"
      >
        Edit
      </button>

      {/* Modals at the end */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditUser}
      />
    </div>
  );
};

export default UserManagement;
```

**✓ Checkpoint:** Full CRUD operations working (Create, Read, Update, Delete)

---

## HOUR 8: Placeholder Dashboards & Testing (5:00 PM - 6:00 PM)

### Student Dashboard Placeholder (15 minutes)

**frontend/src/pages/Student/Dashboard.tsx:**
```typescript
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Student Portal</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user?.full_name}!</h2>
          <p className="text-gray-600">Student Dashboard - Coming Soon</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">My Exams</h3>
            <p className="text-3xl font-bold text-indigo-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Upcoming</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
```

### Examiner Dashboard Placeholder (15 minutes)

**frontend/src/pages/Examiner/Dashboard.tsx:**
```typescript
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ExaminerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Examiner Portal</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user?.full_name}!</h2>
          <p className="text-gray-600">Examiner Dashboard - Coming Soon</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">My Questions</h3>
            <p className="text-3xl font-bold text-indigo-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Exams Created</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">To Grade</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminerDashboard;
```

### Complete Testing (30 minutes)

**Test Checklist:**

1. **Authentication Flow:**
```bash
# Test login with different roles
- Login as admin@test.com
- Login as student@test.com (create one first)
- Login as examiner@test.com (create one first)
```

2. **Admin Dashboard:**
- ✅ Navigate to User Management
- ✅ View all users
- ✅ Filter by role
- ✅ Create new user (all roles)
- ✅ Edit user information
- ✅ Delete user
- ✅ Logout

3. **Protected Routes:**
- ✅ Try accessing /admin without login → redirects to login
- ✅ Login as student → try /admin → shows unauthorized
- ✅ Login as admin → access all pages

4. **API Testing (Postman):**
```
GET    http://localhost:5000/api/users          # Get all users
GET    http://localhost:5000/api/users/:id      # Get user by ID
POST   http://localhost:5000/api/users          # Create user
PUT    http://localhost:5000/api/users/:id      # Update user
DELETE http://localhost:5000/api/users/:id      # Delete user
```

**✓ Checkpoint:** All Day 2 features tested and working!

---

## 🎯 END OF DAY 2 - WHAT WE ACCOMPLISHED

✅ **Frontend:**
- Auth Context with user state management
- Protected routes with role-based access
- Complete Admin Dashboard layout with sidebar
- User Management (CRUD) with modals
- Filter users by role
- Student & Examiner placeholder dashboards

✅ **Backend:**
- User management APIs (GET, POST, PUT, DELETE)
- Role-based authorization middleware
- Error handling

✅ **Features Completed:**
- Login redirects based on role
- Admin can manage all users
- Create/Edit/Delete users with validation
- Active/Inactive status toggle
- Proper logout functionality

---

## 📝 COMMIT YOUR WORK

```bash
# Backend
cd E:\NNRG\ep_project\backend
git add .
git commit -m "Day 2: Admin dashboard, user management CRUD, protected routes"

# Frontend
cd E:\NNRG\ep_project\frontend
git add .
git commit -m "Day 2: Admin dashboard UI, user management with modals, auth context"
```

---

## 🎯 TOMORROW (DAY 3): We'll build:
1. Question Bank Module for Examiner
2. Create Questions (MCQ, Descriptive, Coding)
3. Question listing with search and filter
4. Edit/Delete questions
5. Question categories/tags

**Excellent progress! You now have a fully functional admin panel! 🚀**

---

## 💡 QUICK TIPS

- Test each feature immediately after building
- Keep the backend server running in one terminal
- Keep the frontend dev server in another terminal
- Use Postman to test APIs directly
- Commit code frequently with meaningful messages

**See you tomorrow for Day 3! 💪**