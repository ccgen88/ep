import api from './api';
import type { User } from '../types/user';
import type { CreateUserData } from '../types/user';
import type { UpdateUserData } from '../types/user';

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