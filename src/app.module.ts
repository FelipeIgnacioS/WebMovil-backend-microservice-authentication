import { Module } from '@nestjs/common';


import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Profile, Token } from 'src/infrastructure/database/entities'
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // tipo de base de datos
      host: process.env.TYPEORM_HOST, // host de la base de datos
      port: +process.env.TYPEORM_PORT, // puerto
      username: process.env.TYPEORM_USERNAME, // usuario
      password: process.env.TYPEORM_PASSWORD, // contraseña
      database: process.env.TYPEORM_DATABASE, // nombre de la base de datos
      entities: [User, Profile, Token], // entidades que se usarán
      synchronize: false,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}