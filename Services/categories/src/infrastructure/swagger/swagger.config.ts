import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Categories API',
      version: '1.0.0',
      description: 'API para el microservicio de Categories de MercadoVerde',
    },
    servers: [
      {
        url: 'http://localhost:4001',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          required: ['nombre'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único de la categoría',
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la categoría',
              example: 'Frutas',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la categoría',
              example: 'Frutas frescas y orgánicas',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
            },
          },
        },
      },
    },
    paths: {
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Obtener todas las categorías',
          description: 'Retorna una lista de todas las categorías disponibles',
          responses: {
            '200': {
              description: 'Lista de categorías obtenida exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Category',
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Categories'],
          summary: 'Crear nueva categoría',
          description: 'Crea una nueva categoría en el sistema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nombre'],
                  properties: {
                    nombre: {
                      type: 'string',
                      description: 'Nombre de la categoría',
                      example: 'Frutas',
                    },
                    descripcion: {
                      type: 'string',
                      description: 'Descripción de la categoría',
                      example: 'Frutas frescas y orgánicas',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Categoría creada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Category',
                  },
                },
              },
            },
            '400': {
              description: 'Datos de entrada inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/categories/{id}': {
        get: {
          tags: ['Categories'],
          summary: 'Obtener categoría por ID',
          description: 'Retorna una categoría específica por su ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID de la categoría',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Categoría encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Category',
                  },
                },
              },
            },
            '404': {
              description: 'Categoría no encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                        example: 'No encontrada',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['Categories'],
          summary: 'Actualizar categoría',
          description: 'Actualiza una categoría existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID de la categoría',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: {
                      type: 'string',
                      description: 'Nombre de la categoría',
                      example: 'Frutas',
                    },
                    descripcion: {
                      type: 'string',
                      description: 'Descripción de la categoría',
                      example: 'Frutas frescas y orgánicas',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Categoría actualizada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Category',
                  },
                },
              },
            },
            '404': {
              description: 'Categoría no encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                        example: 'No encontrada',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Categories'],
          summary: 'Eliminar categoría',
          description: 'Elimina una categoría del sistema',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID de la categoría',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Categoría eliminada exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                        example: 'Eliminada',
                      },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Categoría no encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                        example: 'No encontrada',
                      },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Error interno del servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/infrastructure/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);
