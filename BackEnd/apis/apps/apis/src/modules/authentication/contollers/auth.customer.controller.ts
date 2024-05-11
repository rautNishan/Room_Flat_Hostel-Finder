import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { GoogleProtected } from 'libs/auth/decorators/user-google.decorator';
import { Customer } from 'libs/constant/micro-services-names/micro-services-names.constant';
import { CUSTOMER_TCP } from 'libs/constant/tcp/Customer/customer.tcp.constant';
import { ApiDoc } from 'libs/docs/decorators/doc.decorator';
import { firstValueFrom } from 'rxjs';
import { CustomerLoginDto } from '../dtos/customer.login.dto';
import { FinalCustomerSerialization } from '../serializations/customer.serialization';

@ApiTags('Authentication')
@Controller('auth')
export class AuthCustomerController {
  constructor(
    @Inject(Customer.name) private readonly _customerClient: ClientProxy,
  ) {}

  @Post('/login')
  @ApiDoc({
    operation: 'Customer Login',
    serialization: FinalCustomerSerialization,
    jwtAccessToken: false,
    defaultMessagePath: 'Login Success',
    defaultStatusCode: HttpStatus.OK,
  })
  async login(@Body() incomingData: CustomerLoginDto): Promise<any> {
    try {
      console.log('Request from AnyWhere');
      const token = await firstValueFrom(
        this._customerClient.send(
          { cmd: CUSTOMER_TCP.CUSTOMER_LOGIN },
          incomingData,
        ),
      );
      return { token };
    } catch (error) {
      console.log('🚀 ~ AuthCustomerController ~ login ~ error:', error);
      throw error;
    }
  }

  @Get('/google/login')
  @GoogleProtected()
  async loginWithGoogle() {
    return 'google';
  }

  @Get('/google/redirect')
  @GoogleProtected()
  async handleRedirect() {
    console.log('Handle Redirect Method is Being Called');
    return 'hulk is on google register';
  }
}
