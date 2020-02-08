import { prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    }
})
export class Website {
    //站点名称
    @prop()
    sitename?: string;
    //点击
    @prop({ required: true })
    view?: number;

    //签名
    @prop()
    signature?: string;

    //是否启用
    @prop({ required: true })
    active: boolean

    //建站时间
    @prop()
    established?: Date
    //联系方式
    @prop()
    contacts?: []
    //大事件
    @prop()
    milestones?: []

    //最后活动
    @prop()
    last_event?: Date

    //密码
    @prop()
    password?: string

    //头像
    @prop()
    avater?: string

    //logo
    @prop()
    logo?: string

}