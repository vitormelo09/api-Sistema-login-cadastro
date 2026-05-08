import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Token não enviado");
  }

  const token = authHeader.split(" ")[1];

  try {
    const usuario = jwt.verify(
      token,
      "segredo_super_secreto"
    );

    req.usuario = usuario;
    next();

  } catch (erro) {
    return res.status(403).send("Token inválido");
  }
}