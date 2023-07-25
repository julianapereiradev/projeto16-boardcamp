import { Router } from "express";
import { getCustomerId, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.controllers.js";

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.post("/customers", postCustomer)
customersRouter.get("/customers/:id", getCustomerId)
customersRouter.post("/customers/:id", updateCustomer)

export default customersRouter