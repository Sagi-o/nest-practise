import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../user.entity';

export const GetUser = createParamDecorator(
  (_data: any, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
