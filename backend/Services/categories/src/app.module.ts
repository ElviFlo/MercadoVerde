import { Module } from '@nestjs/common';
import { CategoriesController } from './infrastructure/controllers/categories.controller';
import { MemoryCategoryRepository } from './infrastructure/persistence/memory-category.repository';

// Use cases
import { CreateCategoryUseCase } from './application/use-cases/create-category.usecase';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.usecase';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.usecase';
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.usecase';
import { GetCategoriesUseCase } from './application/use-cases/get-categories.usecase';
import { GetCategoryTreeUseCase } from './application/use-cases/get-category-tree.usecase';

@Module({
  controllers: [CategoriesController],
  providers: [
    { provide: 'CategoryRepository', useClass: MemoryCategoryRepository },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoryByIdUseCase,
    GetCategoriesUseCase,
    GetCategoryTreeUseCase,
  ],
})
export class AppModule {}
