import { Controller, Get, Query, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';


class UserDto {
    @ApiProperty({ example: 'zyu', description: '用户名' })
    username: string
    @ApiProperty({ example: '123', description: '密码' })
    password: string
    @ApiProperty({ example: '123@gmail.com', description: '邮箱' })
    email: string
    @ApiProperty({ example: false, description: '是否为管理员' })
    @IsNotEmpty({ message: '是否为管理员' })
    admin: boolean
    //头像
    @ApiProperty({ example: 'img', description: '网站头像' })
    avater: string

}


@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(@InjectModel(User) private readonly userModel: ModelType<User>) { }
    @Get()
    @ApiOperation({ summary: '用户列表' })
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
        total = await this.userModel.countDocuments(where)
        // global.console.log('tags count   '+total)

        if (typeof limit === 'undefined') {
            data = await this.userModel.find()
            return { total: total, data: data }
        }
        //分页查询
        page_num = parseInt(page)
        // global.console.log(page_num)
        limit_num = parseInt(limit)

        data = await this.userModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })

        return { total: total, data: data }

    }

    @Post('create')
    @ApiOperation({ summary: '创建用户' })
    async create(@Body() createUserDto: UserDto) {
        await this.userModel.create(createUserDto)
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '用户详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        return await this.userModel.findById(id)
    }

    @Put('update/:id')
    @ApiOperation({ summary: '修改用户' })
    async update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
        await this.userModel.findByIdAndUpdate(id, updateUserDto)
        return { success: true }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除用户' })
    async remove(@Param('id') id: string) {
        await this.userModel.findByIdAndDelete(id)
        return { success: true }
    }

    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '用户数据配置' })
    option() {
        return {
            title: "用户管理",
            column: [
                { prop: "username", label: "用户名", sortable: true, search: true, row: true , regex: true,},
                { prop: "avater", label: "头像", type: 'upload', listType: 'picture-img', row: true, action: 'upload', width: 120 },
                { prop: "password", label: "密码", row: true },
                { prop: "email", label: "邮箱", row: true },
                { prop: "admin", label: "是否为管理员", type: 'switch', row: true, displayAs: 'switch', value: false },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" }
            ]
        }
    }


}
