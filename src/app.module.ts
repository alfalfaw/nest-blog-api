import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypegooseModule } from 'nestjs-typegoose'
import { TagsModule } from './tags/tags.module';
import { PicturesModule } from './pictures/pictures.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { WebsiteModule } from './website/website.module';
import { UsersModule } from './users/users.module';


//ali-oss
const MAO = require('multer-aliyun-oss');

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://localhost:27017/nest-blog-api", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    //设置上传地址
    MulterModule.register({
      storage: MAO({
        config: {
          region: 'oss-cn-shanghai',
          accessKeyId: 'LTAI4Ff7HPW1jNjhJDUdj4nR',
          accessKeySecret: 'qydIOq3fkvbbK7vQuHTaM8htgjtSXc',
          bucket: 'alfalfaw'
        }
      })
      // dest:'uploads'
    }),
    PostsModule,
    TagsModule,
    PicturesModule,
    AuthModule,
    WebsiteModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
