import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import roles from '../config/roles.json';
import { secret } from '../config/secret.json';
import { UserModel } from '../models';
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

    verify(token, secret, { algorithms: ['HS256'], complete: false }, (err, decode) => {
      const id = typeof decode === 'string' ? decode : decode?.id;
      if (err || !id) {
        throw new ErrorMessage(401, err?.message || 'Token is invalid');
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
          throw new ErrorMessage(403, 'Require Role!');
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
          throw new ErrorMessage(403, 'Require Role!');
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
          throw new ErrorMessage(403, 'Require Role!');
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
