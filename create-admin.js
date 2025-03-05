import { openDB, closeDB, put } from './db.js';
import { hashPassword } from './utils/passwordUtils.js'; // Certifique-se de que a função hashPassword está exportada de auth.js

async function createAdmin() {
  try {
    await openDB();

    const adminUser = {
      nome: "Admin",
      email: "admin@example.com",
      senha: await hashPassword("SenhaSuperSegura123@"), // Criptografar a senha
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