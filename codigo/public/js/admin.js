// Aguarda o DOM carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- CONSTANTES E VARIÁVEIS GLOBAIS ---
    const API_BASE_URL = 'http://localhost:3000';
    const formNoticia = document.getElementById('form-noticia');
    const noticiaIdInput = document.getElementById('noticia-id');
    const noticiaTituloInput = document.getElementById('noticia-titulo');
    const noticiaDescricaoInput = document.getElementById('noticia-descricao');
    const noticiaFonteInput = document.getElementById('noticia-fonte');
    const noticiaUrlInput = document.getElementById('noticia-url');
    const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

    // --- FUNÇÕES DE CARREGAMENTO INICIAL ---

    // Carrega e exibe a lista de usuários
    const carregarUsuarios = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`);
            const usuarios = await response.json();
            const tabelaUsuarios = document.getElementById('table-usuarios');
            tabelaUsuarios.innerHTML = ''; // Limpa a tabela antes de preencher

            usuarios.forEach(user => {
                tabelaUsuarios.innerHTML += `
                    <tr>
                        <td>${user.nome}</td>
                        <td>${user.login}</td>
                        <td>${user.email}</td>
                        <td><span class="badge bg-secondary">${user.tipo}</span></td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    };

    // Carrega e exibe a lista de notícias
    const carregarNoticias = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/noticias`);
            const noticias = await response.json();
            const tabelaNoticias = document.getElementById('table-noticias');
            tabelaNoticias.innerHTML = ''; // Limpa a tabela

            noticias.forEach(noticia => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${noticia.titulo}</td>
                    <td>${noticia.fonte}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-info btn-editar">Editar</button>
                        <button class="btn btn-sm btn-danger btn-excluir">Excluir</button>
                    </td>
                `;
                // Adiciona os dados da notícia aos botões para fácil acesso
                tr.querySelector('.btn-editar').addEventListener('click', () => prepararEdicaoNoticia(noticia));
                tr.querySelector('.btn-excluir').addEventListener('click', () => excluirNoticia(noticia.id));
                
                tabelaNoticias.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
        }
    };

    // --- FUNÇÕES CRUD DE NOTÍCIAS ---

    // Prepara o formulário para editar uma notícia existente
    const prepararEdicaoNoticia = (noticia) => {
        noticiaIdInput.value = noticia.id;
        noticiaTituloInput.value = noticia.titulo;
        noticiaDescricaoInput.value = noticia.descricao;
        noticiaFonteInput.value = noticia.fonte;
        noticiaUrlInput.value = noticia.url;
        btnCancelarEdicao.style.display = 'inline-block'; // Mostra o botão de cancelar
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    // Salva uma nova notícia ou atualiza uma existente
    const salvarNoticia = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const id = noticiaIdInput.value;
        const noticiaData = {
            titulo: noticiaTituloInput.value,
            descricao: noticiaDescricaoInput.value,
            fonte: noticiaFonteInput.value,
            url: noticiaUrlInput.value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/noticias/${id}` : `${API_BASE_URL}/noticias`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noticiaData)
            });

            if (!response.ok) throw new Error('Erro ao salvar notícia');

            limparFormularioNoticia();
            await carregarNoticias(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao salvar notícia:', error);
        }
    };

    // Exclui uma notícia
    const excluirNoticia = async (id) => {
        if (confirm('Tem certeza que deseja excluir esta notícia?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/noticias/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Erro ao excluir notícia');
                await carregarNoticias(); // Recarrega a lista
            } catch (error) {
                console.error('Erro ao excluir notícia:', error);
            }
        }
    };

    // Limpa o formulário de notícias
    const limparFormularioNoticia = () => {
        formNoticia.reset();
        noticiaIdInput.value = '';
        btnCancelarEdicao.style.display = 'none'; // Esconde o botão de cancelar
    };

    // --- EVENT LISTENERS ---
    formNoticia.addEventListener('submit', salvarNoticia);
    btnCancelarEdicao.addEventListener('click', limparFormularioNoticia);

    // --- INICIALIZAÇÃO ---
    carregarUsuarios();
    carregarNoticias();
});