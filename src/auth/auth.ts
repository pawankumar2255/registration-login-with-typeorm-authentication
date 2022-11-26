import { Injectable, Req, Res, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class jwtSign {
    static verify: any;
    

    static createToken(userId) {
        return jwt.sign(userId, "pawan")
    }

   
}