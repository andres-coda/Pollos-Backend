import { Lugar } from "src/lugar/entity/lugar.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('temperatura')
export class Temperatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 6})
  temperatura: string;

  @OneToOne(()=>Lugar, lugar=> lugar.temp)
  lugar:Lugar;
}