import { Lugar } from "src/lugar/entity/lugar.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('foco')
export class Foco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column()
  estado:boolean;

  @ManyToOne(()=>Lugar, lugar=> lugar.foco)
    lugar:Lugar;
}