// Função única para criar notificações
export function notify(message, type = "info", duration = 5000) {
  // Definir títulos baseados no tipo
  const titles = {
    success: "Sucesso!",
    error: "Erro!",
    warning: "Alerta!",
    info: "Informação",
  };

  // Obter o título ou usar um padrão se o tipo não for reconhecido
  const title = titles[type] || "Notificação";

  // Verificar se o container de notificações já existe
  let container = document.getElementById("notification-container");

  // Se não existir, criar o container
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  // Criar a notificação
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  // Gerar um ID único para a notificação
  const notificationId = "notification-" + Date.now();
  notification.id = notificationId;

  // Adicionar o conteúdo HTML da notificação
  notification.innerHTML = `
                <div class="notification-border"></div>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="closeNotification('${notificationId}')">&times;</button>
            `;

  // Adicionar a notificação ao container
  container.appendChild(notification);

  // Configurar o timer para remover a notificação após o tempo definido
  if (duration > 0) {
    setTimeout(() => {
      closeNotification(notificationId);
    }, duration);
  }

  return notificationId;
}

// Função para fechar uma notificação
function closeNotification(notificationId) {
  const notification = document.getElementById(notificationId);
  if (notification) {
    // Adicionar classe para animação de saída
    notification.classList.add("fade-out");

    // Remover o elemento após a animação terminar
    setTimeout(() => {
      notification.remove();
    }, 500); // Tempo correspondente à duração da animação
  }
}
