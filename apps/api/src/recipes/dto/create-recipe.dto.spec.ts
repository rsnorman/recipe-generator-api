import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRecipeDto } from './create-recipe.dto';

describe('CreateRecipeDto', () => {
  it('should validate a valid recipe', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [
        { name: 'Flour', quantity: 2, unit: 'cups' },
        { name: 'Sugar', quantity: 1, unit: 'cup' },
      ],
      instructions: ['Mix ingredients', 'Bake at 350°F'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when title is empty', async () => {
    const plain = {
      title: '',
      description: 'A delicious test recipe',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail when title exceeds 200 characters', async () => {
    const plain = {
      title: 'a'.repeat(201),
      description: 'A delicious test recipe',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail when description is empty', async () => {
    const plain = {
      title: 'Test Recipe',
      description: '',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail when description exceeds 500 characters', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'a'.repeat(501),
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail when ingredients array is empty', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('ingredients');
  });

  it('should fail when instructions array is empty', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: [],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('instructions');
  });

  it('should fail when prepTimeMinutes is not a positive integer', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 0,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('prepTimeMinutes');
  });

  it('should fail when cookTimeMinutes is not a positive integer', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: -5,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('cookTimeMinutes');
  });

  it('should fail when servings is not a positive integer', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 0,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('servings');
  });

  it('should validate nested ingredient objects', async () => {
    const plain = {
      title: 'Test Recipe',
      description: 'A delicious test recipe',
      ingredients: [{ name: '', quantity: 2, unit: 'cups' }],
      instructions: ['Mix ingredients'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
    };

    const dto = plainToInstance(CreateRecipeDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('ingredients');
  });
});
