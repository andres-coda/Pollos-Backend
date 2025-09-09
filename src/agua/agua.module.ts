import { forwardRef, Module } from '@nestjs/common';
import { AguaController } from './agua.controller';
import { AguaService } from './agua.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErroresModule } from 'src/errores/errores.module';
import { GateWayModule } from 'src/gateway/gateway.module';
import { Agua } from './entity/agua.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agua
    ]),
    forwardRef(() => ErroresModule),
    forwardRef(() => GateWayModule),
  ],
  controllers: [AguaController],
  providers: [AguaService]
})
export class AguaModule {}
