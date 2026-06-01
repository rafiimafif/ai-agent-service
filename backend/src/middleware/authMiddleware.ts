import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    name: string;
    email: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }

  try {
    // Session is stored as JSON string in cookies (from login route)
    // Next.js encode cookies or store them as plain JSON strings. In this app, it is a plain JSON string.
    const user = typeof sessionCookie === 'string' && sessionCookie.startsWith('{') 
      ? JSON.parse(sessionCookie) 
      : sessionCookie;
      
    req.user = user;
    next();
  } catch (err) {
    console.error('Session parse error:', err);
    return res.status(401).json({ error: 'Unauthorized. Invalid session.' });
  }
}
