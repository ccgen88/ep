import jwt, { SignOptions, Secret } from "jsonwebtoken";

interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export const generateToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: 7,
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
