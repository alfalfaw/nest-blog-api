import { prop, modelOptions } from '@typegoose/typegoose';


@modelOptions({
    schemaOptions: {
        timestamps: true,
    }
})
export class Picture {
    @prop()
    owner: string;

    @prop()
    desc: string;

    @prop()
    url: string;

}