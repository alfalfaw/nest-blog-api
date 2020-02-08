import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './user.model';
import { UsersController } from './users.controller';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  controllers: [UsersController]
})
export class UsersModule {}
