"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor() {
        this.users = [];
    }
    async findByUsername(username) {
        return this.users.find(u => u.username === username) || null;
    }
    async create(user) {
        this.users.push(user);
        return user;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map