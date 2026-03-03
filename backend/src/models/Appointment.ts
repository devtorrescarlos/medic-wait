import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, CreatedAt } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import Slot from './Slot';

export enum AppointmentStatus {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  EN_CURSO = 'en curso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Table({ tableName: 'appointments' })
export default class Appointment extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  doctor_id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  patient_id!: string;

  @ForeignKey(() => Slot)
  @Column({ type: DataType.UUID, allowNull: false })
  slot_id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  reason!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  cancellation_reason!: string;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    defaultValue: AppointmentStatus.PENDIENTE
  })
  status!: AppointmentStatus;

  @CreatedAt
  @Column({ type: DataType.DATE })
  created_at!: Date;

  @BelongsTo(() => User, 'doctor_id')
  doctor!: User;

  @BelongsTo(() => User, 'patient_id')
  patient!: User;

  @BelongsTo(() => Slot)
  slot!: Slot;
}
