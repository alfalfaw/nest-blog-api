import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypegooseModule } from 'nestjs-typegoose'
import { TagsModule } from './tags/tags.module';
import { OperationsModule } from './operations/operations.module';
import { PicturesModule } from './pictures/pictures.module';
@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://localhost:27017/nest-blog-api", {
      useNewUrlParser: true,
      useUnifiedTopology: true ,
      useFindAndModify:false
    }),
    PostsModule,
    TagsModule,
    OperationsModule,
    PicturesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
