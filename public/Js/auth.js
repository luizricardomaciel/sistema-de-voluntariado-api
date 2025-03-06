// auth.js
export async function login(email, senha) {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, data };
      }
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  }
  
export async function register(nome, email, senha) {
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
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      return { success: false, error: 'Erro ao fazer cadastro' };
    }
}
  
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
  
export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}
  
export function isLoggedIn() {
    return !!localStorage.getItem('token');
}