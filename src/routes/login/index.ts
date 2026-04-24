import { Router, json } from "express";
import prisma from "../../prisma";
import { passwordMatches } from "../../utils/password";
import { generateToken } from "../../utils/jwt";

const router = Router();
router.use(json());

/**
 * POST /login
 */
router.post("/", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { login }
    });

    if (!user) {
      await passwordMatches(password, "$argon2id$v=19$m=65536,t=3,p=4$4G7iUeUXVgI15XozZzzNXA$1ZC1RdK0eP6qMutwklawcu8iGDNgH2LW33iyt6I9yZg"); // fake hash to prevent timing attacks
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const isMatch = await passwordMatches(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = generateToken({
      id: user.id,
      login: user.login,
    });


    return res.json({ token });

  } catch (err) {
    console.log("Unable to login user:", err);
    res.status(400).json({ error: "Não foi possível fazer login" });
  }
});


export default router;
