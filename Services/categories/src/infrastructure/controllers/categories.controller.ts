import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: "Crear categoría", description: "Crea una nueva categoría en el sistema. Solo para administradores." })
  create(@Body() dto: CreateCategoryDto) {
    return this.createUC.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: "Listar categorías", description: "Devuelve una lista de todas las categorías. Se puede filtrar por nombre, estado y padre." })
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
  @ApiOperation({ summary: "Obtener árbol de categorías", description: "Devuelve la estructura jerárquica completa de categorías en formato árbol." })
  tree() {
    return this.treeUC.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: "Obtener categoría por ID", description: "Obtiene la información detallada de una categoría específica por su ID." })
  getById(@Param('id') id: string) {
    return this.getByIdUC.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: "Actualizar categoría", description: "Actualiza los datos de una categoría existente por ID. Solo para administradores." })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Eliminar categoría", description: "Elimina una categoría por su ID. Solo para administradores." })
  remove(@Param('id') id: string) {
    return this.deleteUC.execute(id);
  }
}
