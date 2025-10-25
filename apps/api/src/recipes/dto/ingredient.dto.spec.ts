import { validate } from 'class-validator';
import { IngredientDto } from './ingredient.dto';

describe('IngredientDto', () => {
  it('should validate a valid ingredient', async () => {
    const dto = new IngredientDto();
    dto.name = 'Flour';
    dto.quantity = 2;
    dto.unit = 'cups';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when name is empty', async () => {
    const dto = new IngredientDto();
    dto.name = '';
    dto.quantity = 2;
    dto.unit = 'cups';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail when quantity is missing', async () => {
    const dto = new IngredientDto();
    dto.name = 'Flour';
    dto.unit = 'cups';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail when quantity is less than 0.01', async () => {
    const dto = new IngredientDto();
    dto.name = 'Flour';
    dto.quantity = 0;
    dto.unit = 'cups';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
  });

  it('should fail when unit is empty', async () => {
    const dto = new IngredientDto();
    dto.name = 'Flour';
    dto.quantity = 2;
    dto.unit = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('unit');
  });

  it('should accept quantity of exactly 0.01', async () => {
    const dto = new IngredientDto();
    dto.name = 'Salt';
    dto.quantity = 0.01;
    dto.unit = 'teaspoon';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
