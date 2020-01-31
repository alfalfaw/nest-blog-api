import { Module } from '@nestjs/common';
import { OperationsController } from './operations.controller';
import { TagOfPost } from './operation.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([TagOfPost])],
  controllers: [OperationsController]
})
export class OperationsModule {}
