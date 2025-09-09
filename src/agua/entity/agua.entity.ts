import { Lugar } from "src/lugar/entity/lugar.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('agua')
export class Agua {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column()
  estado:boolean;

  @ManyToOne(()=>Lugar, lugar=> lugar.agua)
      lugar:Lugar;

}