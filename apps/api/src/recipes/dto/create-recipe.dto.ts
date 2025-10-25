import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientDto } from './ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  instructions!: string[];

  @IsInt()
  @Min(1)
  prepTimeMinutes!: number;

  @IsInt()
  @Min(1)
  cookTimeMinutes!: number;

  @IsInt()
  @Min(1)
  servings!: number;
}
