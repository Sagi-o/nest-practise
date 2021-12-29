import { IsEnum } from 'class-validator';
import { TaskStatus } from './task-status.enum';

export class UpdateTaskDto {
  description?: string;
  title?: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
