import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { ADMIN_TCP } from 'libs/constant/tcp/admin/admin.tcp.constant';
import { firstValueFrom } from 'rxjs';
import { AdminLoginDto } from '../dtos/admin.login.dto';
import { Admin } from 'libs/constant/micro-services-names/micro-services-names.constant';
import { ApiDoc } from 'libs/docs/decorators/doc.decorator';
import { FinalAdminSerialization } from '../serializations/admin.serialization';

@ApiTags('Authentication')
@Controller('auth')
export class AuthAdminController {
  constructor(@Inject(Admin.name) private readonly _adminClient: ClientProxy) {}

  @Post('/login')
  @ApiDoc({
    operation: 'Admin Login',
    serialization: FinalAdminSerialization,
    jwtAccessToken: false,
    defaultMessagePath: 'Login Success',
    defaultStatusCode: HttpStatus.OK,
  })
  async login(@Body() body: AdminLoginDto): Promise<any> {
    try {
      const token = await firstValueFrom(
        this._adminClient.send(
          {
            cmd: ADMIN_TCP.ADMIN_LOGIN,
          },
          body,
        ),
      );
      return { token };
    } catch (error) {
      console.log('🚀 ~ AuthAdminController ~ login ~ error:', error);
      throw error;
    }
  }
}
