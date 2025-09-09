import { forwardRef, Module } from '@nestjs/common';
import { FocoController } from './foco.controller';
import { FocoService } from './foco.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foco } from './entity/foco.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { GateWayModule } from 'src/gateway/gateway.module';
import { Lugar } from 'src/lugar/entity/lugar.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([
        Foco,
        Lugar
      ]),
      forwardRef(() => ErroresModule),
      forwardRef(() => GateWayModule),
    ],
  controllers: [FocoController],
  providers: [FocoService],
  exports: [FocoService]
})
export class FocoModule {}
