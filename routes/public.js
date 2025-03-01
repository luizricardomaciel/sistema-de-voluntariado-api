import express from "express";
import { generateToken, authenticate } from "../auth.js";
import { put, get } from "../db.js";

const router = express.Router();

router.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        await put(`user:${email}`, JSON.stringify({ nome, email, senha }));
        res.status(201).json({ message: "Cadastro realizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao salvar usuário no banco de dados." });
    }
});

router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const userData = await get(`user:${email}`);
        if (!userData) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const user = JSON.parse(userData);
        if (user.senha !== senha) {
            return res.status(401).json({ error: "Senha incorreta." });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar usuário no banco de dados." });
    }
});

export default router;