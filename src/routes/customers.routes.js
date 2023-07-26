import { Router } from "express";
import { getCustomerId, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.controllers.js";
import { validationschema } from "../middlewares/validationschema.middleware.js";
import { customerSchema } from "../schemas/customers.schemas.js";

const customersRouter = Router()

customersRouter.get("/customers", getCustomers)
customersRouter.post("/customers", validationschema(customerSchema),postCustomer)
customersRouter.get("/customers/:id", getCustomerId)
customersRouter.put("/customers/:id", validationschema(customerSchema), updateCustomer)

export default customersRouter