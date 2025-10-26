import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const config = getDatabaseConfig();
        return {
          ...config,
          autoLoadEntities: true,
          migrationsRun: true, // Auto-run migrations on startup
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
