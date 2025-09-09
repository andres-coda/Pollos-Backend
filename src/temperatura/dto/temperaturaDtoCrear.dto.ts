import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class TemperaturaDtoCrear {

  @IsNotEmpty()
  @IsString()
  @Length(1, 20, { message: 'El nombre no debe tener mas de 20 caracteres' })
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 5, { message: 'La temperatura no debe tener mas de 5 caracteres' })
  temperatura: string;
}