import { PG_UNIQUE_VIOLATION } from 'src/shared/postgres-error-codes';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { UserEntity } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.getSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userEntity = this.create({ username, password: hashedPassword });

    try {
      await this.save(userEntity);
    } catch (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException(
        'Some internal error happen when signing up',
      );
    }
  }
}
