import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '../../types';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to perform this action. Required roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
