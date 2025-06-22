// Este script é executado apenas na página inicial (index.html)
window.addEventListener('load', function() {
    // --- LÓGICA DO DROPDOWN DE USUÁRIO (Já existente) ---
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    
    if (usuarioCorrente && usuarioCorrente.id) {
        // Se o usuário ESTÁ LOGADO:
        dropdownMenu.innerHTML = '';

        const nomeLi = document.createElement('li');
        nomeLi.innerHTML = `<span class="dropdown-item-text">Olá, <strong>${usuarioCorrente.nome}</strong></span>`;
        dropdownMenu.appendChild(nomeLi);

        const dividerLi = document.createElement('li');
        dividerLi.innerHTML = '<hr class="dropdown-divider">';
        dropdownMenu.appendChild(dividerLi);

        if (usuarioCorrente.tipo && usuarioCorrente.tipo.toLowerCase() === 'admin') {
            const adminLi = document.createElement('li');
            adminLi.innerHTML = '<a class="dropdown-item" href="admin.html">Painel Admin</a>';
            dropdownMenu.appendChild(adminLi);
        }

        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = '<a class="dropdown-item" href="#" id="btn_logout">Deslogar</a>';
        dropdownMenu.appendChild(logoutLi);

        document.getElementById('btn_logout').addEventListener('click', function(event) {
            event.preventDefault();
            logoutUser(); 
        });

    } else {
        // Se o usuário NÃO ESTÁ LOGADO:
        dropdownMenu.innerHTML = '<li><a class="dropdown-item" href="loginCadastro.html">Login / Cadastrar</a></li>';
    }

    // --- LÓGICA PARA CARREGAR NOTÍCIAS (Já existente) ---
    carregarNoticias();

    // --- ✅ NOVA LÓGICA DA BARRA DE PESQUISA ---
    const searchInput = document.getElementById('search-input');
    // Adiciona um evento que dispara toda vez que o usuário digita algo
    searchInput.addEventListener('keyup', filtrarNoticias);
});


/**
 * Busca as notícias da API e as exibe na página.
 */
async function carregarNoticias() {
    const newsContainer = document.getElementById('news-container');
    const NOTICIAS_API_URL = 'http://localhost:3000/noticias';

    try {
        const response = await fetch(NOTICIAS_API_URL);
        const noticias = await response.json();

        newsContainer.innerHTML = '';

        if (noticias.length === 0) {
            newsContainer.innerHTML = '<p>Nenhuma notícia encontrada no momento.</p>';
            return;
        }

        noticias.forEach(noticia => {
            const linkNoticia = document.createElement('a');
            linkNoticia.href = noticia.url;
            linkNoticia.target = '_blank';
            linkNoticia.classList.add('noticia-link');

            linkNoticia.innerHTML = `
                <div class="noticia">
                    <div class="fonte ${noticia.fonte.toLowerCase()}">${noticia.fonte}</div>
                    <div class="conteudo">
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.descricao}</p>
                    </div>
                </div>
            `;
            newsContainer.appendChild(linkNoticia);
        });

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        newsContainer.innerHTML = '<p>Não foi possível carregar as notícias. Tente novamente mais tarde.</p>';
    }
}

/**
 * ✅ NOVA FUNÇÃO: Filtra os cards de notícia com base no texto da busca.
 */
function filtrarNoticias() {
    const termoBusca = document.getElementById('search-input').value.toLowerCase();
    const noticias = document.querySelectorAll('#news-container .noticia-link');

    noticias.forEach(noticia => {
        const titulo = noticia.querySelector('h3').textContent.toLowerCase();
        
        // Se o título da notícia incluir o termo da busca, mostra o card. Senão, esconde.
        if (titulo.includes(termoBusca)) {
            noticia.style.display = 'block';
        } else {
            noticia.style.display = 'none';
        }
    });
}