import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { GatewayGateway } from 'src/gateway/gateway.gateway';
import { FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { Agua } from './entity/agua.entity';
import { AguaDtoCrear } from './dto/aguaDtoCrear.dto';
import { Entidad, Mensaje } from 'src/gateway/dto/gatewayDto.dto';
import { Mens } from 'src/gateway/enum/Mens.enum';
import { AguaDtoEditar } from './dto/aguaDtoEditar.dto';

@Injectable()
export class AguaService {
  constructor(
    @InjectRepository(Agua) private readonly aguaRepository: Repository<Agua>,
    private readonly erroresService: ErroresService,
    private readonly gatGateway: GatewayGateway
  ) { }

  async getAgua(): Promise<Agua[]> {
    try {
      const criterio: FindManyOptions = {
        where: {
          deleted: false
        },
        order: {
          nombre: 'ASC'
        }
      }
      const agua: Agua[] = await this.aguaRepository.find(criterio);
      if (!agua) throw new NotFoundException(`No existen datos de agua guardados`);

      return agua;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de agua`)
    }
  }

  async getAguaByIdOrFail(id: string, qR?:QueryRunner): Promise<Agua> {
    try {
      const agua: Agua | null = await this.getAguaById(id, qR);
      if (!agua) throw new NotFoundException(`No se encontro el dato con el id ${id} de agua`);

      return agua;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de agua`)
    }
  }

  async getAguaById(id: string, qR?:QueryRunner): Promise<Agua | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id,
        }
      }
      return qR
      ? await qR.manager.findOne(Agua, criterio)
      : await this.aguaRepository.findOne(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de agua`)
    }
  }

  async getAguaByName(name: string, idUsuario: string, qR?: QueryRunner): Promise<Agua | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          usuario: { id: idUsuario },
          nombre: name,
        }
      }
      return qR
       ? await qR.manager.findOne(Agua, criterio)
       : await this.aguaRepository.findOne(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer la agua ${name}`)
    }
  }

  async createAgua(datos: AguaDtoCrear,qR?: QueryRunner): Promise<Agua> {
    try {
      const agua: Agua = new Agua();
      agua.nombre = datos.nombre;
      agua.estado = datos.estado || false;     

      const newAgua: Agua = qR
        ? await qR.manager.save(Agua, agua)
        : await this.aguaRepository.save(agua);
      if (!newAgua) throw new NotFoundException(`Error al intentar crear el dato ${datos.nombre} en agua`);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.CREAR,
          entidad: Entidad.AGUA,
          id: newAgua.id
        }

        this.gatGateway.actualizacionDato(payload);
      }

      return newAgua;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear el dato ${datos.nombre} en agua`)
    }
  }

  async updateAgua(id: string, datos: AguaDtoEditar, qR?:QueryRunner): Promise<Agua> {
    try {
      const agua: Agua = await this.getAguaByIdOrFail(id, qR);
      agua.estado = datos.estado;

      const newAgua: Agua = qR
        ? await qR.manager.save(Agua, agua)
        : await this.aguaRepository.save(agua);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.EDITAR,
          entidad: Entidad.AGUA,
          id: newAgua.id
        }
        
        this.gatGateway.actualizacionDato(payload);
      }

      return newAgua;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato con ${id} de agua`)
    }
  }

  async deleteAgua(id: string): Promise<boolean> {
    try {
      const agua: Agua = await this.getAguaByIdOrFail(id);
      await this.aguaRepository.remove(agua);

      const payload: Mensaje = {
        mensaje: Mens.ELIMINAR,
        entidad: Entidad.AGUA,
        id: id
      }

      this.gatGateway.actualizacionDato(payload);
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar eliminar el dato con ${id} de agua`)
    }
  }
}