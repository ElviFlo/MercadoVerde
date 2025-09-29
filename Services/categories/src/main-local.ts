import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/swagger/swagger.config";
import categoryRoutes from "./infrastructure/categoryRoutes";

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'categories-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: 'local-development'
  });
});

// API routes
app.use("/categories", categoryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Categories Service API (Local Development)',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      categories: '/categories'
    },
    note: 'Running in local development mode without MongoDB'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server without MongoDB for local development
app.listen(PORT, () => {
  console.log(`🚀 Categories service corriendo en puerto ${PORT} (Modo Local)`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/categories`);
  console.log(`⚠️  Nota: Ejecutándose sin MongoDB para desarrollo local`);
});
