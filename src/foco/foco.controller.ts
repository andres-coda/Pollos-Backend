import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete } from '@nestjs/common';
import { FocoService } from './foco.service';
import { Foco } from './entity/foco.entity';
import { FocoDtoCrear } from './dto/focoDtoCrear.dto';
import { FocoDtoEditar } from './dto/focoDtoEditar.dto';

@Controller('foco')
export class FocoController {
  constructor(private readonly clasificacionService: FocoService) { }

  @Get()
  @HttpCode(200)
  async getFoco(
  ): Promise<Foco[]> {
    return await this.clasificacionService.getFoco();
  }

  @Get(':id')
  @HttpCode(200)
  async getFocoById(
    @Param('id') id: string
  ): Promise<Foco> {
    const clasificacion: Foco = await this.clasificacionService.getFocoByIdOrFail(id);
    return clasificacion;
  }

  @Post()
  async createFoco(
    @Body() datos: FocoDtoCrear
  ): Promise<Foco> {
    return await this.clasificacionService.createFoco(datos);
  }

  @Put(':id')
  async updateFoco(
    @Param('id') id: string, 
    @Body() datos: FocoDtoEditar
  ): Promise<Foco> {
    return await this.clasificacionService.updateFoco(id, datos);
  }

  @Delete(':id')
  async deleteFoco(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.clasificacionService.deleteFoco(id);
  }
}