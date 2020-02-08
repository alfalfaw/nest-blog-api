import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express"
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly authService: AuthService) { }

  //无需jwt就能访问
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  @ApiOperation({ summary: '登陆' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  //需要用jwt才能访问的api,用 @UseGuards(AuthGuard('jwt'))标注
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: '获取用户资料' })
  getProfile(@Request() req) {
    return req.user;
  }

  //使用拦截器file是数据名
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiOperation({ summary: '上传图片' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile('file') file) {
    // global.console.log(file)
    return file
    //http://localhost:5000/upload

  }




}
