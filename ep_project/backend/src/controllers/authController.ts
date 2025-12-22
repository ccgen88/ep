import { Request, Response } from 'express';
import pool from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, full_name, role } = req.body;

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
            'INSERT INTO users (email, password, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
            [email, hashedPassword, full_name, role]
        );

        const user = result.rows[0];

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};