import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Post } from './post.model';
import { Tag } from 'src/tags/tag.model';
import { Website } from 'src/app.model';

@Module({
  imports: [TypegooseModule.forFeature([Post,Tag,Website])],
  controllers: [PostsController]
})
export class PostsModule {}
