import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { InjectModel } from 'nestjs-typegoose';
import { Tag } from './tag.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

class CreateTagDto {
    @ApiProperty({ example: '标签名1', description: '标签名称' })
    @IsNotEmpty({ message: '请填写标签名' })
    name: string


}
class UpdateTagDto {
    @ApiProperty({ example: '标签名1', description: '标签名称' })
    @IsNotEmpty({ message: '请填写标签名' })
    name: string

}
@Controller('tags')
@ApiTags('Tag')
export class TagsController {

    constructor(
        @InjectModel(Tag) private readonly tagModel: ModelType<Tag>
    ) { }

    @Get()
    @ApiOperation({ summary: '标签列表' })
    async index() {
        return await this.tagModel.find()
    }

    @Post('create')
    @ApiOperation({ summary: '创建标签' })
    async create(@Body() createTagDto: CreateTagDto) {
        await this.tagModel.create(createTagDto)
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '标签详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        return await this.tagModel.findById(id)
    }

    @Put('update/:id')
    @ApiOperation({ summary: '修改标签' })
    async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
        await this.tagModel.findByIdAndUpdate(id, updateTagDto)
        return { sucess: true }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除标签' })
    async remove(@Param('id') id: string) {
        await this.tagModel.findByIdAndDelete(id)
        return { sucess: true }
    }

    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '标签数据配置' })
    option() {
        return {
            title: "标签管理",
            column: [
                { prop: "name", label: "标签名" },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false }
            ]
        }
    }
}
