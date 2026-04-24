import { Prisma } from "@prisma/client";

export function handlePrismaError(err: unknown): {
  status: number;
  message: string;
} | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = err.meta?.target as string[] | undefined;

        if (target?.includes("email")) {
          return {
            status: 409,
            message: "Um usuário com este email já existe"
          };
        }

        if (target?.includes("login")) {
          return {
            status: 409,
            message: "Um usuário com este login já existe"
          };
        }

        if (target?.includes("cpf")) {
          return {
            status: 409,
            message: "Um usuário com este CPF já existe"
          };
        }

        return {
          status: 409,
          message: "Violação da constraint única"
        };
      }

      case "P2025":
        return {
          status: 404,
          message: "Usuário não encontrado"
        };
    }
  }

  return null;
}
