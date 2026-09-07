const paginaDetalhes = document.querySelector("#paginaDetalhes");
const voltarApp = document.querySelector("#voltarApp");

const usuarioLogado = localStorage.getItem("usuarioLogado");

if (usuarioLogado !== "true") {
    window.location.href = "/login";
}

// =========================
// TEMA
// =========================

const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "escuro") {
    document.body.classList.add("tema-escuro");
}

// =========================
// FAVORITOS
// =========================

let favoritos =
    JSON.parse(localStorage.getItem("favoritos")) || [];

// =========================
// PEGAR NOME DA URL
// =========================

const parametros =
    new URLSearchParams(window.location.search);

const nomePiscina =
    parametros.get("nome");

// =========================
// VOLTAR
// =========================

if (voltarApp) {
    voltarApp.addEventListener("click", function () {
        window.location.href = "/app";
    });
}

// =========================
// LOCALIZAÇÃO
// =========================

let minhaLocalizacao = null;

navigator.geolocation.getCurrentPosition(
    function (posicao) {
        minhaLocalizacao = {
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude
        };

        carregarDetalhes();
    },
    function () {
        carregarDetalhes();
    }
);

// =========================
// BUSCAR PISCINA
// =========================

async function carregarDetalhes() {
    try {
        const resposta = await fetch(
            "/piscinas/detalhes/" +
            encodeURIComponent(nomePiscina)
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar detalhes: " +
                resposta.status
            );
        }

        const piscina = await resposta.json();

        if (!piscina || piscina.sucesso === false) {
            paginaDetalhes.innerHTML = `
                <div class="erro-detalhes">
                    <h2>😕 Local não encontrado</h2>
                    <p>
                        Não encontramos esse local.
                    </p>
                </div>
            `;
            return;
        }

        // =========================
        // DISTÂNCIA
        // =========================

        let distancia = null;

        if (
            minhaLocalizacao &&
            piscina.latitude != null &&
            piscina.longitude != null
        ) {
            distancia =
                calcularDistancia(
                    minhaLocalizacao.latitude,
                    minhaLocalizacao.longitude,
                    piscina.latitude,
                    piscina.longitude
                ).toFixed(1);
        }

        // =========================
        // CATEGORIA
        // =========================

        let categoriaTexto =
            "🏊 Piscina pública";

        if (piscina.categoria === "academia") {
            categoriaTexto =
                "🏋️ Academia";
        }

        if (piscina.categoria === "clube") {
            categoriaTexto =
                "🏢 Clube";
        }

        if (piscina.categoria === "hotel") {
            categoriaTexto =
                "🏨 Hotel / Day Use";
        }

        // =========================
        // DADOS DA EMPRESA
        // =========================

        const precosEmpresa =
            piscina.precos_empresa || {};

        const horariosEmpresa =
            piscina.horarios_empresa || {};

        const fotosEmpresa =
            piscina.fotos_empresa || [];

        // =========================
        // PREÇOS
        // =========================

        const mensalidade =
            precosEmpresa.mensalidade ||
            piscina.mensalidade ||
            "Não informado";

        const dayUse =
            precosEmpresa.day_use ||
            piscina.day_use ||
            "Não informado";

        // =========================
        // HORÁRIOS
        // =========================

        const horario =
            Object.keys(horariosEmpresa).length > 0
                ? horariosEmpresa
                : (piscina.horario || {});

        const segunda =
            horario.segunda || "Consultar";

        const terca =
            horario.terca || "Consultar";

        const quarta =
            horario.quarta || "Consultar";

        const quinta =
            horario.quinta || "Consultar";

        const sexta =
            horario.sexta || "Consultar";

        const sabado =
            horario.sabado || "Consultar";

        const domingo =
            horario.domingo || "Consultar";

        // =========================
        // FOTO
        // =========================

        let fotoPrincipal =
            piscina.foto || "";

        if (fotosEmpresa.length > 0) {
            fotoPrincipal = fotosEmpresa[0];
        }

        // =========================
        // PÁGINA
        // =========================

        paginaDetalhes.innerHTML = `

            ${
                fotoPrincipal
                    ? `
                        <img
                            src="${fotoPrincipal}"
                            class="foto-detalhes"
                            alt="Foto de ${piscina.nome}"
                        >
                    `
                    : ""
            }

            <div class="cabecalho-detalhes">

                <div>

                    <span class="categoria-detalhes">
                        ${categoriaTexto}
                    </span>

                    <h1>
                        🏊 ${piscina.nome}
                    </h1>

                    <p class="endereco-detalhes">
                        📍 ${
                            piscina.endereco ||
                            "Endereço não informado"
                        }
                    </p>

                </div>

                <button
                    id="botaoFavoritarDetalhes"
                    class="botao-favoritar-detalhes"
                >
                    ${
                        favoritos.includes(piscina.nome)
                            ? "⭐ Favorita"
                            : "☆ Favoritar"
                    }
                </button>

            </div>

            <div class="informacoes-detalhes">

                <div class="info-detalhe">

                    <strong>🏊 Tipo</strong>

                    <span>
                        ${
                            piscina.tipo ||
                            "Não informado"
                        }
                    </span>

                </div>

                <div class="info-detalhe preco-detalhe">

                    <strong>💰 Mensalidade</strong>

                    <span>
                        ${mensalidade}
                    </span>

                </div>

                <div class="info-detalhe">

                    <strong>🎟️ Day Use</strong>

                    <span>
                        ${dayUse}
                    </span>

                </div>

                <div class="info-detalhe">

                    <strong>📏 Distância</strong>

                    <span>
                        ${
                            distancia
                                ? distancia + " km de você"
                                : "Localização não disponível"
                        }
                    </span>

                </div>

            </div>

            ${
                precosEmpresa.observacao
                    ? `
                        <section class="secao-detalhes">

                            <h2>
                                💬 Observação sobre preços
                            </h2>

                            <div class="resumo-local">

                                <p>
                                    ${precosEmpresa.observacao}
                                </p>

                            </div>

                        </section>
                    `
                    : ""
            }

            <section class="secao-detalhes">

                <h2>🕐 Horários</h2>

                <div class="horarios-detalhes">

                    <div>
                        <strong>Segunda</strong>
                        <span>${segunda}</span>
                    </div>

                    <div>
                        <strong>Terça</strong>
                        <span>${terca}</span>
                    </div>

                    <div>
                        <strong>Quarta</strong>
                        <span>${quarta}</span>
                    </div>

                    <div>
                        <strong>Quinta</strong>
                        <span>${quinta}</span>
                    </div>

                    <div>
                        <strong>Sexta</strong>
                        <span>${sexta}</span>
                    </div>

                    <div>
                        <strong>Sábado</strong>
                        <span>${sabado}</span>
                    </div>

                    <div>
                        <strong>Domingo</strong>
                        <span>${domingo}</span>
                    </div>

                </div>

                <div class="status-detalhes">
                    ${verificarFuncionamento(horario)}
                </div>

            </section>

            <section class="secao-detalhes">

                <h2>📋 Informações do local</h2>

                <div class="resumo-local">

                    <p>
                        <strong>🏢 Categoria:</strong>
                        ${categoriaTexto}
                    </p>

                    <p>
                        <strong>🏊 Estrutura:</strong>
                        ${
                            piscina.tipo ||
                            "Não informado"
                        }
                    </p>

                    <p>
                        <strong>📍 Endereço:</strong>
                        ${
                            piscina.endereco ||
                            "Não informado"
                        }
                    </p>

                    ${
                        piscina.descricao_empresa
                            ? `
                                <p>
                                    <strong>📝 Descrição:</strong>
                                    ${piscina.descricao_empresa}
                                </p>
                            `
                            : ""
                    }

                </div>

            </section>

            ${
                piscina.telefone_empresa ||
                piscina.whatsapp_empresa ||
                piscina.instagram_empresa ||
                piscina.site_empresa
                    ? `
                        <section class="secao-detalhes">

                            <h2>📞 Contato</h2>

                            <div class="resumo-local">

                                ${
                                    piscina.telefone_empresa
                                        ? `
                                            <p>
                                                <strong>
                                                    📞 Telefone:
                                                </strong>
                                                ${piscina.telefone_empresa}
                                            </p>
                                        `
                                        : ""
                                }

                                ${
                                    piscina.whatsapp_empresa
                                        ? `
                                            <p>
                                                <strong>
                                                    💬 WhatsApp:
                                                </strong>
                                                ${piscina.whatsapp_empresa}
                                            </p>
                                        `
                                        : ""
                                }

                                ${
                                    piscina.instagram_empresa
                                        ? `
                                            <p>
                                                <strong>
                                                    📷 Instagram:
                                                </strong>
                                                ${piscina.instagram_empresa}
                                            </p>
                                        `
                                        : ""
                                }

                                ${
                                    piscina.site_empresa
                                        ? `
                                            <p>
                                                <strong>
                                                    🌐 Site:
                                                </strong>
                                                ${piscina.site_empresa}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                        </section>
                    `
                    : ""
            }

            <div class="acoes-detalhes">

                <button
                    class="botao-detalhes"
                    id="botaoComoChegar"
                >
                    🗺️ Como chegar
                </button>

            </div>

            <section class="secao-avaliacoes">

                <h2>⭐ Avaliações</h2>

                <div
                    id="mediaAvaliacao"
                    class="media-avaliacao"
                >
                    Carregando avaliações...
                </div>

                <div class="nova-avaliacao">

                    <h3>
                        Deixe sua avaliação
                    </h3>

                    <div
                        id="estrelasAvaliacao"
                        class="estrelas-avaliacao"
                    >
                        <button data-nota="1">☆</button>
                        <button data-nota="2">☆</button>
                        <button data-nota="3">☆</button>
                        <button data-nota="4">☆</button>
                        <button data-nota="5">☆</button>
                    </div>

                    <textarea
                        id="comentarioAvaliacao"
                        placeholder="Conte como foi sua experiência..."
                        maxlength="300"
                    ></textarea>

                    <button
                        id="enviarAvaliacao"
                        class="botao-detalhes"
                    >
                        Enviar avaliação
                    </button>

                </div>

                <div
                    id="listaAvaliacoes"
                    class="lista-avaliacoes"
                ></div>

            </section>
        `;

        // =========================
        // FAVORITAR
        // =========================

        const botaoFavoritar =
            document.querySelector(
                "#botaoFavoritarDetalhes"
            );

        if (botaoFavoritar) {

            botaoFavoritar.addEventListener(
                "click",
                function () {

                    if (
                        favoritos.includes(
                            piscina.nome
                        )
                    ) {

                        favoritos =
                            favoritos.filter(
                                function (nome) {
                                    return nome !== piscina.nome;
                                }
                            );

                    } else {

                        favoritos.push(
                            piscina.nome
                        );
                    }

                    localStorage.setItem(
                        "favoritos",
                        JSON.stringify(favoritos)
                    );

                    botaoFavoritar.textContent =
                        favoritos.includes(
                            piscina.nome
                        )
                            ? "⭐ Favorita"
                            : "☆ Favoritar";
                }
            );
        }

        // =========================
        // COMO CHEGAR
        // =========================

        const botaoComoChegar =
            document.querySelector(
                "#botaoComoChegar"
            );

        if (botaoComoChegar) {

            botaoComoChegar.addEventListener(
                "click",
                function () {

                    abrirMapa(
                        piscina.endereco
                    );

                }
            );
        }

        // =========================
        // AVALIAÇÕES
        // =========================

        prepararAvaliacoes();

    } catch (erro) {

        console.error(
            "Erro ao carregar detalhes:",
            erro
        );

        paginaDetalhes.innerHTML = `

            <div class="erro-detalhes">

                <h2>❌ Erro ao carregar</h2>

                <p>
                    Não foi possível carregar
                    os detalhes.
                </p>

            </div>

        `;
    }
}

// =========================
// PREPARAR AVALIAÇÕES
// =========================

function prepararAvaliacoes() {

    let notaSelecionada = 0;

    const estrelas =
        document.querySelectorAll(
            "#estrelasAvaliacao button"
        );

    const comentario =
        document.querySelector(
            "#comentarioAvaliacao"
        );

    const botaoEnviar =
        document.querySelector(
            "#enviarAvaliacao"
        );

    // =========================
    // ESCOLHER ESTRELAS
    // =========================

    estrelas.forEach(function (estrela) {

        estrela.addEventListener(
            "click",
            function () {

                notaSelecionada =
                    Number(
                        estrela.dataset.nota
                    );

                atualizarEstrelas(
                    estrelas,
                    notaSelecionada
                );
            }
        );
    });

    // =========================
    // ENVIAR
    // =========================

    if (botaoEnviar) {

        botaoEnviar.addEventListener(
            "click",
            async function () {

                const nomeUsuario =
                    localStorage.getItem(
                        "nomeUsuario"
                    );

                if (!nomeUsuario) {
                    alert(
                        "Você precisa estar logado para avaliar."
                    );
                    return;
                }

                if (notaSelecionada === 0) {
                    alert(
                        "⭐ Selecione uma nota."
                    );
                    return;
                }

                try {

                    botaoEnviar.disabled = true;

                    botaoEnviar.textContent =
                        "Enviando...";

                    const resposta =
                        await fetch(
                            "/avaliacoes",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    piscina:
                                        nomePiscina,

                                    nome_usuario:
                                        nomeUsuario,

                                    nota:
                                        notaSelecionada,

                                    comentario:
                                        comentario.value.trim()
                                })
                            }
                        );

                    const resultado =
                        await resposta.json();

                    console.log(
                        "Resposta do servidor:",
                        resposta.status,
                        resultado
                    );

                    if (!resposta.ok) {

                        alert(
                            resultado.detail ||
                            resultado.mensagem ||
                            "Erro ao enviar avaliação."
                        );

                        return;
                    }

                    if (!resultado.sucesso) {

                        alert(
                            resultado.mensagem ||
                            "Não foi possível enviar a avaliação."
                        );

                        return;
                    }

                    // LIMPAR

                    comentario.value = "";

                    notaSelecionada = 0;

                    atualizarEstrelas(
                        estrelas,
                        0
                    );

                    await carregarAvaliacoes();

                    alert(
                        "⭐ Avaliação enviada com sucesso!"
                    );

                } catch (erro) {

                    console.error(
                        "Erro ao enviar avaliação:",
                        erro
                    );

                    alert(
                        "❌ Não foi possível enviar a avaliação.\n\n" +
                        erro.message
                    );

                } finally {

                    botaoEnviar.disabled = false;

                    botaoEnviar.textContent =
                        "Enviar avaliação";
                }
            }
        );
    }

    carregarAvaliacoes();
}

// =========================
// ATUALIZAR ESTRELAS
// =========================

function atualizarEstrelas(
    estrelas,
    notaSelecionada
) {

    estrelas.forEach(
        function (estrela) {

            const nota =
                Number(
                    estrela.dataset.nota
                );

            estrela.textContent =
                nota <= notaSelecionada
                    ? "★"
                    : "☆";
        }
    );
}

// =========================
// CARREGAR AVALIAÇÕES
// =========================

async function carregarAvaliacoes() {

    const mediaAvaliacao =
        document.querySelector(
            "#mediaAvaliacao"
        );

    const listaAvaliacoes =
        document.querySelector(
            "#listaAvaliacoes"
        );

    if (
        !mediaAvaliacao ||
        !listaAvaliacoes
    ) {
        return;
    }

    try {

        const resposta =
            await fetch(
                "/avaliacoes/" +
                encodeURIComponent(
                    nomePiscina
                )
            );

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }

        const avaliacoes =
            await resposta.json();

        if (
            !Array.isArray(avaliacoes) ||
            avaliacoes.length === 0
        ) {

            mediaAvaliacao.innerHTML = `

                <strong>
                    ⭐ Ainda não há avaliações
                </strong>

                <p>
                    Seja o primeiro a avaliar este local!
                </p>

            `;

            listaAvaliacoes.innerHTML = "";

            return;
        }

        // =========================
        // MÉDIA
        // =========================

        const soma =
            avaliacoes.reduce(
                function (
                    total,
                    avaliacao
                ) {

                    return (
                        total +
                        Number(
                            avaliacao.nota
                        )
                    );
                },
                0
            );

        const media =
            soma /
            avaliacoes.length;

        mediaAvaliacao.innerHTML = `

            <div class="nota-media">
                ⭐ ${media.toFixed(1)} / 5
            </div>

            <p>
                ${avaliacoes.length}
                ${
                    avaliacoes.length === 1
                        ? "avaliação"
                        : "avaliações"
                }
            </p>

        `;

        // =========================
        // LISTA
        // =========================

        listaAvaliacoes.innerHTML = "";

        avaliacoes
            .slice()
            .reverse()
            .forEach(
                function (avaliacao) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "avaliacao-item";

                    const nota =
                        Number(
                            avaliacao.nota
                        );

                    const estrelasTexto =
                        "★".repeat(nota) +
                        "☆".repeat(
                            5 - nota
                        );

                    item.innerHTML = `

                        <div class="avaliacao-estrelas">
                            ${estrelasTexto}
                        </div>

                        <strong>
                            ${avaliacao.nome_usuario}
                        </strong>

                        <p>
                            ${
                                avaliacao.comentario ||
                                "Sem comentário."
                            }
                        </p>

                    `;

                    listaAvaliacoes.appendChild(
                        item
                    );
                }
            );

    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações:",
            erro
        );

        mediaAvaliacao.innerHTML = `

            <p>
                ❌ Não foi possível
                carregar as avaliações.
            </p>

        `;
    }
}

// =========================
// DISTÂNCIA
// =========================

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +

        Math.cos(
            lat1 * Math.PI / 180
        ) *

        Math.cos(
            lat2 * Math.PI / 180
        ) *

        Math.sin(
            dLon / 2
        ) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

// =========================
// STATUS
// =========================

function verificarFuncionamento(
    horario
) {

    if (!horario) {
        return "🔴 Horário não disponível";
    }

    const agora =
        new Date();

    const dias = [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado"
    ];

    const diaAtual =
        dias[agora.getDay()];

    const horarioHoje =
        horario[diaAtual];

    if (!horarioHoje) {
        return "🔴 Horário não disponível";
    }

    const horarioTexto =
        String(
            horarioHoje
        ).trim();

    if (
        horarioTexto.toLowerCase() === "fechado" ||
        horarioTexto.toLowerCase() === "consultar"
    ) {
        return "🔴 Horário não disponível";
    }

    const periodos =
        horarioTexto.split(",");

    const minutosAgora =
        agora.getHours() * 60 +
        agora.getMinutes();

    for (
        let i = 0;
        i < periodos.length;
        i++
    ) {

        const partes =
            periodos[i]
                .trim()
                .split("-");

        if (partes.length !== 2) {
            continue;
        }

        const abertura =
            partes[0].trim();

        const fechamento =
            partes[1].trim();

        const horaAbertura =
            Number(
                abertura.split(":")[0]
            );

        const minutoAbertura =
            Number(
                abertura.split(":")[1]
            );

        const horaFechamento =
            Number(
                fechamento.split(":")[0]
            );

        const minutoFechamento =
            Number(
                fechamento.split(":")[1]
            );

        if (
            Number.isNaN(horaAbertura) ||
            Number.isNaN(minutoAbertura) ||
            Number.isNaN(horaFechamento) ||
            Number.isNaN(minutoFechamento)
        ) {
            continue;
        }

        const minutosAbertura =
            horaAbertura * 60 +
            minutoAbertura;

        const minutosFechamento =
            horaFechamento * 60 +
            minutoFechamento;

        if (
            minutosAgora >= minutosAbertura &&
            minutosAgora <= minutosFechamento
        ) {

            return (
                `🟢 Aberta agora — ` +
                `fecha às ${fechamento}`
            );
        }

        if (
            minutosAgora <
            minutosAbertura
        ) {

            return (
                `🔴 Fechada agora — ` +
                `abre às ${abertura}`
            );
        }
    }

    return "🔴 Fechada agora";
}

// =========================
// MAPA
// =========================

function abrirMapa(
    endereco
) {

    const url =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(endereco);

    window.open(
        url,
        "_blank"
    );
}