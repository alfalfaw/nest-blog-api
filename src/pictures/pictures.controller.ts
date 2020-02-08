import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'
import { Picture } from './picture.model'
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

//dto数据传输对象
class PictureDto {
    // 定义属性
    @ApiProperty({ example: 'yaya', description: '归属' })
    @IsNotEmpty({ message: '请填写归属' })
    owner: string
    @ApiProperty({ example: '描述', description: '图片描述' })
    desc: string
    @ApiProperty({ example: 'http:', description: '图片url' })
    url: string
}

@Controller('pictures')
@ApiTags('Pictures')
export class PicturesController {
    constructor(
        @InjectModel(Picture) private readonly pictureModel: ModelType<Picture>
    ) { }

    @Get()
    @ApiOperation({ summary: '显示图片列表' })
    async index(@Query('page') page:string, @Query('limit') limit:string, @Query('sort') sort: string = '-_id', @Query('where') where) {
        let page_num = null
        let limit_num = null
        let total = null
        let data = null

        if (typeof where === 'undefined') {
            where = {}
        } else {
            where = JSON.parse(where)
        }

        //符合条件的项目总数postModel.estimatedDocumentCount()不带条件
        total = await this.pictureModel.countDocuments(where)

        if (typeof limit === 'undefined') {
            data = await this.pictureModel.find(where)
            return { total: total, data: data }
        }

        page_num = parseInt(page)
        limit_num = parseInt(limit)

        // let sum = await this.postModel.estimatedDocumentCount()

        data = await this.pictureModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })


        return { total: total, data: data }

    }

    @Post('create')
    @ApiOperation({ summary: '创建图片' })
    async create(@Body() createPictureDto: PictureDto) {
        await this.pictureModel.create(createPictureDto);
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '图片详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        return await this.pictureModel.findById(id)
    }

    @Put('update/:id')
    @ApiOperation({ summary: '修改图片信息' })
    async update(@Param('id') id: string, @Body() updatePictureDto: PictureDto) {
        await this.pictureModel.findByIdAndUpdate(id, updatePictureDto)
        return {
            success: true
        }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除图片' })
    async remove(@Param('id') id: string) {
        await this.pictureModel.findByIdAndDelete(id)
        return {
            success: true
        }
    }


    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '图片数据配置' })
    option() {
        return {
            title: "图片管理",
            column: [
                { prop: "owner", label: "归属", search: true, row: true },
                { prop: "desc", label: "描述", type: 'textarea', minRows: 5, row: true, span: 24 },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "url", label: "图片链接", type: 'upload', listType: 'picture-img', row: true, action: 'website/upload', width: 120 }
            ]
        }
    }
}
