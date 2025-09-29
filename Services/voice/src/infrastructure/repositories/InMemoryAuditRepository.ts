import { AuditLog } from "../../domain/entities/AuditLog";

export class InMemoryAuditRepository {
  private logs: AuditLog[] = [];

  async add(log: AuditLog) {
    this.logs.push(log);
    return log;
  }

  async list() {
    return [...this.logs];
  }

  async clear() {
    this.logs = [];
  }
}
