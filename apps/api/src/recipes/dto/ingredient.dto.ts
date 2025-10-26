import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;
}
