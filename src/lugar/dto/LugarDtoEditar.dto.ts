import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class LugarDtoEditar {

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 20, { message: 'la ubicacion no debe tener mas de 20 caracteres' })
  ubicacion?: string;
}