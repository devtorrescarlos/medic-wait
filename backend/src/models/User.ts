import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export enum DoctorSpecialty {
    GENERAL = "general",
    CARDIOLOGY = "cardiology",
    DERMATOLOGY = "dermatology",
    PEDIATRICS = "pediatrics",
    GYNECOLOGY = "gynecology",
    ORTHOPEDICS = "orthopedics",
    NEUROLOGY = "neurology",
    PSYCHIATRY = "psychiatry"
}

@Table({ tableName: 'users' })
export default class User extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
    declare id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    declare email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare password: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare fullName: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.PATIENT
    })
    declare role: UserRole;

    @Column({
        type: DataType.ENUM(...Object.values(DoctorSpecialty)),
    })
    declare specialty: DoctorSpecialty;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    declare is_active: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    declare is_email_verified: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    declare is_approved_by_admin: boolean;
}
