// activities.js
export async function loadActivities() {
  try {
    const response = await fetch('/activities');
    const activities = await response.json();
    return activities;
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    return [];
  }
}

export async function registerForActivity(activityId, token) {
  try {
    const response = await fetch(`/activities/${activityId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao realizar inscrição:', error);
    return { error: 'Erro ao realizar inscrição' };
  }
}

export async function cancelRegistration(activityId, token) {
  try {
    const response = await fetch(`/activities/${activityId}/register`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    if (response.ok) {
      return { success: true, ...result };
    }
    return { success: false, error: result.error };
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    return { success: false, error: 'Erro ao cancelar inscrição' };
  }
}
export async function createActivity(activityData, token) {
  try {
    const response = await fetch('/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(activityData)
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    return { error: 'Erro ao criar atividade' };
  }
}

export async function loadUserActivities(token) {
  try {
    const response = await fetch('/my-activities', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const activities = await response.json();
    
    return activities;
  
  } catch (error) {
    console.error('Erro ao carregar atividades do usuário:', error);
    return [];
  }
}