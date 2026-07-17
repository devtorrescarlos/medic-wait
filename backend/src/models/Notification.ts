import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import User from "./User";

@Table({ tableName: "notifications" })
export default class Notification extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare message: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_read: boolean;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare reference_type: string;

  @Column({ type: DataType.UUID, allowNull: true })
  declare reference_id: string;

  @CreatedAt
  @Column({ type: DataType.DATE, defaultValue: () => new Date() })
  declare created_at: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, defaultValue: () => new Date() })
  declare updated_at: Date;

  @BelongsTo(() => User, "user_id")
  declare user: User;
}
