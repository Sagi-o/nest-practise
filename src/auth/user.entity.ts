import { Exclude } from 'class-transformer';
import { TaskEntity } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => TaskEntity, (task: TaskEntity) => task.user, {
    eager: true,
  })
  @Exclude({ toPlainOnly: true }) // WHen this Task is plain text (like JSON), exclude this property
  tasks: TaskEntity[];
}
