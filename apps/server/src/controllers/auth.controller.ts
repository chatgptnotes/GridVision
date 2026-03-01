import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { authService } from '../services/auth.service';
import { prisma } from '../config/database';
import { env } from '../config/environment';

const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'ENGINEER', 'OPERATOR', 'VIEWER']),
});

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const result = await authService.login(
      username,
      password,
      req.ip || req.socket.remoteAddress,
      req.headers['user-agent'],
    );
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ error: message });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }
    const result = await authService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.json({ message: 'Logged out successfully' });
  } catch {
    res.json({ message: 'Logged out' });
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, username: true, name: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
}

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const data = createUserSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      select: { id: true, username: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
}

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username: data.username }, { email: data.email }] },
    });
    if (existing) {
      res.status(409).json({ error: existing.username === data.username ? 'Username already taken' : 'Email already in use' });
      return;
    }
    const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        name: data.name,
        email: data.email,
        role: 'VIEWER',
      },
      select: { id: true, username: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to register' });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role, isActive },
      select: { id: true, username: true, name: true, email: true, role: true, isActive: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
}
