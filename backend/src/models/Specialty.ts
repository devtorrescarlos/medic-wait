import { Table, Column, Model, DataType, PrimaryKey, CreatedAt } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'specialties' })
export default class Specialty extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: () => uuidv4() })
    declare id: string;

    @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
    declare name: string;

    @CreatedAt
    @Column({ type: DataType.DATE, defaultValue: () => new Date() })
    declare created_at: Date;
}