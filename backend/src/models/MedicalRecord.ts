import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import Appointment from './Appointment';

@Table({ tableName: 'medical_records' })
export default class MedicalRecord extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  id!: string;

  @ForeignKey(() => Appointment)
  @Column({ type: DataType.UUID, allowNull: false })
  appointment_id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  patient_id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  doctor_id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  initial_diagnosis!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  treatment_plan!: string;

  @BelongsTo(() => Appointment)
  appointment!: Appointment;

  @BelongsTo(() => User, 'patient_id')
  patient!: User;

  @BelongsTo(() => User, 'doctor_id')
  doctor!: User;
}
