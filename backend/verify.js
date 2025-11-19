const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Carga el .proto
const packageDef = protoLoader.loadSync(
  "Services/auth/proto/auth.proto",
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const proto = grpc.loadPackageDefinition(packageDef);

// Cliente hacia el servicio dentro de la red de Docker
const client = new proto.auth.v1.AuthService(
  "auth_service:50051",
  grpc.credentials.createInsecure()
);

// Lee el token desde grpc_req.json
const req = JSON.parse(fs.readFileSync("./grpc_req.json", "utf8"));

// Llama VerifyToken
client.VerifyToken(req, (err, resp) => {
  if (err) {
    console.error("gRPC error:", err);
    process.exit(1);
  }
  console.log(JSON.stringify(resp, null, 2));
});
