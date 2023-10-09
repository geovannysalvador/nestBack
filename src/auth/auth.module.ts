import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';



@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // Variables de entorno
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {    
      name:User.name,
      schema: UserSchema,
      }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' },
    }),
  ],
})
export class AuthModule {}
