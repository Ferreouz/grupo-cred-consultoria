import { Router, json } from "express";
import prisma from "../../prisma";
import { handlePrismaError } from "./prismaErrors";
import { formatUserForDisplay } from "../../utils/user";
import { createUserSchema, updateUserSchema } from "../../dto/user";
import { hashPassword } from "../../utils/password";

const router = Router();
router.use(json());

/**
 * GET /users
 */
router.get("/", async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  res.json({
    data: users.map(user => formatUserForDisplay(user)),
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  });
});

/**
 * GET /users/:id
 */
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(formatUserForDisplay(user));
});

/**
 * POST /users
 */
router.post("/", async (req, res) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    console.log("Creating user with data:", parsed.data);
    parsed.data.password = await hashPassword(parsed.data.password);
    
    const user = await prisma.user.create({
      data: parsed.data,
    });

    res.status(201).json(formatUserForDisplay(user));
  } catch (err) {
    console.log("Unable to create user:", err);
    const prismaError = handlePrismaError(err);

    if (prismaError) {
      return res
        .status(prismaError.status)
        .json({ error: prismaError.message });
    }
    res.status(400).json({ error: "Não foi possível criar o usuário" });
  }
});

/**
 * PUT /users/:id
 */
router.put("/:id", async (req, res) => {
  const idUpdate = req.params.id;


  try {
    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (parsed.data.password) {
      parsed.data.password = await hashPassword(parsed.data.password);
    }

    //check if user exists before updating
    const existingUser = await prisma.user.findUnique({
      where: { id: idUpdate }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    const userUpdated = await prisma.user.update({
      where: { id: idUpdate },
      data: parsed.data
    });

    res.json(formatUserForDisplay(userUpdated));
  } catch (err: any) {
    console.log('Unable to update user:', err);
    const prismaError = handlePrismaError(err);

    if (prismaError) {
      return res
        .status(prismaError.status)
        .json({ error: prismaError.message });
    }
    res.status(400).json({ error: "Não foi possível atualizar o usuário" });
  }
});

/**
 * DELETE /users/:id
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err: any) {
    console.log('Unable to delete user:', err);
    const prismaError = handlePrismaError(err);

    if (prismaError) {
      return res
        .status(prismaError.status)
        .json({ error: prismaError.message });
    }
    res.status(400).json({ error: "Erro ao deletar usuário" });
  }
});

export default router;
