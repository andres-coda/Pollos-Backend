import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete } from '@nestjs/common';
import { LugarService } from './lugar.service';
import { Lugar } from './entity/lugar.entity';
import { LugarDtoCrear } from './dto/lugarDtoCrear.dto';
import { LugarDtoEditar } from './dto/LugarDtoEditar.dto';

@Controller('lugar')
export class LugarController {
  constructor(private readonly clasificacionService: LugarService) { }

  @Get()
  @HttpCode(200)
  async getLugar(
  ): Promise<Lugar[]> {
    return await this.clasificacionService.getLugar();
  }

  @Get(':id')
  @HttpCode(200)
  async getLugarById(
    @Param('id') id: string
  ): Promise<Lugar> {
    const clasificacion: Lugar = await this.clasificacionService.getLugarByIdOrFail(id);
    return clasificacion;
  }

  @Post()
  async createLugar(
    @Body() datos: LugarDtoCrear
  ): Promise<Lugar> {
    return await this.clasificacionService.createLugar(datos);
  }

  @Put('quitar:id')
  async quitarLugar(
    @Param('id') id: string, 
    @Body() datos: LugarDtoEditar
  ): Promise<Lugar> {
    return await this.clasificacionService.quitarElementos(id, datos);
  }

  @Put(':id')
  async updateLugar(
    @Param('id') id: string, 
    @Body() datos: LugarDtoEditar
  ): Promise<Lugar> {
    return await this.clasificacionService.updateLugar(id, datos);
  }


  @Delete(':id')
  async deleteLugar(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.clasificacionService.deleteLugar(id);
  }
}
