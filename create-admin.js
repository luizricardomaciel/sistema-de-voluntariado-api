import { openDB, closeDB, put } from './db.js';

async function createAdmin() {
  try {
    await openDB();

    const adminUser = {
      nome: "Admin",
      email: "admin@example.com",
      senha: "SenhaSuperSegura123!", // Troque por uma senha forte
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