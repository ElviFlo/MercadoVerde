import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, description: "Categoría creada exitosamente." })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos." })
  @ApiResponse({ status: 401, description: "No autorizado. Token JWT ausente o inválido." })
  @ApiResponse({ status: 409, description: "Ya existe una categoría con ese nombre." })
  create(@Body() dto: CreateCategoryDto) {
    return this.createUC.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: "Listar categorías", description: "Devuelve una lista de todas las categorías. Se puede filtrar por nombre, estado y padre." })
  @ApiQuery({ name: 'q', required: false, description: 'Buscar por nombre o slug', type: String })
  @ApiQuery({ name: 'active', required: false, description: 'Filtra solo categorías activas/inactivas', enum: ['true', 'false'], type: String, example: 'true' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Filtrar solo hijas de la categoría indicada, null para raíz', type: String })
  @ApiResponse({ status: 200, description: "Listado de categorías retornado exitosamente." })
  @ApiResponse({ status: 401, description: "No autorizado. Token JWT ausente o inválido." })
  list(
    @Query('q') q?: string,
    @Query('active') active?: string,
    @Query('parentId') parentId?: string,
  ) {
    const filter: Record<string, any> = {};
    if (typeof q === 'string' && q.trim() !== '') filter.q = q.trim();
    if (typeof active === 'string') filter.active = active === 'true' ? true : (active === 'false' ? false : undefined);
    if (parentId !== undefined) filter.parentId = parentId === '' ? null : parentId;
    return this.getAllUC.execute(filter);
  }

  @Get('tree/all')
  @ApiOperation({ summary: "Obtener árbol de categorías", description: "Devuelve la estructura jerárquica completa de categorías en formato árbol." })
  @ApiResponse({ status: 200, description: "Árbol de categorías retornado exitosamente." })
  @ApiResponse({ status: 401, description: "No autorizado. Token JWT ausente o inválido." })
  tree() {
    return this.treeUC.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: "Obtener categoría por ID", description: "Obtiene la información detallada de una categoría específica por su ID." })
  @ApiResponse({ status: 200, description: "Categoría encontrada y retornada exitosamente." })
  @ApiResponse({ status: 401, description: "No autorizado. Token JWT ausente o inválido." })
  @ApiResponse({ status: 404, description: "Categoría no encontrada." })
  getById(@Param('id') id: string) {
    return this.getByIdUC.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: "Actualizar categoría", description: "Actualiza los datos de una categoría existente por ID. Solo para administradores." })
  @ApiResponse({ status: 200, description: "Categoría actualizada exitosamente." })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos." })
  @ApiResponse({ status: 401, description: "No autorizado. Token JWT ausente o inválido." })
  @ApiResponse({ status: 404, description: "Categoría no encontrada." })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.updateUC.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Eliminar categoría", description: "Elimina una categoría por su ID. Solo para administradores." })
  @ApiResponse({ status: 200, description: "Categoría eliminada exitosamente." })
  @ApiResponse({ status: 401, description: "No autorizado. Token JWT ausente o inválido." })
  @ApiResponse({ status: 404, description: "Categoría no encontrada." })
  remove(@Param('id') id: string) {
    return this.deleteUC.execute(id);
  }
}
