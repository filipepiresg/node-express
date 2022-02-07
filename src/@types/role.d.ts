import { Optional } from 'sequelize';

export interface RoleAttributes {
  id: number;
  name: string;
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}
