# Sistema de Voluntariado

Uma aplicação web full-stack (API RESTful + Frontend SPA) desenvolvida para gerenciar atividades de voluntariado. Permite que usuários se cadastrem, visualizem e se inscrevam em atividades, e que administradores gerenciem essas atividades e seus participantes.

## 📋 Funcionalidades

* **Usuários:**
    * Cadastro e Login de usuários.
    * Autenticação segura via JSON Web Tokens (JWT).
    * Visualização da lista de atividades disponíveis (com filtros e busca).
    * Inscrição em atividades com vagas disponíveis.
    * Visualização das atividades em que está inscrito.
    * Cancelamento de inscrição em atividades (antes da data de início).
* **Administradores:**
    * Todas as funcionalidades de usuários.
    * Criação, Edição e Exclusão de atividades de voluntariado.
    * Visualização da lista de participantes inscritos em cada atividade.
    * Painel administrativo dedicado (acesso restrito).

## Tecnologias Utilizadas

* **Backend:**
    * Node.js
    * Express.js (Framework web)
    * RocksDB (Banco de dados NoSQL chave-valor)
    * jsonwebtoken (Para autenticação JWT)
    * bcrypt (Para hashing de senhas)
    * dotenv (Para gerenciamento de variáveis de ambiente)
* **Frontend:**
    * HTML5
    * CSS3 (com variáveis CSS para temas)
    * JavaScript (Vanilla JS, ES6 Modules)
    * Fetch API (para comunicação com o backend)

## Pré-requisitos

* Node.js (versão 12 ou superior recomendada)
* npm (geralmente instalado com o Node.js)

## 🚀 Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd sistema-de-voluntariado-api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Adicione as seguintes variáveis ao arquivo `.env`, substituindo os valores de exemplo pelos seus:

    ```env
    # Porta em que o servidor irá rodar
    PORT=3000

    # Chave secreta para gerar os tokens JWT (use um valor longo e seguro)
    SECRET_KEY=sua_chave_secreta_super_segura_aqui

    # Credenciais para o usuário administrador inicial
    ADMIN_EMAIL=admin@exemplo.com
    ADMIN_PASSWORD=senhaForteParaAdmin
    ```
    * **Importante:** Use uma `SECRET_KEY` forte e mantenha o arquivo `.env` fora do controle de versão (adicione-o ao seu `.gitignore` se ainda não estiver lá).

4.  **Crie o Usuário Administrador Inicial:**
    * Execute o script para criar o usuário administrador definido no arquivo `.env`:
    ```bash
    node utils/create-admin.js
    ```
    * Isso garantirá que você tenha um usuário com privilégios de administrador para gerenciar o sistema.

## Execução

* **Modo de Desenvolvimento (com hot-reload):**
    ```bash
    npm run dev
    ```
    O servidor iniciará e reiniciará automaticamente quando detectar alterações nos arquivos.

* **Modo de Produção:**
    ```bash
    npm run start
    ```
    O servidor iniciará normalmente.

Após iniciar o servidor, acesse a aplicação no seu navegador em `http://localhost:PORT` (substitua `PORT` pelo valor definido no seu arquivo `.env`, por exemplo, `http://localhost:3000`).

## 📂 Estrutura do Projeto

```text
sistema-de-voluntariado-api/
├── db/                     # Pasta para os arquivos do banco de dados RocksDB
├── node_modules/           # Dependências do Node.js
├── public/                 # Arquivos do frontend (HTML, CSS, JS)
│   ├── Js/                 # Scripts JavaScript do frontend
│   ├── index.html          # Arquivo HTML principal da SPA
│   └── style.css           # Folha de estilos principal
├── routes/                 # Definições das rotas da API
│   ├── activity.js         # Rotas relacionadas às atividades
│   └── public.js           # Rotas públicas (login, cadastro)
├── utils/                  # Scripts e funções utilitárias
│   ├── create-admin.js     # Script para criar o usuário admin inicial
│   └── passwordUtils.js    # Funções para hashing de senha (bcrypt)
├── .env                    # Arquivo para variáveis de ambiente (NÃO versionar)
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── auth.js                 # Lógica de autenticação JWT e middlewares
├── db.js                   # Interface de abstração para o RocksDB
├── package-lock.json       # Lockfile das dependências
├── package.json            # Metadados e dependências do projeto
└── server.js               # Ponto de entrada principal do servidor Express
```

## 🔧 Endpoints da API

### Autenticação
| Método | Endpoint    | Descrição                     |
|--------|-------------|-------------------------------|
| POST   | `/login`    | Autenticação de usuário       |
| POST   | `/register` | Cadastro de novo usuário      |

### Atividades
| Método | Endpoint                     | Descrição                              |
|--------|------------------------------|----------------------------------------|
| GET    | `/activities`                | Lista todas atividades                 |
| POST   | `/activities`                | Cria nova atividade (apenas admin)     |
| POST   | `/activities/:id/register`   | Inscreve-se em atividade               |
| DELETE | `/activities/:id/register`   | Cancela inscrição em atividade         |

## 📄 Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## ✉️ Contato
Desenvolvido por Luiz Ricardo
Email: luizricardomacielrios@gmail.com