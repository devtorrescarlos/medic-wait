import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

@Table({ tableName: 'users' })
export default class User extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    fullName!: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.PATIENT
    })
    role!: UserRole;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_active!: boolean;
}
