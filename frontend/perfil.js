const usuarioLogado =
    localStorage.getItem("usuarioLogado");

const nomeUsuario =
    localStorage.getItem("nomeUsuario");

const emailUsuario =
    localStorage.getItem("emailUsuario");


// =========================
// VERIFICAR LOGIN
// =========================

if (usuarioLogado !== "true") {
    window.location.href = "/login";
}


// =========================
// TEMA
// =========================

const temaSalvo =
    localStorage.getItem("tema");

if (temaSalvo === "escuro") {
    document.body.classList.add("tema-escuro");
}


// =========================
// ELEMENTOS
// =========================

const nomePerfil =
    document.querySelector("#nomePerfil");

const emailPerfil =
    document.querySelector("#emailPerfil");

const favoritosPerfil =
    document.querySelector("#favoritosPerfil");

const avaliacoesPerfil =
    document.querySelector("#avaliacoesPerfil");

// =========================
// FOTO DE PERFIL
// =========================

const fotoPerfilPagina =
    document.querySelector("#fotoPerfilPagina");

const avatarPerfilPadrao =
    document.querySelector("#avatarPerfilPadrao");

const fotoPerfilSalva =
    localStorage.getItem("fotoPerfil");


if (fotoPerfilSalva) {

    fotoPerfilPagina.src =
        fotoPerfilSalva;

    fotoPerfilPagina.style.display =
        "block";

    avatarPerfilPadrao.style.display =
        "none";

} else {

    fotoPerfilPagina.style.display =
        "none";

    avatarPerfilPadrao.style.display =
        "flex";

}


// =========================
// DADOS DO USUÁRIO
// =========================

nomePerfil.textContent =
    `👤 Nome: ${nomeUsuario || "Não informado"}`;

emailPerfil.textContent =
    `📧 E-mail: ${emailUsuario || "Não informado"}`;


// =========================
// FAVORITOS
// =========================

const favoritos =
    JSON.parse(
        localStorage.getItem("favoritos")
    ) || [];

favoritosPerfil.textContent =
    `⭐ Favoritos: ${favoritos.length}`;


// =========================
// CARREGAR AVALIAÇÕES
// =========================

async function carregarAvaliacoesUsuario() {

    try {

        const resposta =
            await fetch(
                "/avaliacoes/usuario/" +
                encodeURIComponent(nomeUsuario)
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }

        const avaliacoes =
            await resposta.json();

        avaliacoesPerfil.textContent =
            `⭐ Avaliações: ${avaliacoes.length}`;

    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações:",
            erro
        );

        avaliacoesPerfil.textContent =
            "⭐ Avaliações: 0";
    }
}

carregarAvaliacoesUsuario();

async function carregarMinhasAvaliacoes() {

    const lista =
        document.querySelector("#listaMinhasAvaliacoes");

    try {

        const resposta =
            await fetch(
                "/avaliacoes/usuario/" +
                encodeURIComponent(nomeUsuario)
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }

        const avaliacoes =
            await resposta.json();

        if (
            !Array.isArray(avaliacoes) ||
            avaliacoes.length === 0
        ) {

            lista.innerHTML = `
                <p>
                    Você ainda não fez nenhuma avaliação.
                </p>
            `;

            return;
        }

        lista.innerHTML = "";

        avaliacoes
            .slice()
            .reverse()
            .forEach(function (avaliacao) {

                const item =
                    document.createElement("div");

                item.className =
                    "avaliacao-item";

                const nota =
                    Number(avaliacao.nota);

                const estrelas =
                    "★".repeat(nota) +
                    "☆".repeat(5 - nota);

                item.innerHTML = `

                    <h3>
                        🏊 ${avaliacao.piscina}
                    </h3>

                    <div class="avaliacao-estrelas">
                        ${estrelas}
                    </div>

                    <p>
                        ${
                            avaliacao.comentario ||
                            "Sem comentário."
                        }
                    </p>

                    <button
                        class="botao-detalhes"
                        data-piscina="${encodeURIComponent(
                            avaliacao.piscina
                        )}"
                    >
                        Ver local
                    </button>

                `;

                lista.appendChild(item);

            });


        // =========================
        // BOTÕES "VER LOCAL"
        // =========================

        lista
            .querySelectorAll(".botao-detalhes")
            .forEach(function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        const piscina =
                            botao.dataset.piscina;

                        window.location.href =
                            "/detalhes?nome=" + piscina;

                    }
                );

            });

    }

    catch (erro) {

        console.error(
            "Erro ao carregar minhas avaliações:",
            erro
        );

        lista.innerHTML = `
            <p>
                ❌ Não foi possível carregar suas avaliações.
            </p>
        `;

    }

}

carregarMinhasAvaliacoes();


// =========================
// VOLTAR
// =========================

document
    .querySelector("#voltarApp")
    .addEventListener(
        "click",
        function () {

            window.location.href = "/app";

        }
    );
