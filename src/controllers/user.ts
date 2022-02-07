import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { CRUD } from '../@types/CRUD';
import { CreateUser, UpdateUser, UserAttributes } from '../@types/user';
import { ErrorMessage } from '../middlewares/error';
import UserModel from '../models/user';

@Tags('Users')
@Route('api/v1/users')
export default class UserController extends Controller implements CRUD<UserAttributes, CreateUser> {
  @Security('x-access-token')
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

  @Security('x-access-token')
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

  @Security('x-access-token')
  @Get()
  public async readAll() {
    try {
      const users = await UserModel.findAll();

      return users.map((user) => user.toJSON());
    } catch (error: any) {
      throw new ErrorMessage(error?.status || 400, error?.message || 'Something went wrong!');
    }
  }

  @Security('x-access-token')
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

  @Security('x-access-token')
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
