import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, HasMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './User';
import Slot from './Slot';

@Table({ tableName: 'doctor_schedules' })
export default class DoctorSchedule extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
    declare id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        onDelete: 'CASCADE'
    })
    doctor_id!: string;

    @Column({
        type: DataType.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        allowNull: false
    })
    day_of_week!: string;

    @Column(DataType.TIME)
    start_time!: string;

    @Column(DataType.TIME)
    end_time!: string;

    @Column(DataType.INTEGER)
    slot_duration!: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_active!: boolean;

    @HasMany(() => Slot)
    declare slots: Slot[];
}