import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import Role from "./Role";
import UserRole from "./UserRole";
import Specialty from "./Specialty";

@Table({ tableName: "users" })
export default class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare age: number;

  @ForeignKey(() => Specialty)
  @Column({ type: DataType.UUID, allowNull: true })
  declare specialty_id: string;

  @BelongsTo(() => Specialty)
  declare specialty: Specialty;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_email_verified: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_approved_by_admin: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, defaultValue: () => new Date() })
  declare created_at: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, defaultValue: () => new Date() })
  declare updated_at: Date;

  @BelongsToMany(() => Role, () => UserRole, "user_id")
  declare roles: Role[];
}
