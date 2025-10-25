import { Injectable } from '@nestjs/common';
import { RecipeRepository } from './recipe.repository';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.id = randomUUID();
    recipe.title = createRecipeDto.title;
    recipe.description = createRecipeDto.description;
    recipe.ingredients = createRecipeDto.ingredients;
    recipe.instructions = createRecipeDto.instructions;
    recipe.prepTimeMinutes = createRecipeDto.prepTimeMinutes;
    recipe.cookTimeMinutes = createRecipeDto.cookTimeMinutes;
    recipe.servings = createRecipeDto.servings;

    return await this.recipeRepository.save(recipe);
  }
}
