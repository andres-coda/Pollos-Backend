import { Mens } from "../enum/Mens.enum";

export const Entidad = {
  "AGUA": "agua",
  "FOCO": "foco",
  "TEMPERATURA": "temperatura",
} as const;

type EntidadType =(typeof Entidad)[keyof typeof Entidad];

export interface Mensaje{
  mensaje:Mens;
  entidad:EntidadType;
  id:string;
}