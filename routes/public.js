import express from "express";
import { generateToken, authenticate } from "../auth.js";
import { put, get } from "../db.js";

const router = express.Router();

// Funções de validação
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(senha) {
    // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(senha);
}

// Atualizar a rota de cadastro
router.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Email inválido." });
        }

        if (!isValidPassword(senha)) {
            return res.status(400).json({
                error: "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
            });
        }

        const userId = Date.now().toString();
        const userData = {
            id: userId,
            nome,
            email,
            senha
        };

        await put(`user:${email}`, JSON.stringify(userData));
        res.status(201).json({ message: "Cadastro realizado com sucesso!" });

    } catch (err) {
        res.status(500).json({ err });
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