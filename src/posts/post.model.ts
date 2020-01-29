import { prop} from '@typegoose/typegoose';

//example of model----typegoose
// import { prop } from "@typegoose/typegoose";
// import { IsString } from "class-validator";
 
// export class Cat {
//   @IsString()
//   @prop({ required: true })
//   name: string;
// }

export class Post {
  @prop({ required: true })
  title: string;
  @prop({ required: true })
  content: string;
  @prop()
  author:string;
  @prop()
  created:Date;
  @prop()
  click_num:Number;
  @prop()
  update:Date;
}