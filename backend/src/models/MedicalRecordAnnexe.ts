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
import MedicalRecord from "./MedicalRecord";

export enum MedicalRecordAnnexeType {
  EVOLUTION = "evolution",
  LAB_RESULT = "lab_result",
  CORRECTION = "correction",
}

@Table({ tableName: "medical_record_annexes" })
export default class MedicalRecordAnnexe extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @ForeignKey(() => MedicalRecord)
  @Column({ type: DataType.UUID, allowNull: false })
  declare medical_record_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare doctor_id: string;

  @Column({ type: DataType.STRING(1000), allowNull: false })
  declare content: string;

  @Column({
    type: DataType.ENUM(...Object.values(MedicalRecordAnnexeType)),
    allowNull: false,
  })
  declare type: MedicalRecordAnnexeType;

  @CreatedAt
  @Column({ type: DataType.DATE, defaultValue: () => new Date() })
  declare created_at: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, defaultValue: () => new Date() })
  declare updated_at: Date;

  @BelongsTo(() => MedicalRecord)
  declare medicalRecord: MedicalRecord;

  @BelongsTo(() => User, "doctor_id")
  declare doctor: User;
}
