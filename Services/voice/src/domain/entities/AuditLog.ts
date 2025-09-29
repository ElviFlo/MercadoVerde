export type CommandResult = "accepted" | "rejected" | "ambiguous" | "error" | "needs_login";

export class AuditLog {
  constructor(
    public id: string,
    public userId: string | null,
    public source: string | null,
    public text: string,
    public confidence: number | null,
    public timestamp: string,
    public result: CommandResult,
    public details?: any
  ) {}
}
