import { Router, json } from "express";
import prisma from "../../prisma";
import { createOrderSchema } from "../../dto/order";
import { authMiddleware, AuthRequest } from "../../middleware/auth";

const router = Router();
router.use(json());

/**
 * GET /orders
 */
router.get("/", async (req, res) => {
  const userId = req.query.userId as string | undefined;

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: userId ? { userId } : undefined,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({
      where: userId ? { userId } : undefined,
    }),
  ]);

  res.json({
    data: orders,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
    },
  });
});
/**
 * GET /orders/:id
 */
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const order = await prisma.order.findUnique({
    where: { id }
  });

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  res.json(order);
});

/**
 * POST /orders
 */
router.post("/", authMiddleware, async (req: AuthRequest, res)  => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const dataToUpdate = {
      description: parsed.data.description,
      userId: req.user.id,
    }

    console.log("Creating order with data:", dataToUpdate);
    const order = await prisma.order.create({
      data: dataToUpdate,
    });

    res.status(201).json(order);
  } catch (err) {
    console.log("Unable to create order:", err);

    res.status(400).json({ error: "Não foi possível criar o pedido" });
  }
});

export default router;
