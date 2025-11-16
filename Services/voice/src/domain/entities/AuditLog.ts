export class AuditLog {
  constructor(
    public command: string,
    public status: string,
    public createdAt: Date = new Date(),
  ) {}
}
