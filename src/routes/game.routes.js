import { Router } from "express";
import { postGame } from "../controllers/game.controllers.js"
import { validationschema } from "../middlewares/validationschema.middleware.js";
import { gameSchema } from "../schemas/game.schemas.js";

const gameRouter = Router()

gameRouter.post("/games", validationschema(gameSchema), postGame)

export default gameRouter