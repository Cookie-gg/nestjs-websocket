import { Module } from '@nestjs/common';
import { EventGateway } from '~/gateways/event';

@Module({
  providers: [EventGateway],
})
export class EventsModule {}
