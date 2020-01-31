import { prop, modelOptions } from '@typegoose/typegoose';

//example of model----typegoose
// import { prop } from "@typegoose/typegoose";
// import { IsString } from "class-validator";

// export class Cat {
//   @IsString()
//   @prop({ required: true })
//   name: string;
// }

@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class Post {
  @prop({ required: true })
  title: string;
  @prop({ required: true })
  content: string;
  @prop()
  author: string;
  @prop()
  click_num: Number;
  @prop()
  cover: string;

}