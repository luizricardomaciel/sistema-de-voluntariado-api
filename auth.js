import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env

// Use process.env para acessar as variáveis
const SECRET_KEY = process.env.SECRET_KEY;


// Função para gerar token JWT
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      nome: user.nome,
      isAdmin: user.isAdmin || false 
    }, 
    SECRET_KEY, 
    { expiresIn: "1h" }
  );
};


// Middleware de autenticação
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação necessário!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Aqui é onde req.user é criado
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado!" });
  }
};

// Middleware para verificar admin
export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Acesso negado: recurso exclusivo para administradores!" });
  }
  next();
};