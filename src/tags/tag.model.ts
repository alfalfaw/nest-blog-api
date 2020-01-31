import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions:{
      timestamps:true,
  }
})
export class Tag {
    @prop({ required: true })
    name: string;
}