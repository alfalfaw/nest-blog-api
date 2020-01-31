import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
    async index() {
        return await this.pictureModel.find()
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
                { prop: "owner", label: "归属" },
                { prop: "desc", label: "描述", type: 'textarea', minRows: 5 },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false },
                { prop: "url", label: "图片链接" }
            ]
        }
    }
}
