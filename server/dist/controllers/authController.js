"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const db_1 = require("../config/db");
const jwt_1 = require("../utils/jwt");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3).max(30),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = async (req, res) => {
    try {
        const { email, username, password } = registerSchema.parse(req.body);
        const existingUser = await db_1.prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (existingUser) {
            res.status(400).json({ error: 'User with this email or username already exists' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
            },
        });
        const userPayload = { id: user.id, email: user.email, username: user.username, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(userPayload);
        const refreshTokenStr = (0, jwt_1.generateRefreshToken)(user.id);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db_1.prisma.refreshToken.create({
            data: {
                token: refreshTokenStr,
                userId: user.id,
                expiresAt,
            },
        });
        res.cookie('refreshToken', refreshTokenStr, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            user: userPayload,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const userPayload = { id: user.id, email: user.email, username: user.username, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(userPayload);
        const refreshTokenStr = (0, jwt_1.generateRefreshToken)(user.id);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db_1.prisma.refreshToken.create({
            data: {
                token: refreshTokenStr,
                userId: user.id,
                expiresAt,
            },
        });
        res.cookie('refreshToken', refreshTokenStr, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            message: 'Login successful',
            accessToken,
            user: userPayload,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Login failed' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const tokenStr = req.cookies?.refreshToken;
        if (!tokenStr) {
            res.status(401).json({ error: 'Refresh token missing' });
            return;
        }
        const decoded = (0, jwt_1.verifyRefreshToken)(tokenStr);
        const storedToken = await db_1.prisma.refreshToken.findUnique({
            where: { token: tokenStr },
            include: { user: true },
        });
        if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
            res.status(401).json({ error: 'Invalid or expired refresh token' });
            return;
        }
        // Token Family Rotation
        await db_1.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { isRevoked: true },
        });
        const userPayload = {
            id: storedToken.user.id,
            email: storedToken.user.email,
            username: storedToken.user.username,
            role: storedToken.user.role,
        };
        const newAccessToken = (0, jwt_1.generateAccessToken)(userPayload);
        const newRefreshTokenStr = (0, jwt_1.generateRefreshToken)(storedToken.user.id);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db_1.prisma.refreshToken.create({
            data: {
                token: newRefreshTokenStr,
                userId: storedToken.user.id,
                expiresAt,
            },
        });
        res.cookie('refreshToken', newRefreshTokenStr, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            accessToken: newAccessToken,
            user: userPayload,
        });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const tokenStr = req.cookies?.refreshToken;
        if (tokenStr) {
            await db_1.prisma.refreshToken.updateMany({
                where: { token: tokenStr },
                data: { isRevoked: true },
            });
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    res.json({ user: req.user });
};
exports.getMe = getMe;
