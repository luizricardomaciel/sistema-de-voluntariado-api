import express from "express";
import { authenticate, isAdmin } from "../auth.js";
import { put, get, getActivityKeys, addActivityKey } from "../db.js"; // <-- Adicione createReadStream

const router = express.Router();

// Listar todas as atividades (GET /api/activities)
router.get('/activities', async (req, res) => {
    try {
      console.log('Iniciando busca de atividades...');
      
      const activityKeys = await getActivityKeys();
      console.log('Chaves de atividades encontradas:', activityKeys);
  
      const activities = await Promise.all(
        activityKeys.map(async (key) => {
          console.log('Buscando atividade com chave:', key);
          const activityData = await get(key);
          return JSON.parse(activityData);
        })
      );
  
      console.log('Atividades recuperadas:', activities);
      res.json(activities);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar atividades',
        details: error.message 
      });
    }
  });

// Criar atividade (POST /api/activities)
router.post('/activities', authenticate, isAdmin, async (req, res) => {
    const { title, description, date, location, maxParticipants } = req.body;
    console.log('Dados recebidos:', { title, description, date, location, maxParticipants });
  
    try {
      const activityId = Date.now().toString();
      console.log('Criando atividade com ID:', activityId);
  
      // Salva a atividade no banco de dados
      await put(`activity:${activityId}`, JSON.stringify({
        id: activityId,
        title,
        description,
        date,
        location,
        maxParticipants: Number(maxParticipants), // Garante que é um número
        participants: []
      }));
      console.log('Atividade salva no banco de dados.');
  
      // Adiciona a chave da atividade à lista de chaves
      await addActivityKey(`activity:${activityId}`);
      console.log('Chave da atividade adicionada à lista.');
  
      res.status(201).json({ message: 'Atividade criada!' });
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      res.status(500).json({ 
        error: 'Erro ao salvar atividade',
        details: error.message 
      });
    }
  });

export default router;