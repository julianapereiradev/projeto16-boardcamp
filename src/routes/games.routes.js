import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controllers.js"
import { validationschema } from "../middlewares/validationschema.middleware.js";
import { gameSchema } from "../schemas/games.schemas.js";

const gameRouter = Router()
gameRouter.get("/games", getGames)
gameRouter.post("/games", validationschema(gameSchema), postGame)

export default gameRouter