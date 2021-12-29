import { TaskStatus } from './task.model';

export class UpdateTaskDto {
  description?: string;
  title?: string;
  status?: TaskStatus;
}
