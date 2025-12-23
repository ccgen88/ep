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