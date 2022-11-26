import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registrationReqModel } from 'src/models/registration.req.model';
import { Repository } from 'typeorm';
import { User } from './user';
import * as bcrypt from 'bcrypt';
import { RegistrationRespModel } from 'src/models/registration.resp.model';
import { logInModel } from 'src/models/login.model';
import { jwtSign } from 'src/auth/auth';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UsersService {
    jwtSign: any;
    constructor(@InjectRepository(User) private readonly userServer: Repository<User>) { }


    async regitrationValidation(regModel: registrationReqModel) {

        if (!regModel.email) {
            return "This Field Can't Be Empty"
        }

        const emailRule = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!emailRule.test(regModel.email.toLowerCase())) {
            return "Invalid Email"
        }


        const user = await this.userServer.findOne({ where: { email: regModel.email } })
        if (user != null && user.email) {
            return 'Email Already Exist'
        }

        if (regModel.password !== regModel.confirmPassword) {
            return 'Password and Confirm Password are not matched'
        }

        return '';
    }


    async getPasswordHash(Password) {
        const hashPass = await bcrypt.hash(Password, 10)
        // console.log(hashPass,"qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        return hashPass
    }

    async registerUser(regModel: registrationReqModel): Promise<RegistrationRespModel> {
        let result = new RegistrationRespModel()

        const errorMessage = await this.regitrationValidation(regModel)

        if (errorMessage) {
            result.message = errorMessage
            result.successStatus = false

            return result
        }

        let newUser = new User()
        newUser.firstName = regModel.firstName
        newUser.lastName = regModel.lastName
        newUser.email = regModel.email
        newUser.password = await this.getPasswordHash(regModel.password)

        await this.userServer.insert(newUser)
        result.successStatus = true
        result.message = 'Registration successfull'
        return result
    }



    async allRegisteredUser() {
        const dataOfAllUser = await this.userServer.find()
        return await dataOfAllUser
    }


    async loginUser(loginData: logInModel, res, req) {

        const emailRule = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (emailRule.test(loginData.email.toLowerCase())) {

            const userExistence = await this.userServer.findOne({ where: { email: loginData.email } })
            const comparePassword = await bcrypt.compare(loginData.password, userExistence.password)
            console.log(jwtSign.createToken(userExistence.userId), comparePassword);

            if (comparePassword && loginData.email === userExistence.email) {
                const tokenGenerated = jwtSign.createToken(userExistence.userId)
                return res.cookie("userToken", tokenGenerated).send("Logged In Successfully")
            } else {
                return "Invalid Credentials Login Again"
            }

        }

    }


    async profile(req) {
        if (req.headers.cookie) {
            const tokenOfLoggedInUser = req.headers.cookie.split("=")[1]
            const idFromGeneratedTokenOfLoggedInUser = await jwt.verify(tokenOfLoggedInUser, "pawan")
            console.log(idFromGeneratedTokenOfLoggedInUser);

            const dataOfUser = await this.userServer.find({ where: { userId: Number(idFromGeneratedTokenOfLoggedInUser) } })
            req.userData = await dataOfUser
            console.log(req.userData[0]);
            

            return await ((req.userData[0].firstName +" " + req.userData[0].lastName)+ " You are logged in And Your profile is here")
        } else {
            return "You Have To Login First"
        }

    }

}


