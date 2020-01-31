import { Module } from '@nestjs/common';
import { PicturesController } from './pictures.controller';
import { Picture } from './picture.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports:[TypegooseModule.forFeature([Picture])],
  controllers: [PicturesController]
})
export class PicturesModule {}
