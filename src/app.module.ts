import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type:"postgres",
      host:"localhost",
      username:"postgres",
      port:5432,
      password:"pawan",
      database:"registration",
      entities:[ User ] ,
      synchronize:true
  }), UsersModule],
 
}) 
export class AppModule {}
