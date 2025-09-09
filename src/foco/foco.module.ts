import { Module } from '@nestjs/common';
import { FocoController } from './foco.controller';
import { FocoService } from './foco.service';

@Module({
  controllers: [FocoController],
  providers: [FocoService]
})
export class FocoModule {}
