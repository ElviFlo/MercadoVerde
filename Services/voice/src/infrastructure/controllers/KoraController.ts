// src/infrastructure/controllers/KoraController.ts
import { Response } from "express";
import { ProcessCommand } from "../../application/use-cases/ProcessCommand";
import { AuthRequest } from "../middlewares/auth.middleware";

export class KoraController {
  private readonly processCommand: ProcessCommand;

  constructor() {
    this.processCommand = new ProcessCommand();
  }

  async handleCommand(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { text } = req.body;

      if (!text || text.trim() === "") {
        return res
          .status(400)
          .json({ message: "No se recibió ningún comando." });
      }

      if (!req.token) {
        // Si llegas aquí, algo falló en el middleware
        return res
          .status(401)
          .json({ message: "No se encontró token de autenticación." });
      }

      // Pasamos el texto y el JWT crudo al use–case
      const result = await this.processCommand.execute(text, req.token);

      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Error en KoraController:", error);
      return res
        .status(500)
        .json({ message: "Error procesando el comando de voz." });
    }
  }
}
