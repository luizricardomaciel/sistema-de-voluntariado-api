import express from "express";
import path from "path";
import publicRoutes from "./routes/public.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/" ,publicRoutes)

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join("./public")));

// Rota da API
app.get("/api/data", (req, res) => {
  res.json({ message: "Dados da API!" });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

