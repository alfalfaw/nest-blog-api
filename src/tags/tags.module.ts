import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Tag } from './tag.model';

@Module({
  imports:[TypegooseModule.forFeature([Tag])],
  controllers: [TagsController]
})
export class TagsModule {}
