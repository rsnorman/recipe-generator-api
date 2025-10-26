import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { RecipeModule } from '../recipes/recipe.module';

@Module({
  imports: [DatabaseModule, RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
