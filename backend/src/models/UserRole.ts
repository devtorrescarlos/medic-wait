import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Role from './Role';

@Table({ tableName: 'user_roles' })
export default class UserRole extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    declare user_id: string;

    @PrimaryKey
    @ForeignKey(() => Role)
    @Column({ type: DataType.UUID, allowNull: false })
    declare role_id: string;

    @BelongsTo(() => User, 'user_id')
    declare user: User;

    @BelongsTo(() => Role, 'role_id')
    declare role: Role;
}