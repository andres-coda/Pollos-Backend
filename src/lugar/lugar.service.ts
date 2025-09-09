import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { GatewayGateway } from 'src/gateway/gateway.gateway';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { Entidad, Mensaje } from 'src/gateway/dto/gatewayDto.dto';
import { Mens } from 'src/gateway/enum/Mens.enum';
import { Lugar } from './entity/lugar.entity';
import { AguaService } from 'src/agua/agua.service';
import { FocoService } from 'src/foco/foco.service';
import { TemperaturaService } from 'src/temperatura/temperatura.service';
import { LugarDtoCrear } from './dto/lugarDtoCrear.dto';
import { LugarDtoEditar } from './dto/LugarDtoEditar.dto';
import { Temperatura } from 'src/temperatura/entity/temperatura.entity';
import { Agua } from 'src/agua/entity/agua.entity';
import { Foco } from 'src/foco/entity/foco.entity';

@Injectable()
export class LugarService {
  constructor(
    @InjectRepository(Lugar) private readonly lugarRepository: Repository<Lugar>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly gatGateway: GatewayGateway,
    private readonly aguaService: AguaService,
    private readonly focoService: FocoService,
    private readonly TempService: TemperaturaService,
  ) { }

  async getLugar(): Promise<Lugar[]> {
    try {
      const criterio: FindManyOptions = {
        relations:['foco','agua','temp'],
        order: {
          nombre: 'ASC'
        }
      }
      const lugar: Lugar[] = await this.lugarRepository.find(criterio);
      if (!lugar) throw new NotFoundException(`No existen datos de lugar guardados`);

      return lugar;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de lugar`)
    }
  }

  async getLugarByIdOrFail(id: string, qR?: QueryRunner): Promise<Lugar> {
    try {
      const lugar: Lugar | null = await this.getLugarById(id, qR);
      if (!lugar) throw new NotFoundException(`No se encontro el dato con el id ${id} de lugar`);

      return lugar;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de lugar`)
    }
  }

  async getLugarById(id: string, qR?: QueryRunner): Promise<Lugar | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id,
        }
      }
      return qR
        ? await qR.manager.findOne(Lugar, criterio)
        : await this.lugarRepository.findOne(criterio);
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer el dato con id ${id} de lugar`)
    }
  }

  async createLugar(datos: LugarDtoCrear, qR?: QueryRunner): Promise<Lugar> {
    try {
      const lugar: Lugar = new Lugar();
      lugar.nombre = datos.nombre;
      lugar.estado = datos.estado || false;

      const newLugar: Lugar = qR
        ? await qR.manager.save(Lugar, lugar)
        : await this.lugarRepository.save(lugar);
      if (!newLugar) throw new NotFoundException(`Error al intentar crear el dato ${datos.nombre} en lugar`);

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.CREAR,
          entidad: Entidad.FOCO,
          id: newLugar.id
        }

        this.gatGateway.actualizacionDato(payload);
      }

      return newLugar;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear el dato ${datos.nombre} en lugar`)
    }
  }

  async updateLugar(id: string, datos: LugarDtoEditar): Promise<Lugar> {
    const qR: QueryRunner = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      const lugar: Lugar = await this.getLugarByIdOrFail(id, qR);
      const agua: Agua | undefined = datos.agua ? await this.aguaService.getAguaByIdOrFail(datos.agua, qR) : undefined;
      const foco: Foco | undefined = datos.foco ? await this.focoService.getFocoByIdOrFail(datos.foco, qR) : undefined;
      const temp: Temperatura | undefined = datos.temperatura ? await this.TempService.getTemperaturaByIdOrFail(datos.temperatura, qR) : undefined;

      lugar.estado = datos.estado || lugar.estado;
      if (agua) lugar.agua.push(agua);
      if (foco) lugar.foco.push(foco);
      if (temp) lugar.temp = temp;

      const newLugar: Lugar = await qR.manager.save(Lugar, lugar)

      await qR.commitTransaction();

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.EDITAR,
          entidad: Entidad.FOCO,
          id: newLugar.id
        }

        this.gatGateway.actualizacionDato(payload);
      }

      return newLugar;
    } catch (error) {
      await qR.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato con ${id} de lugar`)
    } finally {
      await qR.release();
    }
  }

  async quitarElementos(id: string, datos: LugarDtoEditar): Promise<Lugar> {
    const qR: QueryRunner = this.dataSource.createQueryRunner();
    await qR.connect();
    await qR.startTransaction();
    try {
      const lugar: Lugar = await this.getLugarByIdOrFail(id, qR);
      const agua: Agua | undefined = datos.agua ? await this.aguaService.getAguaByIdOrFail(datos.agua, qR) : undefined;
      const foco: Foco | undefined = datos.foco ? await this.focoService.getFocoByIdOrFail(datos.foco, qR) : undefined;
      const temp: Temperatura | undefined = datos.temperatura ? await this.TempService.getTemperaturaByIdOrFail(datos.temperatura, qR) : undefined;

      lugar.estado = datos.estado || lugar.estado;
      if (agua) lugar.agua = lugar.agua.filter(a=>a.id != agua.id);
      if (foco) lugar.foco = lugar.foco.filter(f=>f.id != foco.id);
      if (temp) lugar.temp = temp;

      const newLugar: Lugar = await qR.manager.save(Lugar, lugar)

      await qR.commitTransaction();

      if (!qR) {
        const payload: Mensaje = {
          mensaje: Mens.EDITAR,
          entidad: Entidad.FOCO,
          id: newLugar.id
        }

        this.gatGateway.actualizacionDato(payload);
      }

      return newLugar;
    } catch (error) {
      await qR.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato con ${id} de lugar`)
    } finally {
      await qR.release();
    }
  }

  async deleteLugar(id: string): Promise<boolean> {
    try {
      const lugar: Lugar = await this.getLugarByIdOrFail(id);
      await this.lugarRepository.remove(lugar);

      const payload: Mensaje = {
        mensaje: Mens.ELIMINAR,
        entidad: Entidad.FOCO,
        id: id
      }

      this.gatGateway.actualizacionDato(payload);
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar eliminar el dato con ${id} de lugar`)
    }
  }
}