import { IsOptional, IsString, Length } from "class-validator";

export class TemperaturaDtoEditar {

  @IsOptional()
  @IsString()
  @Length(1, 5, { message: 'La temperatura no debe tener mas de 5 caracteres' })
  temperatura?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20, { message: 'la ubicacion no debe tener mas de 20 caracteres' })
  ubicacion?: string;
}