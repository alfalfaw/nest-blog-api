import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'
import { Post as PostSchema } from './post.model'
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Tag } from '../tags/tag.model';
import { Website } from '../website/website.model';

//dto数据传输对象
class CreatePostDto {
    // 定义属性
    @ApiProperty({ example: '标题一', description: '文章标题' })
    @IsNotEmpty({ message: '请填写文章标题' })
    title: string
    @ApiProperty({ example: '描述', description: '文章描述' })
    desc?: string;
    @ApiProperty({ example: '内容一', description: '文章内容' })
    content: string
    @ApiProperty({ example: '<code></code>', description: '文章html' })
    html: string;
    @ApiProperty({ example: '作者', description: '文章作者' })
    author: string
    @ApiProperty({ example: 'jpg', description: '文章封面' })
    cover: string
    @ApiProperty({ example: false, description: '是否发布' })
    publish: boolean
}

class UpdatePostDto {
    @ApiProperty({ example: '标题一', description: '文章标题' })
    @IsNotEmpty({ message: '请填写文章标题' })
    title: string
    @ApiProperty({ example: '描述', description: '文章描述' })
    desc?: string;
    @ApiProperty({ example: '内容一', description: '文章内容' })
    content: string
    @ApiProperty({ example: '<code></code>', description: '文章html' })
    html?: string;
    @ApiProperty({ example: 'jpg', description: '文章封面' })
    cover: string
    @ApiProperty({ example: false, description: '是否发布' })
    publish: boolean
}

@Controller('posts')
@ApiTags('Article')
export class PostsController {
    constructor(
        @InjectModel(PostSchema) private readonly postModel: ModelType<PostSchema>,
        @InjectModel(Tag) private readonly tagModel: ModelType<Tag>,
        @InjectModel(Website) private readonly webModel: ModelType<Website>,
    ) { }

    @Get()
    @ApiOperation({ summary: '显示博客列表' })
    async index(@Query('page') page:string, @Query('limit') limit:string, @Query('sort') sort: string = '-_id', @Query('admin') admin: boolean = false, @Query('where') where) {
        let page_num = null
        let limit_num = null
        let total = null
        let data = null

        if (typeof where === 'undefined') {
            where = {}
        } else {
            where = JSON.parse(where)
        }
        if (!admin) {
            where['publish'] = true
        }

        //符合条件的项目总数postModel.estimatedDocumentCount()不带条件
        total = await this.postModel.countDocuments(where)

        if (typeof limit === 'undefined') {
            data = await this.postModel.find(where)
            return { total: total, data: data }
        }

        page_num = parseInt(page)
        limit_num = parseInt(limit)

        // let sum = await this.postModel.estimatedDocumentCount()

        data = await this.postModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })


        return { total: total, data: data }

    }

    @Post('create')
    @ApiOperation({ summary: '创建文章' })
    async create(@Body() createPostDto: CreatePostDto) {
        await this.webModel.findOneAndUpdate({ active: true }, { last_event: Date() })
        await this.postModel.create(createPostDto);
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '文章详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        await this.webModel.findOneAndUpdate({ active: true }, { $inc: { view: 1 } })
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
    async option() {
        //find()返回数组,v是数组的对象
        const tags = (await this.tagModel.find()).map(v => ({
            label: v.name,
            value: v._id
        }))
        return {
            title: "文章管理",
            //解决avue自动添加属性  translate:false
            translate: false,
            column: [
                { prop: "title", label: "标题", sortable: true, search: true, regex: true, row: true },
                { prop: "desc", label: "描述", sortable: true, row: true },
                { prop: "author", label: "作者", row: true },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "cover", label: "封面", type: 'upload', listType: 'picture-img', row: true, action: 'upload', width: 120 },
                { prop: "tag", label: "标签", type: 'select', dicData: tags, row: true, width: 120 },
                { prop: "publish", label: "是否发布", type: 'switch', row: true, displayAs: 'switch', value: false }

            ]
        }
    }

}
