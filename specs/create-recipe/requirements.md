# Recipe Creation Requirements

## Executive Summary

Enable users to create recipes with essential cooking information through a REST API endpoint, persisting data in SQLite database.

## User Stories

### Story 1: Create a Basic Recipe

**As a** recipe creator
**I want to** submit a new recipe with essential cooking information
**So that** others can view and cook from my recipe

**Acceptance Criteria:**

```gherkin
Given a valid recipe payload with required fields
When I submit a POST request to /recipes
Then the recipe is saved to the database
And I receive a 201 response with the created recipe including its ID
And the recipe contains all submitted data
```

```gherkin
Given a recipe payload missing required fields
When I submit a POST request to /recipes
Then I receive a 400 response
And the response includes field-specific validation errors
And no recipe is saved to the database
```

### Story 2: Validate Recipe Completeness

**As a** recipe creator
**I want to** receive clear feedback on missing information
**So that** I can ensure my recipe is complete and usable

**Acceptance Criteria:**

```gherkin
Given a recipe without a title
When I submit the recipe
Then I receive an error "Recipe title is required"
```

```gherkin
Given a recipe without ingredients
When I submit the recipe
Then I receive an error "At least one ingredient is required"
```

```gherkin
Given a recipe without instructions
When I submit the recipe
Then I receive an error "At least one instruction step is required"
```

### Story 3: Store Recipe with Structured Data

**As a** system
**I want to** persist recipes with properly structured data
**So that** recipes can be consistently retrieved and displayed

**Acceptance Criteria:**

```gherkin
Given a valid recipe is submitted
When the recipe is saved to SQLite
Then the recipe ID is auto-generated
And ingredients are stored with quantity, unit, and name
And instructions are stored with step numbers
And all text fields support Unicode characters
```

## Business Rules

### Recipe Data Model (Domain-Driven)

1. **Essential Recipe Fields** (discovered through DDD):
   - `title`: Name of the recipe (required, max 200 chars)
   - `description`: Brief overview of the dish (required, max 500 chars)
   - `ingredients`: List of ingredients with:
     - `quantity`: Numeric amount (required)
     - `unit`: Measurement unit (required, e.g., "cup", "tablespoon", "grams")
     - `name`: Ingredient name (required)
   - `instructions`: Ordered list of cooking steps (required, min 1 step)
   - `prepTime`: Minutes to prepare (required, positive integer)
   - `cookTime`: Minutes to cook (required, positive integer)
   - `servings`: Number of servings (required, positive integer)

2. **Validation Rules**:
   - Title must be 1-200 characters
   - Description must be 1-500 characters
   - At least 1 ingredient required
   - At least 1 instruction step required
   - Times and servings must be positive integers
   - Ingredient quantities must be positive numbers

3. **Data Persistence**:
   - Auto-generate UUID for recipe ID
   - Store creation timestamp
   - Maintain ingredient order as submitted
   - Maintain instruction step order

## Non-Functional Requirements

### Performance

- Recipe creation response time < 200ms
- Database write operations < 50ms

### Security

- Input sanitization for all text fields
- SQL injection prevention through parameterized queries
- Maximum payload size: 100KB

### Accessibility

- API responses follow REST standards
- Clear, descriptive error messages
- Support for UTF-8 characters in all text fields

## Testing Requirements

### E2E Test Scenarios

1. **Happy Path**: Create recipe with all required fields
2. **Validation**: Attempt creation with missing/invalid fields
3. **Boundary Testing**: Max length strings, min/max numeric values
4. **Unicode Support**: Create recipe with international characters

### Test Environment

- In-memory SQLite for test isolation
- Seed data for integration tests
- Mock-free testing against real NestJS application

### Test Data

- Valid recipe fixture with minimal fields
- Invalid recipe fixtures for each validation rule
- Boundary test fixtures

## Dependencies

### Technical Dependencies

- NestJS framework
- SQLite database with TypeORM
- Class-validator for DTO validation
- UUID generation library

### External Dependencies

- None (self-contained API)

## Out of Scope

**Explicitly NOT included in MVP:**

- Recipe categories or tags
- Recipe images/media
- User authentication/ownership
- Recipe ratings or reviews
- Nutritional information
- Recipe duplication/versioning
- Search functionality
- Recipe updates or deletes
- Difficulty levels
- Cuisine types
- Dietary restrictions/allergen info
- Equipment lists
- Recipe sharing/publishing features
- Import from external sources

## Success Metrics

### Functional Success

- Successfully create 100 test recipes without errors
- All required fields properly validated
- 100% E2E test coverage for creation flow

### Technical Success

- API response time consistently < 200ms
- Zero data loss during creation
- Proper error handling for all edge cases

### Business Success

- Recipe data model supports viewing complete recipes
- Created recipes contain all information needed to cook the dish
- Clean, intuitive API contract for frontend integration

## API Contract Example

### Request

```http
POST /recipes
Content-Type: application/json

{
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta with eggs, cheese, and pancetta",
  "ingredients": [
    { "quantity": 400, "unit": "grams", "name": "spaghetti" },
    { "quantity": 200, "unit": "grams", "name": "pancetta" },
    { "quantity": 4, "unit": "whole", "name": "eggs" },
    { "quantity": 100, "unit": "grams", "name": "Pecorino Romano" }
  ],
  "instructions": [
    "Boil pasta in salted water until al dente",
    "Fry pancetta until crispy",
    "Mix eggs and cheese in a bowl",
    "Combine pasta with pancetta, then add egg mixture off heat"
  ],
  "prepTime": 10,
  "cookTime": 15,
  "servings": 4
}
```

### Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Spaghetti Carbonara",
  "description": "Classic Italian pasta with eggs, cheese, and pancetta",
  "ingredients": [...],
  "instructions": [...],
  "prepTime": 10,
  "cookTime": 15,
  "servings": 4,
  "createdAt": "2025-10-25T14:00:00Z"
}
```
