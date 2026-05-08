import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/database.js";
import dotenv from "dotenv";

//carregar o arquivo .env
dotenv.config();

// cadastro
export async function cadastrar(req, res) {
  const { email, senha } = req.body;

  try {
    // verificar se já existe usuário
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).send("Email já cadastrado");
    }

    // gerar hash da senha
    const saltRounds = 8;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // salvar no banco
    await db.execute(
      "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
      [email, senhaHash]
    );

    res.status(201).send("Usuário cadastrado com sucesso 🔐");
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao cadastrar");
  }
}

// login
export async function login(req, res) {
  const { email, senha } = req.body;

  try {
    // buscar usuário no banco
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    const usuario = rows[0];

    // verificar se existe
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado");
    }

    // comparar senha com bcrypt
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).send("Senha incorreta");
    }

    // criar token

    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login realizado com sucesso 🚀",
      token: token
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro no login");
  }
}