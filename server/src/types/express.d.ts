export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  role: 'admin';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
