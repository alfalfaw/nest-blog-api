import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { InjectModel } from 'nestjs-typegoose';
import { TagOfPost } from './operation.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

class TagOfPostDto {
    @ApiProperty({ example: '12345', description: '文章id' })
    @IsNotEmpty({ message: '请填写文章id' })
    post_id: string
    @ApiProperty({ example: '6789', description: '标签id' })
    @IsNotEmpty({ message: '请填写标签id' })
    tag_id: string

}


@Controller('operations')
@ApiTags("文章标签")
export class OperationsController {
    constructor(
        @InjectModel(TagOfPost) private readonly tagOfPostModel: ModelType<TagOfPost>
    ) { }

    @Post('create-tag-of-post')
    @ApiOperation({ summary: '创建文章标签' })
    async create(@Body() tagOfPostDto: TagOfPostDto) {
        await this.tagOfPostModel.create(tagOfPostDto)
        return {
            success: true
        }
    }

    @Delete('delete-tag-of-post/:id')
    @ApiOperation({ summary: '删除文章标签' })
    async remove(@Param('id') id: string) {
        await this.tagOfPostModel.findByIdAndDelete(id)
        return { sucess: true }
    }

    @Get('find-tag-of-post-by-post-id/:id')
    @ApiOperation({ summary: '通过文章id查询文章标签' })
    async findTagOfPostByPostID(@Param('id') id: string) {
        const res=await this.tagOfPostModel.find({'post_id':id})
        res.forEach(it=>{
            console.log(it.tag_id)
        })
    }

    @Get('find-tag-of-post-by-tag-id/:id')
    @ApiOperation({ summary: '通过标签id查询文章标签' })
    async findTagOfPostByTagID(@Param('id') id: string) {
        return await this.tagOfPostModel.find({'tag_id':id})
    }
    
}
