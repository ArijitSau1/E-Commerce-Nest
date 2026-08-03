import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
 import { UserPermission } from 'src/user-permission/entities/user-permission.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission,
  )
  userPermission: UserPermission[];
}