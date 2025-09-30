import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {
  @Get('health')
  checkHealth() {
    return {
      status: 'ok',
      message: 'Gateway funcionando 🚀',
    };
  }
}
