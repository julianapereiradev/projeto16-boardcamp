import { Router } from "express";
import testeRouter from "./teste.routes.js";

const router = Router();

router.use(testeRouter)

export default router;