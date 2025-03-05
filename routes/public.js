import express from "express";
import { generateToken, authenticate } from "../auth.js";
import { put, get } from "../db.js";
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

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

// Modificar a rota de cadastro
router.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        console.log(email,nome,senha);
        

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

        const hashedPassword = await hashPassword(senha);
        const userId = Date.now().toString();
        const userData = {
            id: userId,
            nome,
            email,
            senha: hashedPassword
        };

        await put(`user:${email}`, JSON.stringify(userData));
        res.status(201).json({ message: "Cadastro realizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar cadastro" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        console.log('Login attempt for:', email);
        
        const userData = await get(`user:${email}`);
        console.log('User data found:', userData);

        if (!userData) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const user = JSON.parse(userData);
        const senhaCorreta = await comparePassword(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "Email ou senha incorretos" });
        }

        const token = generateToken(user);
        res.json({ token, user: { 
            id: user.id, 
            nome: user.nome, 
            email: user.email,
            isAdmin: user.isAdmin 
        }});
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: "Email ou senha incorretos" });
    }
});

export default router;
