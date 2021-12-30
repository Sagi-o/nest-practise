import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './models/jwt-payload.interface';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      secret: 'topSecretKey',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // Action to do when JWT token on request is valid
  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { username } = payload;
    const user: UserEntity = await this.usersRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
