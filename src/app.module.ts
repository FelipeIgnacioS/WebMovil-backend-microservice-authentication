import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import config from '../ormconfig';
import { AuthModule } from './auth/auth.module';  // Importa el AuthModule

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    AuthModule  
  ],
  providers: [],
})
export class AppModule {}
