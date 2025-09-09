import { IsBoolean, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class LugarDtoEditar {

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 20, { message: 'la ubicacion no debe tener mas de 20 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsUUID()
  foco?:string;

  @IsOptional()
  @IsUUID()
  agua?:string;

  @IsOptional()
  @IsUUID()
  temperatura?:string;
}