import { Module} from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Tag } from '../tags/tag.model';
import { Post } from '../posts/post.model';
import { Website } from './website.model';

@Module({
  imports: [TypegooseModule.forFeature([Post,Tag,Website])],
  controllers: [WebsiteController]
})
export class WebsiteModule {}
