import { Agua } from "src/agua/entity/agua.entity";
import { Foco } from "src/foco/entity/foco.entity";
import { Temperatura } from "src/temperatura/entity/temperatura.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('lugar')
export class Lugar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column()
  estado:boolean;

  @OneToMany(()=>Foco, foco=> foco.lugar, {cascade:true})
  foco:Foco[];

  @OneToMany(()=>Agua, agua=> agua.lugar, {cascade:true})
  agua:Agua[];

  @OneToOne(()=>Temperatura, temp=> temp.lugar, {cascade:true})
  @JoinColumn()
  temp:Temperatura;
}