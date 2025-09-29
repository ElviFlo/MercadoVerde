import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/swagger/swagger.config";

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
    mode: 'swagger-demo'
  });
});

// In-memory storage for demo
let categories = [
  { id: '1', nombre: 'Frutas', descripcion: 'Frutas frescas', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', nombre: 'Verduras', descripcion: 'Verduras frescas', createdAt: new Date(), updatedAt: new Date() }
];

// Categories endpoints
app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/categories/:id', (req, res) => {
  const category = categories.find(c => c.id === req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ msg: "No encontrada" });
  }
});

app.post('/categories', (req, res) => {
  const newCategory = {
    id: (categories.length + 1).toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put('/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...req.body, updatedAt: new Date() };
    res.json(categories[index]);
  } else {
    res.status(404).json({ msg: "No encontrada" });
  }
});

app.delete('/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    categories.splice(index, 1);
    res.json({ msg: "Eliminada" });
  } else {
    res.status(404).json({ msg: "No encontrada" });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Categories Service API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      categories: '/categories'
    },
    note: 'Demo mode with in-memory storage'
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Categories service corriendo en puerto ${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints: http://localhost:${PORT}/categories`);
  console.log(`🎯 Demo mode: Datos en memoria`);
});
