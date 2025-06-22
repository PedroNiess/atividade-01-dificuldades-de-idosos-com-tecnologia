// Trabalho Interdisciplinar 1 - Aplicações Web
// Versão ajustada para o projeto "Idade Conectada"

// --- CONFIGURAÇÃO ---
const LOGIN_URL = '/codigo/public/loginCadastro.html';
const HOME_URL = '/codigo/public/admin.html';
const PROTECTED_PAGES = ['/admin.html', '/cadastroNoticias.html'];
const API_URL = 'http://localhost:3000/usuarios';

// --- VARIÁVEIS GLOBAIS ---
let usuarioCorrente = {};

// --- FUNÇÕES PRINCIPAIS ---

function initLoginApp() {
    const paginaAtual = window.location.pathname;
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }
    if (PROTECTED_PAGES.includes(paginaAtual) && !usuarioCorrente.id) {
        window.location.href = LOGIN_URL;
    }
}

// ✅ FUNÇÃO ALTERADA PARA SER ASSÍNCRONA E CONSULTAR A API DIRETAMENTE
/**
 * Valida as credenciais do usuário diretamente na API.
 * @param {string} login - O login do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {Promise<boolean>} - True se o login for bem-sucedido, false caso contrário.
 */
async function loginUser(login, senha) {
    try {
        // Usa a API do JSON-Server para filtrar o usuário e senha
        const response = await fetch(`${API_URL}?login=${login}&senha=${senha}`);
        const data = await response.json();

        // Se a API retornar exatamente 1 usuário, o login está correto
        if (data.length === 1) {
            const usuarioEncontrado = data[0];
            usuarioCorrente = {
                id: usuarioEncontrado.id,
                login: usuarioEncontrado.login,
                email: usuarioEncontrado.email,
                nome: usuarioEncontrado.nome,
                tipo: usuarioEncontrado.tipo
            };
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        displayMessage('Ocorreu um erro ao conectar ao servidor. Tente novamente.');
        return false;
    }
}

function addUser(nome, login, senha, email) {
    const novoUsuario = { nome, login, senha, email, tipo: 'user' };
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(() => displayMessage("Usuário cadastrado com sucesso!"))
    .catch(error => {
        console.error('Erro ao inserir usuário:', error);
        displayMessage("Erro ao inserir usuário.");
    });
}

function logoutUser() {
    sessionStorage.removeItem('usuarioCorrente');
    usuarioCorrente = {};
    window.location.href = LOGIN_URL;
}

function displayMessage(message) {
    alert(message);
}

// --- INICIALIZAÇÃO ---
initLoginApp();