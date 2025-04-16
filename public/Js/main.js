// main.js
import { login, register, logout, getUser, isLoggedIn } from './auth.js';
import { loadActivities, registerForActivity, cancelRegistration, createActivity, loadUserActivities } from './activities.js';
import { showSection, updateAuthUI, renderActivities, filterActivities, renderUserActivities } from './ui.js';


// Modais
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const manageActivityModal = document.getElementById('manage-activity-modal');

// Event Listeners para Modais
document.getElementById('login-button').addEventListener('click', () => loginModal.style.display = 'flex');
loginModal.querySelector('.close').addEventListener('click', () => loginModal.style.display = 'none');

document.getElementById('register-button').addEventListener('click', () => registerModal.style.display = 'flex');
registerModal.querySelector('.close').addEventListener('click', () => {
  registerModal.style.display = 'none';
  const registerMessage = document.getElementById('register-message');
  registerMessage.textContent = '';
  registerMessage.style.display = 'none';
});

document.getElementById('add-activity-button').addEventListener('click', () => manageActivityModal.style.display = 'flex');
manageActivityModal.querySelector('.close').addEventListener('click', () => manageActivityModal.style.display = 'none');

// SPA Navigation
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('home-section');
  });

  document.getElementById('explore-activities').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('activities-section');
  });

  document.getElementById('activities-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('activities-section');
  });

  document.getElementById('my-activities-link').addEventListener('click', async (e) => {
    e.preventDefault();
    showSection('my-activities-section');

    if (isLoggedIn()) {
        const token = localStorage.getItem('token');
        const userActivities = await loadUserActivities(token);
        renderUserActivities(userActivities);
      }
  });

  document.getElementById('admin-panel-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('admin-section');
  });

  showSection('home-section');
  updateAuthUI();
  loadActivities().then(renderActivities);
});

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-password').value;
  const result = await login(email, senha);

  if (result.success) {
    loginModal.style.display = 'none';
    updateAuthUI();
    loadActivities().then(renderActivities);
  } else {
    document.getElementById('login-message').textContent = result.data?.error || result.error;
  }
});

// Register Form Submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const senha = document.getElementById('register-password').value;

  const registerMessage = document.getElementById('register-message');

  // Limpa mensagens anteriores
  registerMessage.textContent = '';
  registerMessage.style.display = 'none';

  // Validação da senha
  if (senha.length < 8) {
    registerMessage.textContent = 'A senha deve ter pelo menos 8 caracteres.';
    registerMessage.style.display = 'block';
    return;
  }

  if (!/[A-Z]/.test(senha)) {
    registerMessage.textContent = 'A senha deve conter pelo menos uma letra maiúscula.';
    registerMessage.style.display = 'block';
    return;
  }

  if (!/[0-9]/.test(senha)) {
    registerMessage.textContent = 'A senha deve conter pelo menos um número.';
    registerMessage.style.display = 'block';
    return;
  }

  const result = await register(nome, email, senha);

  if (result.success) {
    registerMessage.textContent = '';
    registerMessage.style.display = 'none';
    registerModal.style.display = 'none';
    updateAuthUI();
    loadActivities().then(renderActivities);
  } else {
    registerMessage.textContent = result.error; // Exibe o erro retornado pelo backend
    registerMessage.style.display = 'block';
  }
});

// Logout Button
document.getElementById('logout-button').addEventListener('click', () => {
  logout();
  updateAuthUI();
  loadActivities().then(renderActivities);
});

// Activity Form Submission (Create/Update)
document.getElementById('activity-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('activity-input-title').value;
  const description = document.getElementById('activity-input-description').value;
  const date = document.getElementById('activity-input-date').value;
  const location = document.getElementById('activity-input-location').value;
  const maxParticipants = document.getElementById('activity-input-max-participants').value;

  const activityData = {
    title,
    description,
    date,
    location,
    maxParticipants: Number(maxParticipants)
  };

  const result = await createActivity(activityData, localStorage.getItem('token'));
  if (result.error) {
    document.getElementById('activity-form-message').textContent = result.error;
  } else {
    document.getElementById('activity-form-message').textContent = 'Atividade criada com sucesso!';
    manageActivityModal.style.display = 'none';
    loadActivities().then(renderActivities);
  }
});

// Activity List Event Delegation
document.getElementById('activities-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('register-btn')) {
      const activityId = e.target.dataset.activityId;
      const result = await registerForActivity(activityId, localStorage.getItem('token'));
      if (result.error) {
        alert(result.error);
      } else {
        alert('Inscrição realizada com sucesso!');
        loadActivities().then(renderActivities);
        // Atualizar minhas atividades também
        if (document.getElementById('my-activities-section').classList.contains('hide') === false) {
          loadUserActivities(localStorage.getItem('token')).then(renderUserActivities);
        }
      }
    } else if (e.target.classList.contains('cancel-btn')) {
      const activityId = e.target.dataset.activityId;
      const result = await cancelRegistration(activityId, localStorage.getItem('token'));
      if (result.error) {
        alert(result.error);
      } else {
        alert('Inscrição cancelada com sucesso!');
        loadActivities().then(renderActivities);
        // Atualizar minhas atividades também
        if (document.getElementById('my-activities-section').classList.contains('hide') === false) {
          loadUserActivities(localStorage.getItem('token')).then(renderUserActivities);
        }
      }
    }
});

document.getElementById('my-activities-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('cancel-btn')) {
      const activityId = e.target.dataset.activityId;
      const result = await cancelRegistration(activityId, localStorage.getItem('token'));
      if (result.error) {
        alert(result.error);
      } else {
        alert('Inscrição cancelada com sucesso!');
        loadActivities().then(renderActivities);
        const token = localStorage.getItem('token');
        const updatedActivities = await loadUserActivities(token);
        console.log(updatedActivities,"updatedActivities na main.js");
        
        renderUserActivities(updatedActivities);
      }
    }
});
  
// Filter Activities
document.getElementById('filter-activity').addEventListener('change', filterActivities);
document.getElementById('search-activity').addEventListener('input', filterActivities);