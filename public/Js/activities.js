//SISTEMA LOGIN
const login_modal = document.getElementById("login-modal");
document.getElementById("login-button").addEventListener("click", showLoginModal);
login_modal.querySelector(".close").addEventListener("click", () => {
  login_modal.style.display = "none";
});

// Event listener para o botão de login/logout
document.getElementById('login-button').addEventListener('click', showLoginModal);

//SISTEMA CADASTRO
const register_modal = document.getElementById("register-modal");
document.getElementById("register-button").addEventListener("click", () => {
  register_modal.style.display = "flex";
});
register_modal.querySelector(".close").addEventListener("click", () => {
  register_modal.style.display = "none";
});

// SPA
document.addEventListener("DOMContentLoaded", function () {
  // Função para esconder todas as seções
  function hideAllSections() {
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.add("hide");
    });
  }

  // Função para mostrar uma seção específica
  function showSection(sectionId) {
    hideAllSections();
    document.getElementById(sectionId).classList.remove("hide");
  }

  // Adiciona eventos de clique aos links do header
  document.getElementById("home-link").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("home-section");
  });

  document.getElementById("explore-activities").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("activities-section");
  });

  document.getElementById("activities-link").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("activities-section");
  });

  document.getElementById("my-activities-link").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("my-activities-section");
  });

  document.getElementById("admin-panel-link").addEventListener("click", function (e) {
    e.preventDefault();
    showSection("admin-section");
  });

  // Mostra a seção inicial ao carregar a página
  showSection("home-section");
});

//NOVA ATIVIDADE
const manage_activity = document.getElementById("manage-activity-modal");
document.getElementById("add-activity-button").addEventListener("click", () => {
  manage_activity.style.display = "flex";
});
manage_activity.querySelector(".close").addEventListener("click", () => {
  manage_activity.style.display = "none";
});


async function loadActivities() {
  try {
    const response = await fetch("/activities");
    const activities = await response.json();
    console.log(activities);

    renderActivities(activities);
  } catch (error) {
    console.error("Erro ao carregar atividades:", error);
  }
}

function isUserRegistered(activity) {
  const user = JSON.parse(localStorage.getItem('user'));
  return activity.participants.some(p => p.email === user.email);
}

function renderActivities(activities) {
  const activitiesList = document.getElementById("activities-list");
  activitiesList.innerHTML = "";

  activities.forEach(activity => {
    const isRegistered = isUserRegistered(activity);
    const activityCard = document.createElement("div");
    activityCard.className = "activity-card";
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

  addButtonEventListeners();
}

function addButtonEventListeners() {
  document.querySelectorAll('.register-btn').forEach(button => {
    button.addEventListener('click', handleRegistration);
  });

  document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', handleCancellation);
  });
}

async function handleRegistration(e) {
  const activityId = e.target.dataset.activityId;
  try {
    const response = await fetch(`/activities/${activityId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert('Inscrição realizada com sucesso!');
      loadActivities();
    } else {
      alert(data.error || 'Erro ao realizar inscrição');
    }
  } catch (error) {
    alert('Erro ao realizar inscrição');
    console.error(error);
  }
}

async function handleCancellation(e) {
  const activityId = e.target.dataset.activityId;
  try {
    const response = await fetch(`/activities/${activityId}/register`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert('Inscrição cancelada com sucesso!');
      loadActivities();
    } else {
      alert(data.error || 'Erro ao cancelar inscrição');
    }
  } catch (error) {
    alert('Erro ao cancelar inscrição');
    console.error(error);
  }
}
// Carregar atividades quando a página for carregada
document.addEventListener("DOMContentLoaded", loadActivities);


async function login(email, senha) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();

    if (!response.ok) {
      const loginMessage = document.getElementById('login-message');
      loginMessage.textContent = data.error;
      loginMessage.classList.add('error-message');

      if (data.field === 'email') {
        document.getElementById('login-email').classList.add('input-invalid');
      } else if (data.field === 'password') {
        document.getElementById('login-password').classList.add('input-invalid');
      }
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    updateUI();

    document.getElementById('login-modal').style.display = 'none';

    document.getElementById('login-message').textContent = '';
    document.getElementById('login-email').classList.remove('input-invalid');
    document.getElementById('login-password').classList.remove('input-invalid');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
}

// Função para fazer cadastro
async function register(nome, email, senha) {
  try {
    const response = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Atualizar a interface com base no tipo de usuário
      updateUI();
    } else {
      console.error('Erro ao fazer cadastro:', data.error);
    }
  } catch (error) {
    console.error('Erro ao fazer cadastro:', error);
  }
}

// Função para atualizar a interface com base no tipo de usuário
function updateUI() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const logoutButton = document.getElementById('logout-button');
  if (user) {
    document.getElementById('user-name').textContent = user.nome;
    document.getElementById('user-info').classList.remove('hide');
    registerButton.classList.add('hide');
    loginButton.classList.add('hide');
    logoutButton.classList.remove('hide');
    if (user.isAdmin) {
      document.querySelectorAll('.admin-required').forEach(el => el.classList.remove('hide'));
      document.getElementById('admin-panel-link').classList.remove('hide');
    } else {
      document.getElementById('admin-panel-link').classList.add('hide');
    }
  } else {
    document.getElementById('user-info').classList.add('hide');
    registerButton.classList.remove('hide');
    loginButton.classList.remove('hide');
    logoutButton.classList.add('hide');
    document.querySelectorAll('.admin-required').forEach(el => el.classList.add('hide'));
    document.getElementById('admin-panel-link').classList.add('hide');
  }
}

// Função para mostrar o modal de login
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
}

// Função para realizar logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateUI();
}

// Chamar updateUI ao carregar a página
document.addEventListener('DOMContentLoaded', updateUI);

// Event listener para o botão de logout
document.getElementById('logout-button').addEventListener('click', logout);

// Event listener para o formulário de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-password').value;
  const loginMessage = document.getElementById('login-message');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');

  // Limpar mensagens de erro e campos
  loginMessage.textContent = '';
  loginEmail.classList.remove('input-invalid');
  loginPassword.classList.remove('input-invalid');

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.error;
      loginMessage.classList.add('error-message');

      if (data.field === 'email') {
        loginEmail.classList.add('input-invalid');
      } else if (data.field === 'password') {
        loginPassword.classList.add('input-invalid');
      }
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    updateUI();

    // Fechar o modal apenas em caso de sucesso
    document.getElementById('login-modal').style.display = 'none';

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    loginMessage.textContent = 'Erro ao fazer login';
    loginMessage.classList.add('error-message');
  }
});

// Função para validar nome
function isValidName(nome) {
  return nome.length > 0;
}

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar senha
function isValidPassword(senha) {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(senha);
}

// Event listener para o formulário de cadastro
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const senha = document.getElementById('register-password').value;
  const registerMessage = document.getElementById('register-message');
  const passwordInput = document.getElementById('register-password');

  // Limpar mensagens de erro anteriores
  registerMessage.textContent = '';
  passwordInput.classList.remove('input-invalid');

  // Validação dos dados
  if (!isValidName(nome)) {
    console.error('Nome inválido');
    registerMessage.textContent = 'Nome inválido';
    return;
  }

  if (!isValidEmail(email)) {
    console.error('Email inválido');
    registerMessage.textContent = 'Email inválido';
    return;
  }

  if (!isValidPassword(senha)) {
    registerMessage.textContent = 'Senha inválida';
    passwordInput.classList.add('input-invalid');
    return;
  }

  await register(nome, email, senha);
  document.getElementById('register-modal').style.display = 'none';
});

// Event listener para o formulário de criação/atualização de atividade
document.getElementById('activity-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Captura os valores dos campos do modal
  const title = document.getElementById('activity-input-title').value;
  const description = document.getElementById('activity-input-description').value;
  const date = document.getElementById('activity-input-date').value;
  const location = document.getElementById('activity-input-location').value;
  const maxParticipants = document.getElementById('activity-input-max-participants').value;

  const payload = {
    title,
    description,
    date,
    location,
    maxParticipants: Number(maxParticipants)
  };
  console.log(payload);
  

  try {
    // Faz a requisição para criar nova atividade (endpoint protegido, portanto é necessário token JWT no header)
    const response = await fetch('/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    // Confere se a resposta foi bem‐sucedida
    if (!response.ok) {
      const errorData = await response.json();
      document.getElementById('activity-form-message').textContent = errorData.error || 'Erro ao criar atividade';
      return;
    }

    // Se a criação foi bem-sucedida, exibe mensagem e recarrega as atividades
    document.getElementById('activity-form-message').textContent = 'Atividade criada com sucesso!';
    // Opcional: atualizar a lista de atividades na página
    loadActivities();
    // Fecha o modal
    document.getElementById('manage-activity-modal').style.display = 'none';
  } catch (error) {
    document.getElementById('activity-form-message').textContent = error.message;
  }
});

// Função para carregar as atividades
document.getElementById('filter-activity').addEventListener('change', filterActivities);
document.getElementById('search-activity').addEventListener('input', filterActivities);

function filterActivities() {
  const filterValue = document.getElementById('filter-activity').value;
  const searchValue = document.getElementById('search-activity').value.toLowerCase();
  const allActivities = document.querySelectorAll('.activity-card');

  allActivities.forEach(card => {
    let show = true;
    
    // Filter by search text
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    if (!title.includes(searchValue) && !description.includes(searchValue)) {
      show = false;
    }

    // Filter by availability
    if (filterValue === 'available') {
      const spots = parseInt(card.querySelector('p:nth-child(5)').textContent.match(/\d+/)[0]);
      if (spots <= 0) show = false;
    }

    // Filter by upcoming activities
    if (filterValue === 'upcoming') {
      const dateText = card.querySelector('p:nth-child(3)').textContent;
      const activityDate = new Date(dateText.split(':')[1]);
      if (activityDate < new Date()) show = false;
    }

    card.style.display = show ? 'block' : 'none';
  });
}