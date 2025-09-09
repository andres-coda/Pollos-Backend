import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class LugarDtoCrear {

  @IsNotEmpty()
  @IsString()
  @Length(1, 20, { message: 'El nombre no debe tener mas de 20 caracteres' })
  nombre: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}