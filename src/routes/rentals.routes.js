import { Router } from "express";
import { getRentals, postRental, sendFinalRental, deleteRental } from "../controllers/rentals.controllers";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", postRental)
rentalsRouter.post("/rentals/:id/return", sendFinalRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter