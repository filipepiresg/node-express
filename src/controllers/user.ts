import { Body, Controller, Delete, Get, Patch, Post, Route, SuccessResponse } from 'tsoa';

import { CRUD } from '../@types/CRUD';
import { CreateUser, UpdateUser } from '../@types/user';
import { ErrorMessage } from '../middlewares/error';
import UserModel from '../models/user';

@Route('api/v1/users')
export default class UserController extends Controller implements CRUD {
  @SuccessResponse(201, 'Created')
  @Post()
  public async create(@Body() attributes: CreateUser) {
    try {
      const newUser = await UserModel.create(attributes);

      return newUser.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(400, error?.message || 'Something went wrong!');
    }
  }

  @Get('{id}')
  public async read(id: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }

      return user.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Get()
  public async readAll() {
    try {
      const users = await UserModel.findAll();

      return users.map((user) => user.toJSON());
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Patch('{id}')
  public async update(id: string, @Body() attributes: UpdateUser) {
    try {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }
      const userUpdated = await user.update(attributes);

      return userUpdated.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Delete('{id}')
  public async delete(id: string) {
    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new ErrorMessage(404, 'User not found');
      }
      await user.destroy();

      return user.toJSON();
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }
}
