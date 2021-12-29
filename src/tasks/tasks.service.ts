import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './models/create-task.dto';
import { UpdateTaskDto } from './models/update-task.dto';
import { GetTasksFilterDto } from './models/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return this.tasksRepository.updateTask(id, updateTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const result: DeleteResult = await this.tasksRepository.deleteTask(id);

    if (!result.affected) {
      throw new NotFoundException(`Not found task with ID ${id}`);
    }
  }
}
