import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { GatewayGateway } from 'src/gateway/gateway.gateway';
import { FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { Entidad, Mensaje } from 'src/gateway/dto/gatewayDto.dto';
import { Mens } from 'src/gateway/enum/Mens.enum';
import { Temperatura } from './entity/temperatura.entity';
import { TemperaturaDtoCrear } from './dto/temperaturaDtoCrear.dto';
import { TemperaturaDtoEditar } from './dto/temperaturaDtoEditar.dto';

@Injectable()
export class TemperaturaService {
  constructor(
    @InjectRepository(Temperatura) private readonly temperaturaRepository: Repository<Temperatura>,
    private readonly erroresService: ErroresService,
    private readonly gatGateway: GatewayGateway
  ) { }

  async getTemperatura(): Promise<Temperatura[]> {
    try {
      const criterio: FindManyOptions = {
        order: {
          nombre: 'ASC'
        }
      }
      const temperatura: Temperatura[] = await this.temperaturaRepository.find(criterio);
      if (!temperatura) throw new NotFoundException(`No existen datos de temperatura guardados`);

      return temperatura;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de temperatura`)
    }
  }

  async getTemperaturaByIdOrFail(id: string, qR?:QueryRunner): Promise<Temperatura> {
    try {
      const temperatura: Temperatura | null = await this.getTemperaturaById(id, qR);
      if (!temperatura) throw new NotFoundException(`No se encontro el dato con el id ${id} de temperatura`);

      return temperatura;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de temperatura`)
    }
  }

  async getTemperaturaById(id: string, qR?:QueryRunner): Promise<Temperatura | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id,
        }
      }
      return qR
      ? await qR.manager.findOne(Temperatura, criterio)
      : await this.temperaturaRepository.findOne(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de temperatura`)
    }
  }

    async createTemperatura(datos: TemperaturaDtoCrear,qR?: QueryRunner): Promise<Temperatura> {
    try {
      const temperatura: Temperatura = new Temperatura();
      temperatura.nombre = datos.nombre;
      temperatura.temperatura = datos.temperatura;     

      const newTemperatura: Temperatura = qR
        ? await qR.manager.save(Temperatura, temperatura)
        : await this.temperaturaRepository.save(temperatura);
      if (!newTemperatura) throw new NotFoundException(`Error al intentar crear el dato ${datos.nombre} en temperatura`);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.CREAR,
          entidad: Entidad.TEMPERATURA,
          id: newTemperatura.id
        }

        this.gatGateway.actualizacionDato(payload);
      }

      return newTemperatura;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear el dato ${datos.nombre} en temperatura`)
    }
  }

  async updateTemperatura(id: string, datos: TemperaturaDtoEditar, qR?:QueryRunner): Promise<Temperatura> {
    try {
      const temperatura: Temperatura = await this.getTemperaturaByIdOrFail(id, qR);
      temperatura.temperatura = datos.temperatura || temperatura.temperatura;

      const newTemperatura: Temperatura = qR
        ? await qR.manager.save(Temperatura, temperatura)
        : await this.temperaturaRepository.save(temperatura);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.EDITAR,
          entidad: Entidad.TEMPERATURA,
          id: newTemperatura.id
        }
        
        this.gatGateway.actualizacionDato(payload);
      }

      return newTemperatura;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato con ${id} de temperatura`)
    }
  }

  async deleteTemperatura(id: string): Promise<boolean> {
    try {
      const temperatura: Temperatura = await this.getTemperaturaByIdOrFail(id);
      await this.temperaturaRepository.remove(temperatura);

      const payload: Mensaje = {
        mensaje: Mens.ELIMINAR,
        entidad: Entidad.TEMPERATURA,
        id: id
      }

      this.gatGateway.actualizacionDato(payload);
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar eliminar el dato con ${id} de temperatura`)
    }
  }
}