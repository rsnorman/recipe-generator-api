import { Recipe } from './recipe.entity';

describe('Recipe Entity', () => {
  it('should create a recipe with all required fields', () => {
    const recipe = new Recipe();
    recipe.id = 'test-uuid';
    recipe.title = 'Test Recipe';
    recipe.description = 'A delicious test recipe';
    recipe.ingredients = [
      { name: 'Flour', quantity: 2, unit: 'cups' },
      { name: 'Sugar', quantity: 1, unit: 'cup' },
    ];
    recipe.instructions = ['Mix ingredients', 'Bake at 350°F'];
    recipe.prepTimeMinutes = 15;
    recipe.cookTimeMinutes = 30;
    recipe.servings = 4;

    expect(recipe.id).toBe('test-uuid');
    expect(recipe.title).toBe('Test Recipe');
    expect(recipe.description).toBe('A delicious test recipe');
    expect(recipe.ingredients).toHaveLength(2);
    expect(recipe.instructions).toHaveLength(2);
    expect(recipe.prepTimeMinutes).toBe(15);
    expect(recipe.cookTimeMinutes).toBe(30);
    expect(recipe.servings).toBe(4);
  });

  it('should have a createdAt timestamp', () => {
    const recipe = new Recipe();
    expect(recipe.createdAt).toBeUndefined();
  });

  it('should store ingredients as JSON', () => {
    const recipe = new Recipe();
    const ingredients = [
      { name: 'Flour', quantity: 2, unit: 'cups' },
      { name: 'Sugar', quantity: 1, unit: 'cup' },
    ];
    recipe.ingredients = ingredients;

    expect(recipe.ingredients).toEqual(ingredients);
    expect(Array.isArray(recipe.ingredients)).toBe(true);
  });

  it('should store instructions as JSON array', () => {
    const recipe = new Recipe();
    const instructions = ['Step 1', 'Step 2', 'Step 3'];
    recipe.instructions = instructions;

    expect(recipe.instructions).toEqual(instructions);
    expect(Array.isArray(recipe.instructions)).toBe(true);
  });
});
