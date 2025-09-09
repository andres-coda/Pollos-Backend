import { Module } from '@nestjs/common';
import { TemperaturaController } from './temperatura.controller';
import { TemperaturaService } from './temperatura.service';

@Module({
  controllers: [TemperaturaController],
  providers: [TemperaturaService]
})
export class TemperaturaModule {}
