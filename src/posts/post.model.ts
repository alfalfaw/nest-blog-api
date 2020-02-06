import { prop, modelOptions, Ref } from '@typegoose/typegoose';
import { Tag } from 'src/tags/tag.model';

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
  @prop()
  desc?: string;
  @prop()
  content?: string;
  @prop()
  html?: string;
  @prop()
  author?: string;
  @prop()
  click_num: number;
  @prop()
  cover?: string;
  @prop()
  tag?: Ref<Tag>;
  @prop({ required: true })
  publish: boolean;

}