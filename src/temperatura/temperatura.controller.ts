import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete } from '@nestjs/common';
import { TemperaturaService } from './temperatura.service';
import { Temperatura } from './entity/temperatura.entity';
import { TemperaturaDtoCrear } from './dto/temperaturaDtoCrear.dto';
import { TemperaturaDtoEditar } from './dto/temperaturaDtoEditar.dto';

@Controller('temperatura')
export class TemperaturaController {
  constructor(private readonly clasificacionService: TemperaturaService) { }

  @Get()
  @HttpCode(200)
  async getTemperatura(
  ): Promise<Temperatura[]> {
    return await this.clasificacionService.getTemperatura();
  }

  @Get(':id')
  @HttpCode(200)
  async getTemperaturaById(
    @Param('id') id: string
  ): Promise<Temperatura> {
    const clasificacion: Temperatura = await this.clasificacionService.getTemperaturaByIdOrFail(id);
    return clasificacion;
  }

  @Post()
  async createTemperatura(
    @Body() datos: TemperaturaDtoCrear
  ): Promise<Temperatura> {
    return await this.clasificacionService.createTemperatura(datos);
  }

  @Put(':id')
  async updateTemperatura(
    @Param('id') id: string, 
    @Body() datos: TemperaturaDtoEditar
  ): Promise<Temperatura> {
    return await this.clasificacionService.updateTemperatura(id, datos);
  }

  @Delete(':id')
  async deleteTemperatura(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.clasificacionService.deleteTemperatura(id);
  }
}