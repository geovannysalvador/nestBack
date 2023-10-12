import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService:AuthService
    ) {}

  async canActivate(context: ExecutionContext,): Promise<boolean>  {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no valido');
    }

    try {

      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          // Aca la variable de entorno
          secret: process.env.JWT_SEED
        }
      );
      
      // Obtener por Id
      const user = await this.authService.findUserById(payload.id);
      // Si no existe el mensje de no exoiste 
      if (!user) throw new UnauthorizedException('El usuario no existe');
      // Si esta activo
      if (!user.isActive) throw new UnauthorizedException('El usuario no esta activo');

      // Si si existe colocar el usuario en la request
      // request['user'] = payload;
      // request['user'] = payload.id;
      request['user'] = user;
      
    } catch (error) {
      throw new UnauthorizedException("Token no autorizado");
    }

    // return Promise.resolve(true); este se uso mientras se creaba en metodo async
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}