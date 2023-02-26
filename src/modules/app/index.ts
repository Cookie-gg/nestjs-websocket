import { Module } from '@nestjs/common';
import { EventsModule } from '~/modules/event';

@Module({
  imports: [EventsModule],
})
export class AppModule {}
