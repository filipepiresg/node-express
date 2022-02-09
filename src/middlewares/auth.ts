import { NextFunction, Request, Response } from 'express';
import { NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

import roles from '../config/roles.json';
import { UserModel } from '../models';
import { verifyJwt } from '../utils/token';
import { ErrorMessage } from './error';

export function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  try {
    const token = <string>request.headers['x-access-token'];

    if (!token) {
      throw new ErrorMessage(403, 'No token provided!');
    }

    verifyJwt(token, undefined, (err, decode) => {
      if (err) {
        if (err instanceof NotBeforeError) {
          const details =
            err?.inner && err?.date ? { message: err.inner, date: err.date } : undefined;
          throw new ErrorMessage(401, err.message, details);
        } else if (err instanceof TokenExpiredError) {
          const details =
            err?.inner && err?.expiredAt ? { message: err.inner, date: err.expiredAt } : undefined;
          throw new ErrorMessage(401, err.message, details);
        }
        const details = err?.inner ? { message: err.inner } : undefined;
        throw new ErrorMessage(401, err.message, details);
      }
      const id = typeof decode === 'string' ? decode : decode?.id;
      if (id === undefined) {
        throw new ErrorMessage(403, 'User is invalid!', { message: decode });
      }

      request.params.userId = id;
      next();
    });
  } catch (err: any) {
    next(err);
  }
}

export function isAdmin(request: Request, response: Response, next: NextFunction): Response | void {
  const { userId } = request.params;
  UserModel.findByPk(userId)
    .then((user) => {
      user?.getRoles().then((_roles) => {
        if (!_roles) {
          throw new ErrorMessage(404, 'Require Role!');
        }

        const isGranted = _roles.some((role) => role.name === roles[2].name);

        if (!isGranted) {
          throw new ErrorMessage(403, 'Require Admin Role!');
        }
        next();
      });
    })
    .catch((err: any) => {
      next(err);
    });
}

export function isModerator(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  const { userId } = request.params;
  UserModel.findByPk(userId)
    .then((user) => {
      user?.getRoles().then((_roles) => {
        if (!_roles) {
          throw new ErrorMessage(404, 'Require Role!');
        }

        const isGranted = _roles.some((role) => role.name === roles[1].name);

        if (!isGranted) {
          throw new ErrorMessage(403, 'Require Moderator Role!');
        }
        next();
      });
    })
    .catch((err: any) => {
      next(err);
    });
}

export function isModeratorOrAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  const { userId } = request.params;
  UserModel.findByPk(userId)
    .then((user) => {
      user?.getRoles().then((_roles) => {
        if (!_roles) {
          throw new ErrorMessage(404, 'Require Role!');
        }

        const isGranted = _roles.some(
          ({ name }) => name === roles[1].name || name === roles[2].name
        );

        if (!isGranted) {
          throw new ErrorMessage(403, 'Require Moderator or Admin Role!');
        }
        next();
      });
    })
    .catch((err: any) => {
      next(err);
    });
}
