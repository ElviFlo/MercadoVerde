import { Module } from '@nestjs/common';
import { GatewayController } from './infrastructure/controllers/gateway.controller';
import { ProxyService } from './application/services/proxy.service';

@Module({
  imports: [],
  controllers: [GatewayController],
  providers: [ProxyService],
})
export class AppModule {}
