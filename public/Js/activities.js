//SISTEMA LOGIN
const login_modal = document.getElementById("login-modal");
document.getElementById("login-button").addEventListener("click", () => {
    login_modal.style.display = "flex";
});
login_modal.querySelector(".close").addEventListener("click", () => {
    login_modal.style.display = "none";
});

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

function renderActivities(activities) {
  const activitiesList = document.getElementById("activities-list");
  activitiesList.innerHTML = "";

  activities.forEach(activity => {
    const activityCard = document.createElement("div");
    activityCard.className = "activity-card";
    activityCard.innerHTML = `
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <p><strong>Data:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
      <p><strong>Local:</strong> ${activity.location}</p>
      <p><strong>Vagas restantes:</strong> ${activity.maxParticipants - activity.participants.length}</p>
    `;
    activitiesList.appendChild(activityCard);
  });
}

// Carregar atividades quando a página for carregada
document.addEventListener("DOMContentLoaded", loadActivities);

// Função para fazer login
async function login(email, senha) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Atualizar a interface com base no tipo de usuário
            updateUI();
        } else {
            console.error('Erro ao fazer login:', data.error);
        }
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
    if (user) {
        document.getElementById('user-name').textContent = user.nome;
        document.getElementById('user-info').classList.remove('hide');
        document.getElementById('auth-buttons').classList.add('hide');
        if (user.isAdmin) {
            document.querySelectorAll('.admin-required').forEach(el => el.classList.remove('hide'));
        }
    } else {
        document.getElementById('user-info').classList.add('hide');
        document.getElementById('auth-buttons').classList.remove('hide');
        document.querySelectorAll('.admin-required').forEach(el => el.classList.add('hide'));
    }
}

// Chamar updateUI ao carregar a página
document.addEventListener('DOMContentLoaded', updateUI);

// Event listener para o formulário de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;
    
    await login(email, senha);
    document.getElementById('login-modal').style.display = 'none';
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