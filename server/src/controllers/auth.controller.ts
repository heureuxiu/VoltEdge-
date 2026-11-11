import { AdminUser } from '../models/AdminUser';
import * as authService from '../services/auth.service';
import { logActivity } from '../services/activity.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const result = await authService.login(email, password);
  await logActivity(`${result.user.email} signed in`, 'auth', result.user.name);
  res.json({ data: result });
});

export const me = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.auth!.userId);
  if (!user || user.disabled) throw ApiError.unauthorized();
  res.json({ data: { user: { id: String(user._id), email: user.email, name: user.name, role: user.role } } });
});
