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