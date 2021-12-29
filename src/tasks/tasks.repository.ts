import { NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './models/create-task.dto';
import { GetTasksFilterDto } from './models/get-tasks-filter.dto';
import { TaskStatus } from './models/task-status.enum';
import { UpdateTaskDto } from './models/update-task.dto';
import { TaskEntity } from './task.entity';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
  async getAllTasks(): Promise<TaskEntity[]> {
    return await this.find();
  }

  async getTasksWithFilters(
    filterDto: GetTasksFilterDto,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterDto;

    if (!status && !search) {
      return this.getAllTasks();
    }

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status: TaskStatus.OPEN });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return await this.getTasksWithFilters(filterDto);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    return await this.findOne(id);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
    };

    const taskEntity = this.create(task);

    await this.save(task);

    return taskEntity;
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = this.getTaskById(id);

    if (!task) {
      return task;
    }

    await this.update(id, updateTaskDto);

    return this.getTaskById(id);
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return await this.delete(id);
  }
}
