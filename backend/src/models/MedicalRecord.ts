import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import Appointment from './Appointment';

@Table({ tableName: 'medical_records' })
export default class MedicalRecord extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @ForeignKey(() => Appointment)
  @Column({ type: DataType.UUID, allowNull: false })
  declare appointment_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare patient_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare doctor_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare initial_diagnosis: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare treatment_plan: string;

  @BelongsTo(() => Appointment)
  declare appointment: Appointment;

  @BelongsTo(() => User, 'patient_id')
  declare patient: User;

  @BelongsTo(() => User, 'doctor_id')
  declare doctor: User;
}
