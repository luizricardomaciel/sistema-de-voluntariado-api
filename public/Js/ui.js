// ui.js
import { isLoggedIn, getUser } from './auth.js';
import { loadActivities } from './activities.js';

export function showSection(sectionId) {
  document.querySelectorAll('.section').forEach((section) => {
    section.classList.add('hide');
  });
  document.getElementById(sectionId).classList.remove('hide');
}

export function updateAuthUI() {
  const user = getUser();
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const logoutButton = document.getElementById('logout-button');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const adminLinks = document.querySelectorAll('.admin-required');
  const adminPanelLink = document.getElementById('admin-panel-link');

  if (isLoggedIn()) {
    userName.textContent = user.nome;
    userInfo.classList.remove('hide');
    registerButton.classList.add('hide');
    loginButton.classList.add('hide');
    logoutButton.classList.remove('hide');

    if (user.isAdmin) {
      adminLinks.forEach(el => el.classList.remove('hide'));
      adminPanelLink.classList.remove('hide');
    } else {
      adminPanelLink.classList.add('hide');
    }
  } else {
    userInfo.classList.add('hide');
    registerButton.classList.remove('hide');
    loginButton.classList.remove('hide');
    logoutButton.classList.add('hide');
    adminLinks.forEach(el => el.classList.add('hide'));
    adminPanelLink.classList.add('hide');
  }
}

export function renderActivities(activities) {
  const activitiesList = document.getElementById('activities-list');
  activitiesList.innerHTML = '';

  activities.forEach(activity => {
    const isRegistered = activity.participants.some(p => p.email === getUser()?.email);
    const activityCard = document.createElement('div');
    activityCard.className = 'activity-card';
    activityCard.innerHTML = `
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <p><strong>Data:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
      <p><strong>Local:</strong> ${activity.location}</p>
      <p><strong>Vagas restantes:</strong> ${activity.maxParticipants - activity.participants.length}</p>
      ${isRegistered ? 
        `<button class="btn cancel-btn" data-activity-id="${activity.id}">Cancelar Inscrição</button>` :
        `<button class="btn register-btn" data-activity-id="${activity.id}">Inscrever-se</button>`
      }
    `;
    activitiesList.appendChild(activityCard);
  });
}

// Adicione em ui.js
export function renderUserActivities(activities) {
  const myActivitiesList = document.getElementById('my-activities-list');
  myActivitiesList.innerHTML = '';
  

  if (activities.length === 0) {
    myActivitiesList.innerHTML = '<p class="empty-list">Você não está inscrito em nenhuma atividade.</p>';
    return;
  }

  activities.forEach(activity => {
    const activityCard = document.createElement('div');
    activityCard.className = 'activity-card';
    activityCard.innerHTML = `
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <p><strong>Data:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
      <p><strong>Local:</strong> ${activity.location}</p>
      <p><strong>Vagas restantes:</strong> ${activity.maxParticipants - activity.participants.length}</p>
      <button class="btn cancel-btn" data-activity-id="${activity.id}">Cancelar Inscrição</button>
    `;
    myActivitiesList.appendChild(activityCard);
  });
}

export function filterActivities() {
  const filterValue = document.getElementById('filter-activity').value;
  const searchValue = document.getElementById('search-activity').value.toLowerCase();
  const allActivities = document.querySelectorAll('.activity-card');

  allActivities.forEach(card => {
    let show = true;

    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    if (!title.includes(searchValue) && !description.includes(searchValue)) {
      show = false;
    }

    if (filterValue === 'available') {
      const spots = parseInt(card.querySelector('p:nth-child(5)').textContent.match(/\d+/)[0]);
      if (spots <= 0) show = false;
    }

    if (filterValue === 'upcoming') {
      const dateText = card.querySelector('p:nth-child(3)').textContent;
      const activityDate = new Date(dateText.split(':')[1]);
      if (activityDate < new Date()) show = false;
    }

    card.style.display = show ? 'block' : 'none';
  });
}