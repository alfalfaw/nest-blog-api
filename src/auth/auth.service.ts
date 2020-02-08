import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../users/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private readonly userModel: ModelType<User>, private readonly jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username: username, password: password })
        return user
    }
    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}