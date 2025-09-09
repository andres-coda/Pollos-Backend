import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocoModule } from './foco/foco.module';
import { AguaModule } from './agua/agua.module';
import { TemperaturaModule } from './temperatura/temperatura.module';
import { ErroresModule } from './errores/errores.module';
import { LugarModule } from './lugar/lugar.module';
import { Agua } from './agua/entity/agua.entity';
import { Foco } from './foco/entity/foco.entity';
import { Temperatura } from './temperatura/entity/temperatura.entity';
import { Lugar } from './lugar/entity/lugar.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'pollos',
      ssl: false,
      entities: [
        Agua,
        Foco,
        Temperatura,
        Lugar
      ],
      synchronize: true,
      logging: false,
    }),
    FocoModule,
    AguaModule,
    TemperaturaModule,
    ErroresModule,
    LugarModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
