import { Request, Response } from 'express';

import { CRUD } from '../@types/CRUD';
import { UserCreationAttributes } from '../@types/user';
import UserModel from '../models/user';

export default class UserController implements CRUD {
  public async create(request: Request, response: Response) {
    try {
      const attributes: UserCreationAttributes = request.body;
      const user = await UserModel.create(attributes);

      return response.status(201).send(user.toJSON());
    } catch (error) {
      return response.status(400).send({ error });
    }
  }

  public async read(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const user = await UserModel.findByPk(id);

      return response.status(200).send(user?.toJSON());
    } catch (error) {
      return response.status(400).send({ error });
    }
  }

  public async readAll(request: Request, response: Response) {
    try {
      const users = await UserModel.findAll();

      return response.status(200).send(users);
    } catch (error) {
      return response.status(400).send({ error });
    }
  }

  public async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const attributes = request.body;

      const user = await UserModel.findByPk(id);

      const userUpdate = await user?.update(attributes);

      return response.status(200).send(userUpdate);
    } catch (error) {
      return response.status(400).send({ error });
    }
  }

  public async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const user = await UserModel.findByPk(id);

      await user?.destroy();

      return response.status(200).send(user?.toJSON());
    } catch (error) {
      return response.status(400).send({ error });
    }
  }
}
