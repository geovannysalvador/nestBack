import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from "bcryptjs";

// Del index para mejorar el codigo
import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto} from './dto';


import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';




@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ){}


  async create(createUserDto: CreateUserDto):Promise<User> {
    console.log(createUserDto)

    // crear usuario. Funciona pero en bruto
    // const newUser = new this.userModel(createUserDto);
    // return newUser.save();

    try {
      
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        // 1 encriptar la contraseña con desestructuracion
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      // 1 Guardar el usuario
      await newUser.save();
      // mostrar toda la info sin mostrar el password por que no es necesario
      const { password:_, ...user } = newUser.toJSON();

      return user;

      // 1 Generar el JWT
      // Eso en la autenticacion de usuario

    } catch (error) {
      if (error.code === 11000){
        throw new BadRequestException(`${ createUserDto.email} ya existe `)
      }

      throw new InternalServerErrorException('No se logro insertar el nuevo registro')
    }
  }

  async register( registerDto:RegisterUserDto ):Promise<LoginResponse>{

    const user = await this.create(registerDto)
    console.log({user});

    return{
      user: user,
      token: this.getJwToken({ id:user._id })
    }
  }

  async login(loginDto:LoginDto):Promise<LoginResponse>  {

    const {email, password} = loginDto;

    // Ver si existe el usuario
    const user = await this.userModel.findOne({email});
    if ( !user ){
      throw new UnauthorizedException('Correo no valido')
    }
    if( !bcryptjs.compareSync(password, user.password) ){
      throw new UnauthorizedException('contraseña no valida')
    }

    // return 'Iniciaste sesion'

    const { password:_, ...rest} = user.toJSON();
    return{
      user: rest,
      // token: 'Lo que sea aun'
      token: this.getJwToken({ id: user.id }),
    }
  }

  getJwToken( payload:JwtPayload ){
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
