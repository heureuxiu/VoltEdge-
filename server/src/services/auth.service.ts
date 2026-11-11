import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminUser } from '../models/AdminUser';
import { ApiError } from '../utils/ApiError';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: 'admin';
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.');
  }
}

export async function login(email: string, password: string) {
  const user = await AdminUser.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  // Same message for unknown email and wrong password so accounts cannot be probed.
  const invalid = ApiError.unauthorized('That email or password isn\'t right.');
  if (!user || user.disabled) throw invalid;
  if (!(await bcrypt.compare(password, user.passwordHash))) throw invalid;
  const payload: TokenPayload = { sub: String(user._id), email: user.email, name: user.name, role: 'admin' };
  return { token: signToken(payload), user: { id: String(user._id), email: user.email, name: user.name, role: 'admin' as const } };
}
