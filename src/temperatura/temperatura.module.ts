import { forwardRef, Module } from '@nestjs/common';
import { TemperaturaController } from './temperatura.controller';
import { TemperaturaService } from './temperatura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temperatura } from './entity/temperatura.entity';
import { Lugar } from 'src/lugar/entity/lugar.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { GateWayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
        TypeOrmModule.forFeature([
          Temperatura,
          Lugar
        ]),
        forwardRef(() => ErroresModule),
        forwardRef(() => GateWayModule),
      ],
  controllers: [TemperaturaController],
  providers: [TemperaturaService],
  exports: [TemperaturaService]
})
export class TemperaturaModule {}
