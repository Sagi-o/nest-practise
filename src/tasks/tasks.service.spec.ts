import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/auth/user.entity';
import { TaskStatus } from './models/task-status.enum';
import { TaskEntity } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const tasksRepositoryMock = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  getTaskById: jest.fn(),
});

const userMock: UserEntity = {
  username: 'sagi',
  id: '1234',
  password: 'password',
  tasks: [],
};

const tasksMock: TaskEntity[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Some description',
    status: TaskStatus.OPEN,
    user: userMock,
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Some description',
    status: TaskStatus.OPEN,
    user: userMock,
  },
];

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository; // :TasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: tasksRepositoryMock },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('should return user tasks', async () => {
      tasksRepository.getTasks.mockResolvedValue(tasksMock); // mockResolvedValue because getTasks return a Promise
      const tasks = await tasksService.getTasks(null, userMock);
      expect(tasks).toEqual(tasksMock);
    });
  });

  describe('getTaskById', () => {
    it('should return task', async () => {
      tasksRepository.getTaskById.mockResolvedValue(tasksMock[0]);
      const task = await tasksService.getTaskById('1', userMock);
      expect(task).toEqual(tasksMock[0]);
    });

    it('should return error - task not found', async () => {
      tasksRepository.getTaskById.mockResolvedValue(null);
      const task = tasksService.getTaskById('1', userMock);
      expect(task).rejects.toThrow(NotFoundException);
    });
  });
});
