import { z } from "zod";

// ======================
// Base schema
// ======================
const baseOrderSchema = z.object({
  description: z.string({message: "Descrição (string) é obrigatória"}).min(6, "Descrição deve ter pelo menos 6 caracteres"),
});

export const createOrderSchema = baseOrderSchema;
