import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { DataSource } from 'typeorm';

describe('DatabaseModule', () => {
  let module: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    if (dataSource?.isInitialized === true) {
      await dataSource.destroy();
    }
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide a DataSource', () => {
    expect(dataSource).toBeDefined();
    expect(dataSource).toBeInstanceOf(DataSource);
  });

  it('should connect to the database', async () => {
    expect(dataSource.isInitialized).toBe(true);
  });

  it('should use in-memory SQLite for tests', () => {
    expect(dataSource.options.type).toBe('better-sqlite3');
    expect((dataSource.options as any).database).toBe(':memory:');
  });

  it('should support UTF-8 characters', async () => {
    const query = await dataSource.query("SELECT 'Hello 世界 🌍' as message");
    expect(query[0].message).toBe('Hello 世界 🌍');
  });
});
