import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, CreatedAt } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import Slot from './Slot';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Table({ tableName: 'appointments' })
export default class Appointment extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare doctor_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare patient_id: string;

  @ForeignKey(() => Slot)
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE' })
  declare slot_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare reason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare cancellation_reason: string;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    defaultValue: AppointmentStatus.PENDING
  })
  declare status: AppointmentStatus;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare created_at: Date;

  @BelongsTo(() => User, 'doctor_id')
  declare doctor: User;

  @BelongsTo(() => User, 'patient_id')
  declare patient: User;

  @BelongsTo(() => Slot)
  declare slot: Slot;
}
