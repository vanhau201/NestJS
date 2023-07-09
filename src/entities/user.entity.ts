import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EnumRoles {
  ADMIN = 'admin',
  PM = 'pm',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'update_token',
  })
  updateToken: string;

  @CreateDateColumn({
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
  })
  updateAt: Date;

  @DeleteDateColumn({
    name: 'delete_at',
  })
  deleteAt: Date;

  @Column()
  name: string;

  @Column({
    name: 'username',
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    name: 'refresh_token',
    default: '',
  })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: EnumRoles,
    default: EnumRoles.PM,
  })
  role: string;
}
