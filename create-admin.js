import { openDB, closeDB, put } from './db.js';
import { hashPassword } from './utils/passwordUtils.js';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do .env

async function createAdmin() {
  try {
    await openDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no arquivo .env");
    }

    const adminUser = {
      nome: "Admin",
      email: adminEmail,
      senha: await hashPassword(adminPassword), // Criptografar a senha
      isAdmin: true
    };

    await put(`user:${adminUser.email}`, JSON.stringify(adminUser));
    console.log("Admin criado com sucesso!");

  } catch (error) {
    console.error("Erro ao criar admin:", error);
  } finally {
    await closeDB();
  }
}

createAdmin();