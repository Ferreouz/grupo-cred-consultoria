import { z } from "zod";
import { isValidCPF } from "../utils/user";

// ======================
// Base schema
// ======================
const baseUserSchema = z.object({
  name: z.string({message: "Nome (string) é obrigatório"}).min(3, "Nome deve ter pelo menos 3 caracteres"),

  email: z.email("Endereço de email inválido"),

  password: z.string({message: "Senha (string) é obrigatória"}).min(6, "Senha deve ter pelo menos 6 caracteres"),
  login: z
    .string({message: "Login é obrigatório"})
    .regex(/^[a-zA-Z0-9_]{4,20}$/, "Login inválido"),

  age: z.number({message: "Idade (número) é obrigatória"}).min(0).max(120),

  cpf: z
    .string({message: "CPF (string) é obrigatório"})
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => isValidCPF(val), "CPF inválido"),

  rg: z
    .string({message: "RG (string) é obrigatório"})
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => /^\d{7,14}$/.test(val), "RG inválido"),
});

export const createUserSchema = baseUserSchema;

export const updateUserSchema = baseUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser enviado para atualização",
  });