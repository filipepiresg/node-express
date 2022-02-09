import { Model, Optional } from 'sequelize';

export interface RoleAttributes {
  id: number;
  name: string;
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

export interface UserRoleAttributes {
  id: number;
  user_id: number;
  role_id: number;
}

export interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, 'id'> {}

export interface UserRoleInstance
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>,
    UserRoleAttributes {}
