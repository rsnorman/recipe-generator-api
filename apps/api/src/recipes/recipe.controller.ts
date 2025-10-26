import { Controller, Post, Body } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './entities/recipe.entity';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return await this.recipeService.create(createRecipeDto);
  }
}
