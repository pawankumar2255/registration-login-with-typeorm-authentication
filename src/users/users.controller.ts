import { Body, Controller, Get, Next, Post, Req, Res } from '@nestjs/common';
import { verify } from 'crypto';
import { logInModel } from 'src/models/login.model';
import { registrationReqModel } from 'src/models/registration.req.model';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post('register')
    async registerUser(@Body() regData: registrationReqModel) {
        console.log('====================================');
        console.log("yuiughfdsghjkljhgfdsghjklgfsdgh");
        console.log('====================================');
        return await this.userService.registerUser(regData)
    }


    @Get('register')
    async getAllRegisteredUser() {
        return await this.userService.allRegisteredUser()
    }

    @Post('login')
    async userLogin(@Body() userModelForLogin:logInModel, @Res() res, @Req() req){
        return await this.userService.loginUser(userModelForLogin,res,req)
    }

    @Get("profile")
    async userProfile(@Req() req){
        return await this.userService.profile(req)
    }
}
