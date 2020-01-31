import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'
import { Post as PostSchema } from './post.model'
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
//dto数据传输对象
class CreatePostDto {
    // 定义属性
    @ApiProperty({ example: '标题一', description: '文章标题' })
    @IsNotEmpty({ message: '请填写文章标题' })
    title: string
    @ApiProperty({ example: '内容一', description: '文章内容' })
    content: string
    @ApiProperty({ example: '作者', description: '文章作者' })
    author: string
    @ApiProperty({ example: 'jpg', description: '文章封面' })
    cover: string
}

class UpdatePostDto {
    @ApiProperty({ example: '标题一', description: '文章标题' })
    @IsNotEmpty({ message: '请填写文章标题' })
    title: string
    @ApiProperty({ example: '内容一', description: '文章内容' })
    content: string
    @ApiProperty({ example: 'jpg', description: '文章封面' })
    cover: string
}

@Controller('posts')
@ApiTags('Article')
export class PostsController {
    constructor(
        @InjectModel(PostSchema) private readonly postModel: ModelType<PostSchema>
    ) { }

    @Get()
    @ApiOperation({ summary: '显示博客列表' })
    async index(@Query('page') page: string = '1', @Query('limit') limit: string = '5') {
        let page_num = parseInt(page)
        let limit_num = parseInt(limit)
        let total = await this.postModel.count({})
        let data = await this.postModel.find({}, null, { skip: (page_num - 1) * limit_num, limit: limit_num })
        return { total: total, data: data }
    }

    @Post('create')
    @ApiOperation({ summary: '创建文章' })
    async create(@Body() createPostDto: CreatePostDto) {
        await this.postModel.create(createPostDto);
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '文章详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        await this.postModel.findByIdAndUpdate(id, { $inc: { click_num: 1 } }, { new: true })
        return await this.postModel.findById(id)
    }

    @Put('update/:id')
    @ApiOperation({ summary: '修改文章' })
    async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        await this.postModel.findByIdAndUpdate(id, updatePostDto)
        return {
            success: true
        }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除文章' })
    async remove(@Param('id') id: string) {
        await this.postModel.findByIdAndDelete(id)
        return {
            success: true
        }
    }


    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '文章数据配置' })
    option() {
        return {
            title: "文章管理",
            column: [
                { prop: "title", label: "标题" },
                { prop: "content", label: "内容", type: 'textarea', minRows: 5 },
                { prop: "author", label: "作者" },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false },
                { prop: "cover", label: "封面" }
            ]
        }
    }

}
