# Tasks: Create Recipe Feature

## Overview

Implement recipe creation API endpoint with SQLite persistence, following TDD approach with tests written before implementation.

**Estimated Total Time:** 20-24 hours (3-4 days at 6h/day)

**Development Approach:** Red-Green-Refactor cycle for each task

---

## Task 1: Database Setup and TypeORM Configuration

**Status:** [ ] Not Started

**Estimated Time:** 4 hours

**Dependencies:** None

**Objective:** Configure TypeORM with SQLite database, create initial migration for recipes table

### Acceptance Criteria

- [ ] **RED**: Write failing tests for database connection and configuration
- [ ] **GREEN**: TypeORM configured with SQLite in NestJS app
- [ ] **GREEN**: Database connection established and testable
- [ ] **REFACTOR**: Clean configuration with environment-based settings
- [ ] Migration file creates `recipes` table with correct schema
- [ ] In-memory SQLite configuration for tests
- [ ] Database initializes successfully on app startup
- [ ] All text fields support UTF-8 characters

### Files to Create

- [ ] `apps/api/src/database/database.module.ts` (TypeORM module configuration)
- [ ] `apps/api/src/database/database.config.ts` (Database configuration)
- [ ] `apps/api/src/database/database.module.spec.ts` (Unit tests for database setup)
- [ ] `apps/api/src/migrations/1730000000000-CreateRecipesTable.ts` (Migration file)
- [ ] `apps/api/ormconfig.ts` (TypeORM CLI configuration)

### Files to Modify

- [ ] `apps/api/src/app.module.ts` (Import DatabaseModule)
- [ ] `apps/api/package.json` (Add TypeORM dependencies if needed)
- [ ] `apps/api/project.json` (Add migration scripts)

### Technical Notes

- Use SQLite file-based database for development: `data/recipe-api.db`
- Use in-memory SQLite for tests: `:memory:`
- Configure TypeORM with `synchronize: false` for production safety
- Migration should match design schema exactly (UUID primary key, JSON columns for ingredients/instructions)

---

## Task 2: Recipe Entity and DTOs

**Status:** [ ] Not Started

**Estimated Time:** 4 hours

**Dependencies:** Task 1 (Database Setup)

**Objective:** Create Recipe entity with TypeORM decorators and validation DTOs

### Acceptance Criteria

- [ ] **RED**: Write failing tests for entity structure and DTO validation
- [ ] **GREEN**: Recipe entity matches database schema
- [ ] **GREEN**: CreateRecipeDto validates all required fields
- [ ] **GREEN**: IngredientDto validates nested ingredient structure
- [ ] **REFACTOR**: Clean separation of concerns, reusable validators
- [ ] Entity properly maps to `recipes` table
- [ ] All validation rules from requirements implemented
- [ ] DTO validation returns clear error messages
- [ ] Title length validation (1-200 chars)
- [ ] Description length validation (1-500 chars)
- [ ] Ingredients array minimum 1 item
- [ ] Instructions array minimum 1 item
- [ ] Positive integer validation for times and servings
- [ ] Ingredient quantity minimum 0.01

### Files to Create

- [ ] `apps/api/src/recipes/entities/recipe.entity.ts` (Recipe entity)
- [ ] `apps/api/src/recipes/entities/recipe.entity.spec.ts` (Entity unit tests)
- [ ] `apps/api/src/recipes/dto/create-recipe.dto.ts` (CreateRecipeDto)
- [ ] `apps/api/src/recipes/dto/create-recipe.dto.spec.ts` (DTO validation tests)
- [ ] `apps/api/src/recipes/dto/ingredient.dto.ts` (IngredientDto)
- [ ] `apps/api/src/recipes/dto/ingredient.dto.spec.ts` (DTO validation tests)

### Files to Modify

- None (new feature)

### Technical Notes

- Use `@PrimaryColumn('uuid')` for id field
- Use `@Column({ type: 'json' })` for ingredients and instructions
- Use `@CreateDateColumn()` for createdAt timestamp
- Use class-validator decorators: `@IsNotEmpty()`, `@Length()`, `@IsInt()`, `@Min()`, `@IsArray()`, `@ArrayMinSize()`
- Use class-transformer `@Type()` decorator for nested validation

---

## Task 3: Recipe Repository and Service

**Status:** [ ] Not Started

**Estimated Time:** 5 hours

**Dependencies:** Task 2 (Entity and DTOs)

**Objective:** Implement repository pattern and business logic for recipe creation

### Acceptance Criteria

- [ ] **RED**: Write failing tests for repository and service methods
- [ ] **GREEN**: RecipeRepository extends TypeORM Repository
- [ ] **GREEN**: RecipeService creates recipes with generated UUIDs
- [ ] **GREEN**: Service adds createdAt timestamp automatically
- [ ] **REFACTOR**: Clean service methods, proper error handling
- [ ] Repository saves recipe to database successfully
- [ ] Service generates valid UUIDs using crypto.randomUUID()
- [ ] Recipe creation returns complete recipe entity
- [ ] All business rules enforced (positive values, required fields)
- [ ] Database transactions handled properly
- [ ] Error handling for duplicate IDs (edge case)

### Files to Create

- [ ] `apps/api/src/recipes/recipe.repository.ts` (Repository layer)
- [ ] `apps/api/src/recipes/recipe.repository.spec.ts` (Repository unit tests)
- [ ] `apps/api/src/recipes/recipe.service.ts` (Service layer)
- [ ] `apps/api/src/recipes/recipe.service.spec.ts` (Service unit tests)
- [ ] `apps/api/src/recipes/recipe.module.ts` (Recipe module)

### Files to Modify

- [ ] `apps/api/src/app.module.ts` (Import RecipeModule)

### Technical Notes

- Repository should extend `Repository<Recipe>` from TypeORM
- Use DataSource injection for repository initialization
- Service should be `@Injectable()` and inject RecipeRepository
- Use `crypto.randomUUID()` for ID generation (Node.js built-in)
- Mock repository in service tests, mock DataSource in repository tests

---

## Task 4: Recipe Controller and API Endpoint

**Status:** [ ] Not Started

**Estimated Time:** 4 hours

**Dependencies:** Task 3 (Service Layer)

**Objective:** Implement REST API endpoint for recipe creation with proper HTTP responses

### Acceptance Criteria

- [ ] **RED**: Write failing controller tests for endpoint behavior
- [ ] **GREEN**: POST /recipes endpoint accepts CreateRecipeDto
- [ ] **GREEN**: Controller returns 201 Created with recipe data
- [ ] **GREEN**: Validation errors return 400 Bad Request
- [ ] **REFACTOR**: Clean controller methods, consistent error responses
- [ ] Endpoint validates request body automatically
- [ ] Success response includes all recipe fields plus id and createdAt
- [ ] Error response includes detailed validation messages
- [ ] HTTP status codes correct (201 for success, 400 for validation errors)
- [ ] Global validation pipe configured in app
- [ ] Response time meets < 200ms requirement

### Files to Create

- [ ] `apps/api/src/recipes/recipe.controller.ts` (Controller)
- [ ] `apps/api/src/recipes/recipe.controller.spec.ts` (Controller unit tests)

### Files to Modify

- [ ] `apps/api/src/recipes/recipe.module.ts` (Register controller)
- [ ] `apps/api/src/main.ts` (Configure global validation pipe if not already set)

### Technical Notes

- Use `@Controller('recipes')` decorator
- Use `@Post()` and `@Body()` decorators
- Return `Promise<Recipe>` type
- NestJS automatically returns 201 for POST endpoints
- ValidationPipe should be configured globally with `{ whitelist: true, forbidNonWhitelisted: true }`
- Mock RecipeService in controller tests

---

## Task 5: E2E Tests with Real Services

**Status:** [ ] Not Started

**Estimated Time:** 5-6 hours

**Dependencies:** Task 4 (Controller Layer)

**Objective:** Implement comprehensive E2E tests using Cucumber, Playwright, and real NestJS app with in-memory SQLite

### Acceptance Criteria

- [ ] **E2E Framework**: Cucumber + Playwright configured for API testing
- [ ] **Real Services**: Tests run against actual NestJS app (no mocking)
- [ ] **Test Database**: In-memory SQLite for test isolation
- [ ] **Happy Path**: Create recipe with valid data returns 201 and complete recipe
- [ ] **Validation Tests**: Missing required fields return 400 with clear errors
- [ ] **Boundary Tests**: Maximum length strings, minimum numeric values
- [ ] **Unicode Support**: Recipe with international characters persists correctly
- [ ] **Data Verification**: Created recipes stored in database and retrievable
- [ ] All acceptance criteria from requirements.md covered
- [ ] Tests reset database between scenarios
- [ ] Test fixtures for valid and invalid recipes

### Files to Create

- [ ] `apps/api-e2e/src/features/create-recipe.feature` (Cucumber scenarios)
- [ ] `apps/api-e2e/src/step-definitions/recipe.steps.ts` (Step definitions)
- [ ] `apps/api-e2e/src/support/page-objects/recipe-api.page.ts` (Page object for API calls)
- [ ] `apps/api-e2e/src/support/hooks.ts` (Before/After hooks for database reset)
- [ ] `apps/api-e2e/src/fixtures/recipes/valid-recipe.json` (Test fixture)
- [ ] `apps/api-e2e/src/fixtures/recipes/invalid-recipes.json` (Validation test fixtures)
- [ ] `apps/api-e2e/cucumber.js` (Cucumber configuration)
- [ ] `apps/api-e2e/docker-compose.e2e.yml` (E2E test environment - if needed)

### Files to Modify

- [ ] `apps/api-e2e/project.json` (Add e2e test scripts)
- [ ] `apps/api/src/database/database.config.ts` (Ensure test mode uses in-memory SQLite)

### Technical Notes

- Run spec-e2e-test-generator agent to scaffold test structure (optional optimization)
- Use Playwright's `request` context for API calls
- Configure test environment to use `NODE_ENV=test`
- Database should use `:memory:` in test mode
- Each scenario should start with clean database state
- Use Cucumber tags: `@happy-path`, `@validation`, `@boundary`, `@unicode`
- Test data fixtures should cover all validation scenarios from requirements
- Verify database state after creation (query database directly)

### Test Scenarios to Implement

1. **Happy Path**: Create recipe with all valid fields
2. **Missing Title**: Validate error message
3. **Missing Description**: Validate error message
4. **Empty Ingredients Array**: Validate error message
5. **Empty Instructions Array**: Validate error message
6. **Invalid PrepTime (0)**: Validate error message
7. **Invalid CookTime (negative)**: Validate error message
8. **Invalid Servings (0)**: Validate error message
9. **Title Too Long (>200 chars)**: Validate error message
10. **Description Too Long (>500 chars)**: Validate error message
11. **Unicode Characters**: Recipe with international characters

---

## Testing Strategy

### Unit Tests (Tasks 1-4)

- **Framework:** Jest (NestJS default)
- **Location:** Co-located with implementation files (\*.spec.ts)
- **Coverage Target:** 90%+ for service and controller
- **Mocking:** Mock external dependencies (repository in service, service in controller)

### E2E Tests (Task 5)

- **Framework:** Cucumber + Playwright
- **Approach:** Real services, minimal mocking
- **Database:** In-memory SQLite (fresh instance per test suite)
- **Coverage:** All user stories and acceptance criteria from requirements.md

### Test Execution Order

1. Run unit tests during implementation (Tasks 1-4)
2. Run E2E tests after all layers complete (Task 5)
3. All tests must pass before task considered complete

---

## Definition of Done (Per Task)

- [ ] All tests written and passing (Red-Green-Refactor complete)
- [ ] Code follows NestJS and TypeScript best practices
- [ ] No linting errors (`nx lint api`)
- [ ] No TypeScript errors (`nx type-check api`)
- [ ] Test coverage meets target (90%+ for unit tests)
- [ ] All acceptance criteria met
- [ ] Code reviewed (self-review minimum)
- [ ] Git commit with clear message

---

## Running the Tasks

### Prerequisites

```bash
# Install dependencies (if not already installed)
npm install

# Ensure NX is available
npx nx --version
```

### Task Execution Commands

```bash
# Task 1: Database Setup
npx nx test api --testFile=database.module.spec.ts
npx nx run api:migration:create CreateRecipesTable
npx nx run api:migration:run

# Task 2: Entity and DTOs
npx nx test api --testFile=recipe.entity.spec.ts
npx nx test api --testFile=create-recipe.dto.spec.ts
npx nx test api --testFile=ingredient.dto.spec.ts

# Task 3: Repository and Service
npx nx test api --testFile=recipe.repository.spec.ts
npx nx test api --testFile=recipe.service.spec.ts

# Task 4: Controller
npx nx test api --testFile=recipe.controller.spec.ts

# Task 5: E2E Tests
npx nx e2e api-e2e --grep="create-recipe"

# Run all tests
npx nx test api
npx nx e2e api-e2e
```

---

## Risk Mitigation

### Technical Risks

- **Risk:** TypeORM SQLite JSON column compatibility
  - **Mitigation:** Test JSON serialization in Task 1
- **Risk:** UUID generation collisions
  - **Mitigation:** Use crypto.randomUUID() (extremely low collision probability)
- **Risk:** In-memory database state between tests
  - **Mitigation:** Clear database in Cucumber hooks before each scenario

### Dependency Risks

- **Risk:** Missing TypeORM or class-validator packages
  - **Mitigation:** Verify dependencies in Task 1
- **Risk:** SQLite driver not installed
  - **Mitigation:** Install `better-sqlite3` in Task 1

---

## Notes

- Follow existing NX monorepo patterns for project structure
- Use existing NestJS configuration where possible
- TypeScript tests reside in same folder as implementation (per CLAUDE.md)
- Use `docker compose` for any containerization needs (per CLAUDE.md)
- Prefer simple solutions over over-engineering (per CLAUDE.md)
- Each task is sequential - complete one before moving to next
