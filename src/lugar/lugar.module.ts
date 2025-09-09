import { Module } from '@nestjs/common';
import { LugarController } from './lugar.controller';
import { LugarService } from './lugar.service';

@Module({
  controllers: [LugarController],
  providers: [LugarService]
})
export class LugarModule {}
