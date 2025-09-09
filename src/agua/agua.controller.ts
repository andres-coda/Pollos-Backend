import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete } from '@nestjs/common';
import { AguaService } from './agua.service';
import { Agua } from './entity/agua.entity';
import { AguaDtoCrear } from './dto/aguaDtoCrear.dto';
import { AguaDtoEditar } from './dto/aguaDtoEditar.dto';

@Controller('agua')
export class AguaController {
  constructor(private readonly clasificacionService: AguaService) { }

  @Get()
  @HttpCode(200)
  async getAgua(
  ): Promise<Agua[]> {
    return await this.clasificacionService.getAgua();
  }

  @Get(':id')
  @HttpCode(200)
  async getAguaById(
    @Param('id') id: string
  ): Promise<Agua> {
    const clasificacion: Agua = await this.clasificacionService.getAguaByIdOrFail(id);
    return clasificacion;
  }

  @Post()
  async createAgua(
    @Body() datos: AguaDtoCrear
  ): Promise<Agua> {
    return await this.clasificacionService.createAgua(datos);
  }

  @Put(':id')
  async updateAgua(
    @Param('id') id: string, 
    @Body() datos: AguaDtoEditar
  ): Promise<Agua> {
    return await this.clasificacionService.updateAgua(id, datos);
  }

  @Delete(':id')
  async deleteAgua(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.clasificacionService.deleteAgua(id);
  }
}