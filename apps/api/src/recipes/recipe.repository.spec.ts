import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { RecipeRepository } from './recipe.repository';
import { Recipe } from './entities/recipe.entity';

describe('RecipeRepository', () => {
  let repository: RecipeRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    // Create a mock DataSource with createEntityManager
    const mockEntityManager = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    dataSource = {
      createEntityManager: jest.fn().mockReturnValue(mockEntityManager),
      getRepository: jest.fn().mockReturnThis(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = module.get<RecipeRepository>(RecipeRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should extend TypeORM Repository', () => {
    expect(repository).toHaveProperty('save');
    expect(repository).toHaveProperty('find');
    expect(repository).toHaveProperty('findOne');
  });

  it('should save a recipe to the database', async () => {
    const recipe = new Recipe();
    recipe.id = 'test-uuid';
    recipe.title = 'Test Recipe';
    recipe.description = 'Test Description';
    recipe.ingredients = [{ name: 'Flour', quantity: 2, unit: 'cups' }];
    recipe.instructions = ['Mix ingredients'];
    recipe.prepTimeMinutes = 15;
    recipe.cookTimeMinutes = 30;
    recipe.servings = 4;

    repository.save = jest.fn().mockResolvedValue(recipe);

    const result = await repository.save(recipe);

    expect(result).toEqual(recipe);
    expect(repository.save).toHaveBeenCalledWith(recipe);
  });

  it('should retrieve a saved recipe by id', async () => {
    const recipe = new Recipe();
    recipe.id = 'test-uuid';
    recipe.title = 'Test Recipe';

    repository.findOne = jest.fn().mockResolvedValue(recipe);

    const result = await repository.findOne({ where: { id: 'test-uuid' } });

    expect(result).toEqual(recipe);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 'test-uuid' },
    });
  });
});
