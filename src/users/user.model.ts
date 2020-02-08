import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    }
})
export class User {
    //用户名
    @prop()
    username?: string;
    //密码
    @prop({ required: true })
    password?: string;

    //邮箱
    @prop()
    email?: string;

    //权限
    @prop({ required: true })
    admin: boolean

    //头像
    @prop()
    avater?: string

}