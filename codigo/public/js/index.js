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

    // --- ✅ NOVA LÓGICA PARA CARREGAR NOTÍCIAS ---
    carregarNoticias();
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

        // Limpa a área de notícias antes de adicionar as novas
        newsContainer.innerHTML = '';

        if (noticias.length === 0) {
            newsContainer.innerHTML = '<p>Nenhuma notícia encontrada no momento.</p>';
            return;
        }

        // Cria o HTML para cada notícia e o adiciona ao container
        noticias.forEach(noticia => {
            // Cria um link <a> que envolve todo o bloco da notícia
            const linkNoticia = document.createElement('a');
            linkNoticia.href = noticia.url; // URL de redirecionamento
            linkNoticia.target = '_blank'; // Abre em uma nova aba
            linkNoticia.classList.add('noticia-link'); // Adiciona uma classe para estilização, se necessário

            // Cria o conteúdo interno da notícia
            linkNoticia.innerHTML = `
                <div class="noticia">
                    <div class="fonte ${noticia.fonte.toLowerCase()}">${noticia.fonte}</div>
                    <div class="conteudo">
                        <h3>${noticia.titulo}</h3>
                        <p>${noticia.descricao}</p>
                    </div>
                </div>
            `;
            
            // Adiciona o link com a notícia ao container na página
            newsContainer.appendChild(linkNoticia);
        });

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        newsContainer.innerHTML = '<p>Não foi possível carregar as notícias. Tente novamente mais tarde.</p>';
    }
}