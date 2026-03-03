import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import MedicalRecord from './MedicalRecord';

export enum MedicalRecordAnnexeType {
  EVOLUTION = 'evolution',
  LAB_RESULT = 'lab_result',
  CORRECTION = 'correction',
}

@Table({ tableName: 'medical_record_annexes' })
export default class MedicalRecordAnnexe extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  id!: string;

  @ForeignKey(() => MedicalRecord)
  @Column({ type: DataType.UUID, allowNull: false })
  medical_record_id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  doctor_id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  content!: string;

  @Column({
    type: DataType.ENUM(...Object.values(MedicalRecordAnnexeType)),
    allowNull: false
  })
  type!: MedicalRecordAnnexeType;

  @BelongsTo(() => MedicalRecord)
  medicalRecord!: MedicalRecord;

  @BelongsTo(() => User, 'doctor_id')
  doctor!: User;
}
