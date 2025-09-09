import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { GatewayGateway } from 'src/gateway/gateway.gateway';
import { FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { Entidad, Mensaje } from 'src/gateway/dto/gatewayDto.dto';
import { Mens } from 'src/gateway/enum/Mens.enum';
import { Foco } from './entity/foco.entity';
import { FocoDtoCrear } from './dto/focoDtoCrear.dto';
import { FocoDtoEditar } from './dto/focoDtoEditar.dto';

@Injectable()
export class FocoService {
  constructor(
    @InjectRepository(Foco) private readonly focoRepository: Repository<Foco>,
    private readonly erroresService: ErroresService,
    private readonly gatGateway: GatewayGateway
  ) { }

  async getFoco(): Promise<Foco[]> {
    try {
      const criterio: FindManyOptions = {
        order: {
          nombre: 'ASC'
        }
      }
      const foco: Foco[] = await this.focoRepository.find(criterio);
      if (!foco) throw new NotFoundException(`No existen datos de foco guardados`);

      return foco;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de foco`)
    }
  }

  async getFocoByIdOrFail(id: string, qR?:QueryRunner): Promise<Foco> {
    try {
      const foco: Foco | null = await this.getFocoById(id, qR);
      if (!foco) throw new NotFoundException(`No se encontro el dato con el id ${id} de foco`);

      return foco;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de foco`)
    }
  }

  async getFocoById(id: string, qR?:QueryRunner): Promise<Foco | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id,
        }
      }
      return qR
      ? await qR.manager.findOne(Foco, criterio)
      : await this.focoRepository.findOne(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de foco`)
    }
  }

    async createFoco(datos: FocoDtoCrear,qR?: QueryRunner): Promise<Foco> {
    try {
      const foco: Foco = new Foco();
      foco.nombre = datos.nombre;
      foco.estado = datos.estado || false;     

      const newFoco: Foco = qR
        ? await qR.manager.save(Foco, foco)
        : await this.focoRepository.save(foco);
      if (!newFoco) throw new NotFoundException(`Error al intentar crear el dato ${datos.nombre} en foco`);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.CREAR,
          entidad: Entidad.FOCO,
          id: newFoco.id
        }

        this.gatGateway.actualizacionDato(payload);
      }

      return newFoco;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear el dato ${datos.nombre} en foco`)
    }
  }

  async updateFoco(id: string, datos: FocoDtoEditar, qR?:QueryRunner): Promise<Foco> {
    try {
      const foco: Foco = await this.getFocoByIdOrFail(id, qR);
      foco.estado = datos.estado || foco.estado;
      foco.lugar = foco.lugar;

      const newFoco: Foco = qR
        ? await qR.manager.save(Foco, foco)
        : await this.focoRepository.save(foco);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.EDITAR,
          entidad: Entidad.FOCO,
          id: newFoco.id
        }
        
        this.gatGateway.actualizacionDato(payload);
      }

      return newFoco;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato con ${id} de foco`)
    }
  }

  async deleteFoco(id: string): Promise<boolean> {
    try {
      const foco: Foco = await this.getFocoByIdOrFail(id);
      await this.focoRepository.remove(foco);

      const payload: Mensaje = {
        mensaje: Mens.ELIMINAR,
        entidad: Entidad.FOCO,
        id: id
      }

      this.gatGateway.actualizacionDato(payload);
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar eliminar el dato con ${id} de foco`)
    }
  }
}