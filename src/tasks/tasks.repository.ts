import { UserEntity } from 'src/auth/user.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './models/create-task.dto';
import { GetTasksFilterDto } from './models/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { UpdateTaskDto } from './models/update-task.dto';
import { TaskEntity } from './task.entity';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
  async getAllTasks(user: UserEntity): Promise<TaskEntity[]> {
    return await this.find(user);
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterDto;

    if (!status && !search) {
      return this.getAllTasks(user);
    }

    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status: TaskStatus.OPEN });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return await this.getTasksWithFilters(filterDto, user);
  }

  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    return await this.findOne({ where: { id, user } });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    };

    const taskEntity = this.create(task);

    await this.save(task);

    return taskEntity;
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = this.getTaskById(id, user);

    if (!task) {
      return task;
    }

    await this.update(id, updateTaskDto);

    return this.getTaskById(id, user);
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return await this.delete(id);
  }
}
