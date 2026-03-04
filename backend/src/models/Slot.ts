import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'slots' })
export default class Slot extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare start_time: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare end_time: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_available: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare version: number;
}
