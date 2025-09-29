import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.usecase';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.usecase';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.usecase';
import { GetCategoryByIdUseCase } from '../../application/use-cases/get-category-by-id.usecase';
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.usecase';
import { GetCategoryTreeUseCase } from '../../application/use-cases/get-category-tree.usecase';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createUC: CreateCategoryUseCase,
    private readonly updateUC: UpdateCategoryUseCase,
    private readonly deleteUC: DeleteCategoryUseCase,
    private readonly getByIdUC: GetCategoryByIdUseCase,
    private readonly getAllUC: GetCategoriesUseCase,
    private readonly treeUC: GetCategoryTreeUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.createUC.execute(dto);
  }

  @Get()
  list(
    @Query('q') q?: string,
    @Query('active') active?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.getAllUC.execute({
      q,
      active: active === undefined ? undefined : active === 'true',
      parentId: parentId === undefined ? undefined : (parentId || null),
    });
  }

  @Get('tree/all')
  tree() {
    return this.treeUC.execute();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.getByIdUC.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUC.execute(id);
  }
}
