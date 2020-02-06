import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
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
    async index(@Query('page') page: string, @Query('limit') limit: string, @Query('sort') sort: string = '-_id', @Query('where') where) {
        let page_num = null
        let limit_num = null
        let total = null
        let data = null

        //符合条件数量
        if (typeof where === 'undefined') {
            where = {}
        } else {
            where = JSON.parse(where)
        }
        total = await this.tagModel.countDocuments(where)
        // global.console.log('tags count   '+total)

        if (typeof limit === 'undefined') {
            data = await this.tagModel.find()
            return { total: total, data: data }
        }
        //分页查询
        page_num = parseInt(page)
        // global.console.log(page_num)
        limit_num = parseInt(limit)

        data = await this.tagModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })

        return { total: total, data: data }

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
        return { success: true }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除标签' })
    async remove(@Param('id') id: string) {
        await this.tagModel.findByIdAndDelete(id)
        return { success: true }
    }

    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '标签数据配置' })
    option() {
        return {
            title: "标签管理",
            column: [
                { prop: "name", label: "标签名", sortable: true, search: true, row: true },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" }
            ]
        }
    }
}
