import { prop, modelOptions } from "@typegoose/typegoose";


@modelOptions({
  schemaOptions:{
      timestamps:true,
  }
})
export class TagOfPost {
    @prop({ required: true })
    post_id:string;
    @prop({ required: true })
    tag_id:string; 
  }