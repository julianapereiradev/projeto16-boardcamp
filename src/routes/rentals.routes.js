import { Router } from "express";
import { getRentals, postRental, sendFinalRental, deleteRental } from "../controllers/rentals.controllers.js";
import { validationschema } from "../middlewares/validationschema.middleware.js";
import { rentalSchema } from "../schemas/rentals.schemas.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validationschema(rentalSchema), postRental)
rentalsRouter.post("/rentals/:id/return", sendFinalRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter