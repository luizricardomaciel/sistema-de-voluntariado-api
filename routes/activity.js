import express from "express";
import { authenticate, isAdmin } from "../auth.js";
import { put, get, del, getActivityKeys, addActivityKey } from "../db.js"; // <-- Adicione createReadStream

const router = express.Router();

// Listar todas as atividades (GET /api/activities)
router.get('/activities', async (req, res) => {
    try {
      console.log('Iniciando busca de atividades...');
      
      let activityKeys = await getActivityKeys();
      console.log('Chaves de atividades encontradas:', activityKeys);
  
      const activities = [];
      const validKeys = [];

      for (const key of activityKeys) {
        try {
          const activityData = await get(key);
          if (activityData) {
            // Convert Buffer to string before parsing
            const activityString = activityData.toString();
            activities.push(JSON.parse(activityString));
            validKeys.push(key);
          }
        } catch (err) {
          console.log(`Erro ao processar atividade ${key}:`, err);
        }
      }

      await put('activityKeys', JSON.stringify(validKeys));
  
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

// Criar uma nova atividade (POST /api/activities)
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
  
// Registrar usuário em uma atividade (POST /api/activities/:activityId/register)
router.post('/activities/:activityId/register', authenticate, async (req, res) => {
    try {
      const { activityId } = req.params;
      // Pegando dados direto do JWT decodificado
      const { email, id, nome } = req.user;
      
    
      const activityData = await get(`activity:${activityId}`);
      if (!activityData) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }

      const activity = JSON.parse(activityData);
    
      if (!activity.participants) {
        activity.participants = [];
      }
    
      activity.participants = activity.participants.filter(p => p !== null);
    
      // Usando os dados do participante do JWT
      const participant = {
        id,
        email,
        nome
      };
    
      if (activity.participants.some(p => p.email === email)) {
        return res.status(400).json({ error: 'Usuário já está inscrito nesta atividade' });
      }

      if (activity.participants.length >= activity.maxParticipants) {
        return res.status(400).json({ error: 'Atividade já atingiu o número máximo de participantes' });
      }

      activity.participants.push(participant);
    
      await put(`activity:${activityId}`, JSON.stringify(activity));

      res.json({ message: 'Inscrição realizada com sucesso' });
    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      res.status(500).json({ error: 'Erro ao processar inscrição' });
    }
});

// Remover usuário de uma atividade (DELETE /api/activities/:activityId/register)
router.delete('/activities/:activityId/register', authenticate, async (req, res) => {
    try {
      const { activityId } = req.params;
      const userEmail = req.user.email;

      const activityData = await get(`activity:${activityId}`);
      if (!activityData) {
        return res.status(404).json({ error: 'Atividade não encontrada' });
      }

      const activity = JSON.parse(activityData);

      // Verifica se a atividade já começou
      const activityDate = new Date(activity.date);
      const now = new Date();
      if (activityDate < now) {
        return res.status(400).json({ error: 'Não é possível cancelar inscrição de atividades já iniciadas' });
      }

      // Verifica se o usuário está inscrito
      const participantIndex = activity.participants.findIndex(p => p.email === userEmail);
      if (participantIndex === -1) {
        return res.status(400).json({ error: 'Usuário não está inscrito nesta atividade' });
      }

      // Remove o usuário da lista de participantes
      activity.participants.splice(participantIndex, 1);
    
      await put(`activity:${activityId}`, JSON.stringify(activity));

      res.json({ message: 'Inscrição cancelada com sucesso' });

    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      res.status(500).json({ error: 'Erro ao processar cancelamento' });
    }
});
// Rota para editar atividade
router.put('/activities/:activityId', authenticate, isAdmin, async (req, res) => {
  try {
    const { activityId } = req.params;
    const { title, description, date, location, maxParticipants } = req.body;

    const activityData = await get(`activity:${activityId}`);
    if (!activityData) {
      return res.status(404).json({ error: 'Atividade não encontrada' });
    }

    const activity = JSON.parse(activityData);
    
    // Atualiza os campos
    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.location = location || activity.location;
    activity.maxParticipants = maxParticipants || activity.maxParticipants;

    await put(`activity:${activityId}`, JSON.stringify(activity));
    res.json({ message: 'Atividade atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).json({ error: 'Erro ao atualizar atividade' });
  }
});

// Rota para deletar atividade
router.delete('/activities/:activityId', authenticate, isAdmin, async (req, res) => {
  try {
    const { activityId } = req.params;
    
    const activityData = await get(`activity:${activityId}`);
    if (!activityData) {
      return res.status(404).json({ error: 'Atividade não encontrada' });
    }

    // Remove a atividade
    await del(`activity:${activityId}`);
    
    // Remove a chave da lista de atividades
    const activityKeys = await getActivityKeys();
    const updatedKeys = activityKeys.filter(key => key !== `activity:${activityId}`);
    await put('activityKeys', JSON.stringify(updatedKeys));

    res.json({ message: 'Atividade removida com sucesso' });

  } catch (error) {
    console.error('Erro ao remover atividade:', error);
    res.status(500).json({ error: 'Erro ao remover atividade' });
  }
});

// Rota para buscar atividades do usuário
router.get('/my-activities', authenticate, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const activityKeys = await getActivityKeys();
    const myActivities = [];

    for (const key of activityKeys) {
      const activityData = await get(key);
      if (activityData) {
        const activity = JSON.parse(activityData.toString());
        if (activity.participants.some(p => p.email === userEmail)) {
          myActivities.push(activity);
        }
      }
    }

    res.json(myActivities);
  } catch (error) {
    console.error('Erro ao buscar atividades do usuário:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar suas atividades',
      details: error.message 
    });
  }
});

// Rota para visualizar a lista de participantes de uma atividade
router.get('/activities/:activityId/participants', authenticate, isAdmin, async (req, res) => {
    try {
        const { activityId } = req.params;
        const activityData = await get(`activity:${activityId}`);
        if (!activityData) {
            return res.status(404).json({ error: 'Atividade não encontrada' });
        }
        const activity = JSON.parse(activityData);
        res.json(activity.participants || []);
    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
        res.status(500).json({ error: 'Erro ao buscar participantes' });
    }
});

export default router;