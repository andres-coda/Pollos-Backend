import { forwardRef, Module } from '@nestjs/common';
import { LugarController } from './lugar.controller';
import { LugarService } from './lugar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agua } from 'src/agua/entity/agua.entity';
import { Foco } from 'src/foco/entity/foco.entity';
import { Lugar } from './entity/lugar.entity';
import { Temperatura } from 'src/temperatura/entity/temperatura.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { GateWayModule } from 'src/gateway/gateway.module';
import { AguaModule } from 'src/agua/agua.module';
import { FocoModule } from 'src/foco/foco.module';
import { TemperaturaModule } from 'src/temperatura/temperatura.module';

@Module({
  imports: [
        TypeOrmModule.forFeature([
          Agua,
          Foco,
          Lugar,
          Temperatura
        ]),
        forwardRef(() => ErroresModule),
        forwardRef(() => GateWayModule),
        forwardRef(() => AguaModule),
        forwardRef(() => FocoModule),
        forwardRef(() => TemperaturaModule),
      ],
  controllers: [LugarController],
  providers: [LugarService]
})
export class LugarModule {}
