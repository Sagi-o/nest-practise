import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const userEntity = this.create({ username, password });

    await this.save(userEntity);
  }
}
