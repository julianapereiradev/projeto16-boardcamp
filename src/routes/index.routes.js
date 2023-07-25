import { Router } from "express";
import testeRouter from "./teste.routes.js";
import gameRouter from "./game.routes.js";

const router = Router();

router.use(testeRouter)
router.use(gameRouter)

export default router;