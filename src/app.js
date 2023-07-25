import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router)
dotenv.config();


//PORT:
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`O servidor está rodando na porta ${PORT}!`)
);
