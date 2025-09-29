import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/swagger/swagger.config";
import categoryRoutes from "./infrastructure/categoryRoutes";

dotenv.config();

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
    uptime: process.uptime()
  });
});

// API routes
app.use("/categories", categoryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Categories Service API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      categories: '/categories'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mercadoverde");
    console.log("✅ Conectado a MongoDB");
    
    app.listen(PORT, () => {
      console.log(`🚀 Categories service corriendo en puerto ${PORT}`);
      console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
      console.log(`📋 API endpoints: http://localhost:${PORT}/categories`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};

startServer();
