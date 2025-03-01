import express from "express";

const router = express.Router();


router.post("/cadastro", (req, res) => {
    const { nome, email, senha } = req.body;
  
    // Validação simples
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
  
    // Simulação de cadastro (aqui você pode salvar no banco de dados)
    console.log("Dados recebidos:", { nome, email, senha });
  
    // Resposta de sucesso
    res.status(201).json({ message: "Cadastro realizado com sucesso!" });
  });

export default router