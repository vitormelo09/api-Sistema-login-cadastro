import express from "express";
import {
  cadastrar,
  login
} from "../controllers/authController.js";

import {
  autenticarToken
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// rota GET
router.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// rota cadastro
router.post("/cadastro", cadastrar);

// rota login
router.post("/login", login);

// rota protegida
router.get("/inicio", autenticarToken, (req, res) => {
  res.json({
    message: "Bem-vindo à página inicial",
    usuario: req.usuario
  });
});

export default router;