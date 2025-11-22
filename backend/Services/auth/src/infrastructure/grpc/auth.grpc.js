"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAuthGrpcServer = startAuthGrpcServer;
// Services/auth/src/infrastructure/grpc/auth.grpc.ts
var fs_1 = require("fs");
var path_1 = require("path");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var jsonwebtoken_1 = require("jsonwebtoken");
// Localiza el .proto sin dramas:
function resolveAuthProtoPath() {
    var candidates = [
        process.env.AUTH_PROTO_PATH, // docker-compose
        path_1.default.resolve(process.cwd(), 'proto/auth.proto'), // /app/proto/auth.proto en contenedor (WORKDIR=/app)
        path_1.default.resolve(__dirname, '../../..', 'proto/auth.proto'), // dev/ts-node
    ].filter(Boolean);
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var p = candidates_1[_i];
        try {
            fs_1.default.accessSync(p);
            return p;
        }
        catch (_a) { }
    }
    throw new Error('[auth][gRPC] No pude localizar auth.proto');
}
var PROTO_PATH = resolveAuthProtoPath();
var pkgDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
var desc = grpc.loadPackageDefinition(pkgDef);
var AuthProto = (_a = desc.auth) === null || _a === void 0 ? void 0 : _a.v1;
if (!(AuthProto === null || AuthProto === void 0 ? void 0 : AuthProto.AuthService))
    throw new Error('[auth][gRPC] auth.v1.AuthService no encontrado');
// Implementación del servicio VerifyToken
var verifyToken = function (call, callback) {
    var token = call.request.token;
    if (!token) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'Token is required'
        });
    }
    try {
        var secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }
        var decoded = jsonwebtoken_1.default.verify(token, secret);
        callback(null, {
            valid: true,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        });
    }
    catch (error) {
        callback(null, {
            valid: false,
            userId: '',
            email: '',
            role: ''
        });
    }
};
// Función para iniciar el servidor gRPC
function startAuthGrpcServer() {
    return __awaiter(this, void 0, void 0, function () {
        var server, port, host;
        return __generator(this, function (_a) {
            server = new grpc.Server();
            server.addService(AuthProto.AuthService.service, {
                VerifyToken: verifyToken
            });
            port = process.env.GRPC_PORT || '50051';
            host = '0.0.0.0';
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    server.bindAsync("".concat(host, ":").concat(port), grpc.ServerCredentials.createInsecure(), function (error, boundPort) {
                        if (error) {
                            console.error('[auth][gRPC] Error al vincular:', error);
                            reject(error);
                            return;
                        }
                        server.start();
                        console.log("\uD83D\uDFE2 Auth gRPC server running on ".concat(host, ":").concat(boundPort));
                        resolve();
                    });
                })];
        });
    });
}
