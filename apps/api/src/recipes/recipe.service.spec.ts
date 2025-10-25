import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { RecipeRepository } from './recipe.repository';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './entities/recipe.entity';

describe('RecipeService', () => {
  let service: RecipeService;

  const mockRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: RecipeRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a recipe with generated UUID', async () => {
      const dto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
        instructions: ['Mix ingredients', 'Bake'],
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        servings: 4,
      };

      const savedRecipe = new Recipe();
      savedRecipe.id = 'generated-uuid';
      savedRecipe.title = dto.title;
      savedRecipe.description = dto.description;
      savedRecipe.ingredients = dto.ingredients;
      savedRecipe.instructions = dto.instructions;
      savedRecipe.prepTimeMinutes = dto.prepTimeMinutes;
      savedRecipe.cookTimeMinutes = dto.cookTimeMinutes;
      savedRecipe.servings = dto.servings;
      savedRecipe.createdAt = new Date();

      mockRepository.save.mockResolvedValue(savedRecipe);

      const result = await service.create(dto);

      expect(result).toEqual(savedRecipe);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      const savedEntity = mockRepository.save.mock.calls[0][0];
      expect(savedEntity.id).toBeDefined();
      expect(savedEntity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate valid UUID v4', async () => {
      const dto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: [{ name: 'Salt', quantity: 1, unit: 'tsp' }],
        instructions: ['Add salt'],
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        servings: 2,
      };

      const savedRecipe = new Recipe();
      mockRepository.save.mockResolvedValue(savedRecipe);

      await service.create(dto);

      const savedEntity = mockRepository.save.mock.calls[0][0];
      // UUID v4 format check
      expect(savedEntity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should map DTO fields to entity correctly', async () => {
      const dto: CreateRecipeDto = {
        title: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake',
        ingredients: [
          { name: 'Flour', quantity: 2.5, unit: 'cups' },
          { name: 'Sugar', quantity: 1.5, unit: 'cups' },
        ],
        instructions: ['Preheat oven', 'Mix ingredients', 'Bake'],
        prepTimeMinutes: 20,
        cookTimeMinutes: 45,
        servings: 8,
      };

      const savedRecipe = new Recipe();
      mockRepository.save.mockResolvedValue(savedRecipe);

      await service.create(dto);

      const savedEntity = mockRepository.save.mock.calls[0][0];
      expect(savedEntity.title).toBe(dto.title);
      expect(savedEntity.description).toBe(dto.description);
      expect(savedEntity.ingredients).toEqual(dto.ingredients);
      expect(savedEntity.instructions).toEqual(dto.instructions);
      expect(savedEntity.prepTimeMinutes).toBe(dto.prepTimeMinutes);
      expect(savedEntity.cookTimeMinutes).toBe(dto.cookTimeMinutes);
      expect(savedEntity.servings).toBe(dto.servings);
    });

    it('should return the saved recipe entity', async () => {
      const dto: CreateRecipeDto = {
        title: 'Test',
        description: 'Test',
        ingredients: [{ name: 'Test', quantity: 1, unit: 'test' }],
        instructions: ['Test'],
        prepTimeMinutes: 1,
        cookTimeMinutes: 1,
        servings: 1,
      };

      const savedRecipe = new Recipe();
      savedRecipe.id = 'uuid';
      savedRecipe.createdAt = new Date();
      mockRepository.save.mockResolvedValue(savedRecipe);

      const result = await service.create(dto);

      expect(result).toBe(savedRecipe);
    });
  });
});
