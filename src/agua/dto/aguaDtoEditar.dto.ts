import { IsBoolean, IsNotEmpty } from "class-validator";

export class AguaDtoEditar {
  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;
}