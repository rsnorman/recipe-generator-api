import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './entities/recipe.entity';

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: RecipeService;

  const mockRecipeService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: mockRecipeService,
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    service = module.get<RecipeService>(RecipeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a recipe and return it', async () => {
      const dto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
        instructions: ['Mix ingredients', 'Bake'],
        prepTimeMinutes: 15,
        cookTimeMinutes: 30,
        servings: 4,
      };

      const createdRecipe = new Recipe();
      createdRecipe.id = 'test-uuid';
      createdRecipe.title = dto.title;
      createdRecipe.description = dto.description;
      createdRecipe.ingredients = dto.ingredients;
      createdRecipe.instructions = dto.instructions;
      createdRecipe.prepTimeMinutes = dto.prepTimeMinutes;
      createdRecipe.cookTimeMinutes = dto.cookTimeMinutes;
      createdRecipe.servings = dto.servings;
      createdRecipe.createdAt = new Date();

      mockRecipeService.create.mockResolvedValue(createdRecipe);

      const result = await controller.create(dto);

      expect(result).toEqual(createdRecipe);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should return recipe with id and createdAt', async () => {
      const dto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: [{ name: 'Salt', quantity: 1, unit: 'tsp' }],
        instructions: ['Add salt'],
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        servings: 2,
      };

      const createdRecipe = new Recipe();
      createdRecipe.id = 'generated-uuid';
      createdRecipe.createdAt = new Date('2025-10-25T12:00:00Z');
      mockRecipeService.create.mockResolvedValue(createdRecipe);

      const result = await controller.create(dto);

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.id).toBe('generated-uuid');
    });

    it('should pass DTO to service without modification', async () => {
      const dto: CreateRecipeDto = {
        title: 'Chocolate Cake',
        description: 'Rich and moist',
        ingredients: [
          { name: 'Flour', quantity: 2.5, unit: 'cups' },
          { name: 'Cocoa', quantity: 0.75, unit: 'cup' },
        ],
        instructions: [
          'Mix dry ingredients',
          'Add wet ingredients',
          'Bake at 350F',
        ],
        prepTimeMinutes: 20,
        cookTimeMinutes: 35,
        servings: 12,
      };

      const createdRecipe = new Recipe();
      mockRecipeService.create.mockResolvedValue(createdRecipe);

      await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return complete recipe entity', async () => {
      const dto: CreateRecipeDto = {
        title: 'Complete Test',
        description: 'Testing all fields',
        ingredients: [{ name: 'Test', quantity: 1, unit: 'test' }],
        instructions: ['Test step'],
        prepTimeMinutes: 1,
        cookTimeMinutes: 1,
        servings: 1,
      };

      const createdRecipe = new Recipe();
      createdRecipe.id = 'uuid-123';
      createdRecipe.title = dto.title;
      createdRecipe.description = dto.description;
      createdRecipe.ingredients = dto.ingredients;
      createdRecipe.instructions = dto.instructions;
      createdRecipe.prepTimeMinutes = dto.prepTimeMinutes;
      createdRecipe.cookTimeMinutes = dto.cookTimeMinutes;
      createdRecipe.servings = dto.servings;
      createdRecipe.createdAt = new Date();

      mockRecipeService.create.mockResolvedValue(createdRecipe);

      const result = await controller.create(dto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('ingredients');
      expect(result).toHaveProperty('instructions');
      expect(result).toHaveProperty('prepTimeMinutes');
      expect(result).toHaveProperty('cookTimeMinutes');
      expect(result).toHaveProperty('servings');
      expect(result).toHaveProperty('createdAt');
    });
  });
});
