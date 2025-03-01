import express from "express";
import path from "path";
import publicRoutes from "./routes/public.js";
import { openDB, closeDB } from "./db.js";
import dotenv from "dotenv";
import activityRoutes from "./routes/activity.js";

dotenv.config(); // Carrega as variáveis do .env
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Abre o banco de dados ao iniciar o servidor
openDB().then(() => {
    console.log("Banco de dados RocksDB aberto com sucesso!");
}).catch(err => {
    console.error("Erro ao abrir o banco de dados:", err);
});

app.use("/", publicRoutes);
app.use("/", activityRoutes);

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join("./public")));

// Rota da API
app.get("/api/data", (req, res) => {
    res.json({ message: "Dados da API!" });
});

// Fecha o banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
    closeDB().then(() => {
        console.log("Banco de dados RocksDB fechado com sucesso!");
        process.exit();
    }).catch(err => {
        console.error("Erro ao fechar o banco de dados:", err);
        process.exit(1);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});