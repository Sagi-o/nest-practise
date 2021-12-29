import { IsEnum } from 'class-validator';
import { TaskStatus } from './task.model';

export class UpdateTaskDto {
  description?: string;
  title?: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
