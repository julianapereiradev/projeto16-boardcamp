import { Router } from "express";
import { teste } from "../controllers/teste.controllers.js";


const testeRouter = Router()

testeRouter.get("/teste", teste)

export default testeRouter