import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './models/create-task.dto';
import { UpdateTaskDto } from './models/update-task.dto';
import { GetTasksFilterDto } from './models/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { DeleteResult } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    const task = await this.tasksRepository.getTaskById(id, user);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksRepository.updateTask(id, updateTaskDto, user);
  }

  async deleteTask(id: string, user: UserEntity): Promise<void> {
    const result: DeleteResult = await this.tasksRepository.deleteTask(
      id,
      user,
    );

    if (!result.affected) {
      throw new NotFoundException(`Not found task with ID ${id}`);
    }
  }
}
