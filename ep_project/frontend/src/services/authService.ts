import api from './api';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    full_name: string;
    role: string;
}

export const authService = {
    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};