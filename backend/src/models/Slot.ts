import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';

@Table({ tableName: 'slots' })
export default class Slot extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare doctor_id: string;

  @BelongsTo(() => User)
  declare doctor: User;

  @Column({ type: DataType.DATE, allowNull: false })
  declare start_time: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare end_time: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_available: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare version: number;
}
