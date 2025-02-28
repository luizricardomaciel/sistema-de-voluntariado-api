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

