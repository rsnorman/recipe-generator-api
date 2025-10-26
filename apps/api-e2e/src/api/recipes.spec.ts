import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../api/src/app/app.module';
import { DataSource } from 'typeorm';

describe('Recipes API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure like main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized === true) {
      await dataSource.destroy();
    }
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    if (dataSource?.isInitialized === true) {
      await dataSource.query('DELETE FROM recipes');
    }
  });

  describe('POST /api/recipes', () => {
    describe('Happy Path', () => {
      it('should create a recipe with valid data and return 201', async () => {
        const validRecipe = {
          title: 'Chocolate Chip Cookies',
          description: 'Classic homemade chocolate chip cookies',
          ingredients: [
            { name: 'Flour', quantity: 2.5, unit: 'cups' },
            { name: 'Butter', quantity: 1, unit: 'cup' },
            { name: 'Sugar', quantity: 1, unit: 'cup' },
            { name: 'Chocolate Chips', quantity: 2, unit: 'cups' },
          ],
          instructions: [
            'Preheat oven to 375°F',
            'Mix butter and sugar until creamy',
            'Add flour gradually',
            'Fold in chocolate chips',
            'Bake for 10-12 minutes',
          ],
          prepTimeMinutes: 15,
          cookTimeMinutes: 12,
          servings: 24,
        };

        const response = await request(app.getHttpServer())
          .post('/api/recipes')
          .send(validRecipe)
          .expect(201);

        // Verify response structure
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body.title).toBe(validRecipe.title);
        expect(response.body.description).toBe(validRecipe.description);
        expect(response.body.ingredients).toEqual(validRecipe.ingredients);
        expect(response.body.instructions).toEqual(validRecipe.instructions);
        expect(response.body.prepTimeMinutes).toBe(validRecipe.prepTimeMinutes);
        expect(response.body.cookTimeMinutes).toBe(validRecipe.cookTimeMinutes);
        expect(response.body.servings).toBe(validRecipe.servings);

        // Verify UUID format
        expect(response.body.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );

        // Verify timestamp format
        expect(new Date(response.body.createdAt).getTime()).toBeLessThanOrEqual(
          Date.now(),
        );
      });

      it('should persist recipe in database', async () => {
        const validRecipe = {
          title: 'Simple Recipe',
          description: 'A simple test recipe',
          ingredients: [{ name: 'Salt', quantity: 1, unit: 'tsp' }],
          instructions: ['Add salt'],
          prepTimeMinutes: 1,
          cookTimeMinutes: 1,
          servings: 1,
        };

        const response = await request(app.getHttpServer())
          .post('/api/recipes')
          .send(validRecipe)
          .expect(201);

        // Query database directly to verify persistence
        const recipes = await dataSource.query(
          'SELECT * FROM recipes WHERE id = ?',
          [response.body.id],
        );

        expect(recipes).toHaveLength(1);
        expect(recipes[0].title).toBe(validRecipe.title);
      });

      it('should handle unicode characters correctly', async () => {
        const unicodeRecipe = {
          title: 'Spätzle Recipe 🥟',
          description: 'Traditional German egg noodles - délicieux! 美味しい',
          ingredients: [
            { name: 'Mehl (Flour)', quantity: 500, unit: 'g' },
            { name: 'Eier', quantity: 5, unit: 'pieces' },
          ],
          instructions: ['Mix Mehl und Eier', 'Cook in boiling water 水'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 5,
          servings: 4,
        };

        const response = await request(app.getHttpServer())
          .post('/api/recipes')
          .send(unicodeRecipe)
          .expect(201);

        expect(response.body.title).toBe(unicodeRecipe.title);
        expect(response.body.description).toBe(unicodeRecipe.description);
        expect(response.body.ingredients[0].name).toBe('Mehl (Flour)');
        expect(response.body.instructions[1]).toBe('Cook in boiling water 水');
      });

      it('should accept minimum valid values', async () => {
        const minimalRecipe = {
          title: 'A',
          description: 'B',
          ingredients: [{ name: 'C', quantity: 0.01, unit: 'D' }],
          instructions: ['E'],
          prepTimeMinutes: 1,
          cookTimeMinutes: 1,
          servings: 1,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(minimalRecipe)
          .expect(201);
      });

      it('should accept maximum valid string lengths', async () => {
        const maxLengthRecipe = {
          title: 'a'.repeat(200),
          description: 'b'.repeat(500),
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(maxLengthRecipe)
          .expect(201);
      });
    });

    describe('Validation Errors', () => {
      it('should return 400 when title is missing', async () => {
        const invalidRecipe = {
          description: 'Missing title',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        const response = await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array);
        expect(
          response.body.message.some((msg: string) => msg.includes('title')),
        ).toBe(true);
      });

      it('should return 400 when title is empty', async () => {
        const invalidRecipe = {
          title: '',
          description: 'Empty title',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when title exceeds 200 characters', async () => {
        const invalidRecipe = {
          title: 'a'.repeat(201),
          description: 'Title too long',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when description is missing', async () => {
        const invalidRecipe = {
          title: 'Missing description',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when description exceeds 500 characters', async () => {
        const invalidRecipe = {
          title: 'Valid title',
          description: 'a'.repeat(501),
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when ingredients array is empty', async () => {
        const invalidRecipe = {
          title: 'No ingredients',
          description: 'Empty ingredients array',
          ingredients: [],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when instructions array is empty', async () => {
        const invalidRecipe = {
          title: 'No instructions',
          description: 'Empty instructions array',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: [],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when prepTimeMinutes is 0', async () => {
        const invalidRecipe = {
          title: 'Invalid prep time',
          description: 'Prep time is zero',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 0,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when cookTimeMinutes is negative', async () => {
        const invalidRecipe = {
          title: 'Invalid cook time',
          description: 'Cook time is negative',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: -5,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when servings is 0', async () => {
        const invalidRecipe = {
          title: 'Invalid servings',
          description: 'Servings is zero',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 0,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 when ingredient quantity is too small', async () => {
        const invalidRecipe = {
          title: 'Invalid ingredient',
          description: 'Ingredient quantity too small',
          ingredients: [{ name: 'Flour', quantity: 0, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        };

        await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);
      });

      it('should return 400 with detailed validation messages', async () => {
        const invalidRecipe = {
          title: '',
          description: '',
          ingredients: [],
          instructions: [],
          prepTimeMinutes: 0,
          cookTimeMinutes: 0,
          servings: 0,
        };

        const response = await request(app.getHttpServer())
          .post('/api/recipes')
          .send(invalidRecipe)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array);
        expect(response.body.message.length).toBeGreaterThan(0);
      });

      it('should reject unknown properties', async () => {
        const recipeWithExtraFields = {
          title: 'Valid Recipe',
          description: 'Valid description',
          ingredients: [{ name: 'Flour', quantity: 2, unit: 'cups' }],
          instructions: ['Mix'],
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
          unknownField: 'should be rejected',
          anotherUnknown: 123,
        };

        const response = await request(app.getHttpServer())
          .post('/api/recipes')
          .send(recipeWithExtraFields)
          .expect(400);

        expect(response.body.message).toBeInstanceOf(Array);
        expect(
          response.body.message.some((msg: string) =>
            msg.includes('should not exist'),
          ),
        ).toBe(true);
      });
    });
  });
});
