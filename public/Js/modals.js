// modals.js
export function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
  }
  
  export function showRegisterModal() {
    document.getElementById('register-modal').style.display = 'flex';
  }
  
  export function showManageActivityModal() {
    document.getElementById('manage-activity-modal').style.display = 'flex';
  }
  
  export function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }