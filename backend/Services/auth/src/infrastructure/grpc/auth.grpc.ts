// Services/auth/src/infrastructure/grpc/auth.grpc.ts
import fs from 'fs';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import jwt from 'jsonwebtoken';

// Localiza el .proto sin dramas:
function resolveAuthProtoPath(): string {
  const candidates = [
    process.env.AUTH_PROTO_PATH,                    // docker-compose
    path.resolve(process.cwd(), 'proto/auth.proto'),// /app/proto/auth.proto en contenedor (WORKDIR=/app)
    path.resolve(__dirname, '../../..', 'proto/auth.proto'), // dev/ts-node
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    try { fs.accessSync(p); return p; } catch {}
  }
  throw new Error('[auth][gRPC] No pude localizar auth.proto');
}

const PROTO_PATH = resolveAuthProtoPath();
const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const desc = grpc.loadPackageDefinition(pkgDef) as any;
const AuthProto = desc.auth?.v1;
if (!AuthProto?.AuthService) throw new Error('[auth][gRPC] auth.v1.AuthService no encontrado');

// Implementación del servicio VerifyToken
const verifyToken = (call: any, callback: any) => {
  const { token } = call.request;
  
  if (!token) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Token is required'
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as any;
    
    callback(null, {
      valid: true,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  } catch (error) {
    callback(null, {
      valid: false,
      userId: '',
      email: '',
      role: ''
    });
  }
};

// Función para iniciar el servidor gRPC
export async function startAuthGrpcServer(): Promise<void> {
  const server = new grpc.Server();
  
  server.addService(AuthProto.AuthService.service, {
    VerifyToken: verifyToken
  });

  const port = process.env.GRPC_PORT || '50051';
  const host = '0.0.0.0';
  
  return new Promise((resolve, reject) => {
    server.bindAsync(
      `${host}:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (error, boundPort) => {
        if (error) {
          console.error('[auth][gRPC] Error al vincular:', error);
          reject(error);
          return;
        }
        
        server.start();
        console.log(`🟢 Auth gRPC server running on ${host}:${boundPort}`);
        resolve();
      }
    );
  });
}
