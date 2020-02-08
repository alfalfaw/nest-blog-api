import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Website } from './website.model';
import { IsNotEmpty } from 'class-validator';
import { Post as PostSchema } from '../posts/post.model'
import { Tag } from '../tags/tag.model';


class WebsiteDto {
    @ApiProperty({ example: '10000', description: '点击次数' })
    view: number
    @ApiProperty({ example: '签名', description: '网站签名' })
    signature: string
    @ApiProperty({ example: '海的彼方', description: '站点名称' })
    sitename: string
    @ApiProperty({ example: false, description: '是否启用' })
    @IsNotEmpty({ message: '是否启用该配置' })
    active: boolean

    //建站时间
    @ApiProperty({ example: '2020-10-11', description: '建站时间' })
    established: Date
    //联系方式
    @ApiProperty({ example: '2092268387@qq.com', description: '联系方式' })
    contacts: []
    //大事件
    @ApiProperty({ example: '网站建立', description: '网站大事件' })
    milestones: []


    //最后活动
    @ApiProperty({ example: '2020-10-11', description: '最近一次活动时间' })
    last_event: Date

    //后台登陆密码
    @ApiProperty({ example: '1234', description: '站点密码' })
    password: string

    //头像
    @ApiProperty({ example: 'img', description: '网站头像' })
    avater: string

    //logo
    @ApiProperty({ example: 'img', description: '网站logo' })
    logo: string

}


@Controller('website')
@ApiTags('Website')
export class WebsiteController {

    constructor(@InjectModel(Website) private readonly webModel: ModelType<Website>, @InjectModel(PostSchema) private readonly postModel: ModelType<PostSchema>, @InjectModel(Tag) private readonly tagModel: ModelType<Tag>) { }
    @Get()
    @ApiOperation({ summary: '网站数据' })
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
        total = await this.webModel.countDocuments(where)
        // global.console.log('tags count   '+total)

        if (typeof limit === 'undefined') {
            data = await this.webModel.find(where)
            return { total: total, data: data }
        }
        //分页查询
        page_num = parseInt(page)
        // global.console.log(page_num)
        limit_num = parseInt(limit)

        data = await this.webModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })

        return { total: total, data: data }

    }

    @Post('/create')
    @ApiOperation({ summary: '创建网站数据' })
    async create(@Body() createWebDto: WebsiteDto) {
        let old = null
        if (createWebDto.active) {
            // update({ 'arrTest.userId': '测试' }, { $set: { 'arrTest.$[].name': '6' } }).exec();
            //更新旧数据
            //condition update  option:new=true返回新数据,callback
            old = await this.webModel.findOneAndUpdate({ active: true }, { active: false })
            if (old != null) {
                createWebDto.view = old.view
                createWebDto.last_event = old.last_event

                if (!createWebDto.established) {
                    createWebDto.established = old.established
                }

                if (!createWebDto.sitename) {
                    createWebDto.sitename = old.sitename
                }
                if (createWebDto.milestones.length == 0) {
                    createWebDto.milestones = old.milestones
                }

                if (createWebDto.contacts.length == 0) {
                    createWebDto.contacts = old.contacts
                }
                if (!createWebDto.password) {
                    createWebDto.password = old.password
                }
                if (!createWebDto.avater) {
                    createWebDto.avater = old.avater
                }
                if (!createWebDto.logo) {
                    createWebDto.logo = old.logo
                }

            }
            // this.webModel.updateMany({ active: true }, { active: false }, function (err, docs) {
            //   if (err) global.console.log(err);
            //   // global.console.log('更改成功：' + docs);
            // })
        }
        await this.webModel.create(createWebDto)
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '网站数据详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        return await this.webModel.findById(id)
    }

    @Put('update/:id')
    @ApiOperation({ summary: '修改网站数据' })
    async update(@Param('id') id: string, @Body() updateWebDto: WebsiteDto) {
        let old = null
        if (updateWebDto.active) {
            old = await this.webModel.findOneAndUpdate({ active: true }, { active: false })
            if (old != null) {
                updateWebDto.view = old.view
                updateWebDto.last_event = old.last_event

                if (!updateWebDto.established) {
                    updateWebDto.established = old.established
                }
                if (!updateWebDto.sitename) {
                    updateWebDto.sitename = old.sitename
                }
                if (updateWebDto.milestones.length == 0) {
                    updateWebDto.milestones = old.milestones
                }

                if (updateWebDto.contacts.length == 0) {
                    updateWebDto.contacts = old.contacts
                }
                if (!updateWebDto.password) {
                    updateWebDto.password = old.password
                }
                if (!updateWebDto.avater) {
                    updateWebDto.avater = old.avater
                }
                if (!updateWebDto.logo) {
                    updateWebDto.logo = old.logo
                }
            }

        } else {
            old = await this.webModel.findOne({ active: true })
            if (old._id == id) {
                updateWebDto.active = true
            }

        }
        await this.webModel.findByIdAndUpdate(id, updateWebDto)
        return { success: true }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除网站数据' })
    async remove(@Param('id') id: string) {
        const res = await this.webModel.findById(id)
        if (res.active) {
            return { success: false }
        }
        await this.webModel.findByIdAndDelete(id)
        return { success: true }
    }

    @Get('view')
    @ApiOperation({ summary: '增加网站点击量' })
    async view() {
        await this.webModel.findOneAndUpdate({ active: true }, { $inc: { view: 1 } })
        return { success: true }
    }
    //关于页面
    @Get('about')
    @ApiOperation({ summary: '关于' })
    async about() {
        return await this.webModel.findOne({ active: true })

    }


    //侧栏信息
    @Get('info')
    @ApiOperation({ summary: '网站数据' })
    async info() {
        let info = {}
        info['post_count'] = await this.postModel.estimatedDocumentCount()
        const web_info = await this.webModel.findOne({ active: true })
        info['view_count'] = web_info.view
        //建站
        const X = web_info.established.getTime()
        // 最近活动 如果没有发布文章可能会报错
        let Y = null
        if (web_info.last_event) {
            Y = web_info.last_event.getTime()
        }
        else {
            Y = (new Date()).getTime()
        }
        const Z = (new Date()).getTime()
        info['latest_posts'] = await this.postModel.find({ publish: true }).limit(5).sort({ createdAt: -1 })
        info['random_posts'] = await this.postModel.find({ publish: true }).limit(5)
        info['hot_posts'] = await this.postModel.find({ publish: true }).limit(5).sort({ view: -1 })

        info['run_day'] = Math.floor((Z - X) / (1000 * 86400))
        info['last_event'] = Math.floor((Z - Y) / (1000 * 86400))
        info['tags'] = await this.tagModel.find()
        info['avater'] = web_info.avater
        info['logo'] = web_info.logo
        return info

    }
    //验证登陆密码
    @Post('login')
    @ApiOperation({ summary: '站点登陆' })
    //获取参数
    async login(@Body() loginForm) {
        const res = await this.webModel.findOne({ active: true })

        if (res.password === loginForm.password) {
            return { success: true, href: 'http://localhost:8092/' }
        }
        return { success: false }
    }


    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '网站数据配置' })
    option() {
        return {
            title: "网站数据管理",
            column: [
                { prop: "sitename", label: "站点名称", row: true },
                { prop: "signature", label: "签名", row: true },
                { prop: "password", label: "站点密码", row: true },
                { prop: "view", label: "点击", row: true, editDisplay: false, addDisplay: false, value: 0 },
                //value用于设置默认值
                { prop: "active", label: "是否启用", type: 'switch', row: true, displayAs: 'switch', value: false },

                { prop: "established", label: "建站时间", type: 'date', row: true, format: "yyyy-MM-dd" },

                { prop: "contacts", label: "联系方式", row: true, type: 'array' },
                { prop: "milestones", label: "大事件", row: true, type: 'array' },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "last_event", label: "最后活动时间", type: 'date', row: true, format: "yyyy-MM-dd" },
                { prop: "avater", label: "头像", type: 'upload', listType: 'picture-img', row: true, action: 'upload', width: 120 },
                { prop: "logo", label: "logo", type: 'upload', listType: 'picture-img', row: true, action: 'upload', width: 120 },

            ]
        }
    }


}
