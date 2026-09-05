const busca = document.querySelector("input");
const botao = document.querySelector("#botaoBuscar");
const resultados = document.querySelector("#resultados");

const filtroTipo = document.querySelector("#tipo");
const filtroDistancia = document.querySelector("#distanciaMax");
const botaoLocalizacao = document.querySelector("#botaoLocalizacao");

const modal = document.querySelector("#modal");
const detalhesPiscina = document.querySelector("#detalhesPiscina");
const fecharModal = document.querySelector("#fecharModal");

const botaoFavoritos = document.querySelector("#botaoFavoritos");
const sugestoes = document.querySelector("#sugestoes");
const botaoTema = document.querySelector("#botaoTema");

const usuarioLogado = localStorage.getItem("usuarioLogado");
const nomeUsuario = localStorage.getItem("nomeUsuario");
const botaoPerfil = document.querySelector("#botaoPerfil");

const filtroCategoria = document.querySelector("#filtroCategoria");

if (usuarioLogado !== "true") {
    window.location.href = "/login";
}

const elementoUsuario = document.querySelector("#usuarioLogado");

if (elementoUsuario && nomeUsuario) {
    elementoUsuario.textContent = `Olá, ${nomeUsuario} 👋`;
}

if (usuarioLogado !== "true") {
    window.location.href = "/login";
}

const botaoSair = document.querySelector("#botaoSair");

if (botaoSair) {

    botaoSair.addEventListener("click", function () {

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("nomeUsuario");

        window.location.href = "/login";

    });

}

function removerAcentos(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

let minhaLocalizacao = null;

navigator.geolocation.getCurrentPosition(
    function (posicao) {
        minhaLocalizacao = {
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude
        };

        console.log("Localização encontrada:", minhaLocalizacao);
    },
    function (erro) {
        console.log("Não foi possível obter sua localização.", erro);
    }
);

// =========================
// AVALIAÇÕES
// =========================

let todasAvaliacoes = [];

async function carregarTodasAvaliacoes() {

    try {

        const resposta =
            await fetch(
                "/avaliacoes"
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }

        todasAvaliacoes =
            await resposta.json();

        if (!Array.isArray(todasAvaliacoes)) {
            todasAvaliacoes = [];
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações:",
            erro
        );

        todasAvaliacoes = [];
    }
}


// =========================
// CALCULAR NOTA DA PISCINA
// =========================

function obterAvaliacaoPiscina(nomePiscina) {

    const avaliacoesPiscina =
        todasAvaliacoes.filter(function (avaliacao) {

            return avaliacao.piscina === nomePiscina;

        });


    if (avaliacoesPiscina.length === 0) {

        return {
            media: null,
            quantidade: 0
        };

    }


    const soma =
        avaliacoesPiscina.reduce(
            function (total, avaliacao) {

                return total +
                    Number(avaliacao.nota);

            },
            0
        );


    return {

        media:
            soma / avaliacoesPiscina.length,

        quantidade:
            avaliacoesPiscina.length

    };

}

botao.addEventListener("click", async function () {

    const texto = busca.value.toLowerCase().trim();

    await carregarTodasAvaliacoes();   
    
    console.log("Cheguei aqui!");

    if (!minhaLocalizacao) {
    resultados.innerHTML = "<p>📍 Aguarde sua localização ser encontrada.</p>";
    return;
}

    try {

        const resposta = await fetch("/piscinas");

        const piscinas = await resposta.json();

        resultados.innerHTML = "";

        const favoritosAtivos = botaoFavoritos.classList.contains("ativo");
        const piscinasEncontradas = piscinas.filter(function (piscina) {

            const correspondeFavorito =
                !favoritosAtivos || favoritos.includes(piscina.nome);

            const textoBusca = removerAcentos(texto);

            const nomePiscina = removerAcentos(piscina.nome);
            const enderecoPiscina = removerAcentos(piscina.endereco);

            const correspondeBusca =
                nomePiscina.includes(textoBusca) ||
                enderecoPiscina.includes(textoBusca);

            const tipoSelecionado = filtroTipo.value;

            let correspondeTipo = true;

            if (tipoSelecionado === "olimpica") {
                correspondeTipo = piscina.tipo.toLowerCase() === ("olímpica");
            }

            if (tipoSelecionado === "semiolimpica") {
                correspondeTipo = piscina.tipo.toLowerCase() === ("semiolímpica");
            }

            if (tipoSelecionado === "outra") {
                correspondeTipo =
                    !piscina.tipo.toLowerCase().includes("olímpica") &&
                    !piscina.tipo.toLowerCase().includes("semiolímpica");
            }

            const distanciaSelecionada = filtroDistancia.value;

            let correspondeDistancia = true;

            if (distanciaSelecionada !== "todos") {

                const distancia = calcularDistancia(
                    minhaLocalizacao.latitude,
                    minhaLocalizacao.longitude,
                    piscina.latitude,
                    piscina.longitude
                );

                correspondeDistancia =
                    distancia <= Number(distanciaSelecionada);
            }

            const categoriaSelecionada = filtroCategoria.value;

            let correspondeCategoria = true;

            if (categoriaSelecionada !== "todos") { 

                correspondeCategoria =
                    piscina.categoria === categoriaSelecionada;

            }   

            return (
                correspondeBusca &&
                correspondeTipo &&
                correspondeDistancia &&
                correspondeFavorito &&
                correspondeCategoria
            );

        });

        piscinasEncontradas.sort(function (a, b) {

    const distanciaA = calcularDistancia(
        minhaLocalizacao.latitude,
        minhaLocalizacao.longitude,
        a.latitude,
        a.longitude
    );

    const distanciaB = calcularDistancia(
        minhaLocalizacao.latitude,
        minhaLocalizacao.longitude,
        b.latitude,
        b.longitude
    );

    return distanciaA - distanciaB;
});

        atualizarMapa(piscinasEncontradas);
        
        if (piscinasEncontradas.length === 0) {

            resultados.innerHTML = "<p>Nenhuma piscina encontrada.</p>";

            return;
        }

            piscinasEncontradas.forEach(function (piscina) {

            const card = document.createElement("div");
            card.className = "card-piscina";

            card.addEventListener("click", function () {

                detalhesPiscina.innerHTML = `
                    ${piscina.foto ? `
                     <img 
                        src="${piscina.foto}" 
                        class="foto-modal"
                        alt="Foto de ${piscina.nome}"
                    >
                ` : ""}
                    
                <button 
                    class="botao-favorito"
                    data-nome="${piscina.nome}"
                    onclick="event.stopPropagation(); alternarFavorito('${piscina.nome}')"
                >
                     ${favoritos.includes(piscina.nome) ? "⭐" : "☆"}
                </button>    
                    
                    <h2>
                        🏊 ${piscina.nome}
                    </h2>

                    <button 
                        id="favoritoModal"
                        class="favorito-modal"
                        onclick="event.stopPropagation(); alternarFavorito('${piscina.nome}')"
                    >
                        ${favoritos.includes(piscina.nome) ? "⭐ Favorita" : "☆ Favoritar"}
                    </button> 

                    <button
                        class="botao-detalhes"
                        onclick="event.stopPropagation(); abrirPaginaDetalhes('${piscina.nome}')"
                    >
                        📋 Página completa
                    </button>

                    <p>📍 <strong>Endereço:</strong><br>
                    ${piscina.endereco}</p>

                    <p>🏊 <strong>Tipo:</strong>
                    ${piscina.tipo}</p>

                    ${piscina.mensalidade ? `
                        <p class="preco-piscina">
                            💰 ${piscina.mensalidade}
                        </p>
                    ` : ""}

                    ${piscina.day_use ? `
                        <p>🎟️ <strong>Day Use:</strong>
                        ${piscina.day_use}</p>
                    ` : ""}

                    <p>📏 <strong>Distância:</strong>
                    ${calcularDistancia(
                        minhaLocalizacao.latitude,
                        minhaLocalizacao.longitude,
                        piscina.latitude,
                        piscina.longitude
                    ).toFixed(1)} km</p>

                    <h3>🕐 Horários</h3>

                    <p>Segunda: Fechada</p>
                    <p>Terça: ${piscina.horario.terca}</p>
                    <p>Quarta: ${piscina.horario.quarta}</p>
                    <p>Quinta: ${piscina.horario.quinta}</p>
                    <p>Sexta: ${piscina.horario.sexta}</p>
                    <p>Sábado: ${piscina.horario.sabado}</p>
                    <p>Domingo: ${piscina.horario.domingo}</p>

                    <p><strong>${verificarFuncionamento(piscina.horario)}</strong></p>
                `;

                modal.style.display = "flex";

            });

            const avaliacaoPiscina =
                obterAvaliacaoPiscina(piscina.nome);

            let blocoAvaliacao = "";

            if (avaliacaoPiscina.quantidade > 0) {

                blocoAvaliacao = `
                    <div class="avaliacao-card">

                        <span>
                            ⭐ ${avaliacaoPiscina.media.toFixed(1)}
                        </span>

                        <span>
                            ${avaliacaoPiscina.quantidade}
                            ${
                                avaliacaoPiscina.quantidade === 1
                                ? "avaliação"
                                : "avaliações"
                            }
                        </span>

                    </div>
                `;

            } else {

                blocoAvaliacao = `
                    <div class="avaliacao-card">

                        <span>
                            ⭐ Sem avaliações
                        </span>

                    </div>
                `;

            }


            card.innerHTML = `
                ${piscina.foto ? `
                    <img 
                        src="${piscina.foto}" 
                        class="foto-piscina"
                        alt="Foto de ${piscina.nome}"
                    >
                ` : ""}
                
                <h2>${piscina.nome}</h2>

                ${blocoAvaliacao}

                <p>📍 ${piscina.endereco}</p>

                <p>
                    📏 ${calcularDistancia(
                        minhaLocalizacao.latitude,
                        minhaLocalizacao.longitude,
                        piscina.latitude,
                        piscina.longitude
                    ).toFixed(1)} km de você
                </p>

                <p>
                    🏊 ${piscina.tipo}
                </p>

                ${piscina.mensalidade ? `
                    <p>
                        💰 ${piscina.mensalidade}
                    </p>
                ` : ""}

                <div class="horarios">

                    <h3>🕐 Horários</h3>

                    <p>Segunda: ${piscina.horario.segunda || "Consultar"}</p>
                    <p>Terça: ${piscina.horario.terca || "Consultar"}</p>
                    <p>Quarta: ${piscina.horario.quarta || "Consultar"}</p>
                    <p>Quinta: ${piscina.horario.quinta || "Consultar"}</p>
                    <p>Sexta: ${piscina.horario.sexta || "Consultar"}</p>
                    <p>Sábado: ${piscina.horario.sabado || "Consultar"}</p>
                    <p>Domingo: ${piscina.horario.domingo || "Consultar"}</p>

                </div>

                <p>
                    ${verificarFuncionamento(piscina.horario)}
                </p>

                <button
                    class="botao-mapa"
                    onclick="event.stopPropagation(); abrirMapa('${piscina.endereco}')"
                >
                    🗺️ Como chegar
                </button>
            `;

            resultados.appendChild(card);

        });

    } catch (erro) {

        resultados.innerHTML = "<p>Erro ao conectar com o servidor.</p>";

        console.error(erro);

    }

});

function abrirMapa(endereco) {

    const url = "https://www.google.com/maps/search/?api=1&query=" 
        + encodeURIComponent(endereco);

    window.open(url, "_blank");
}

function calcularDistancia(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

let mapa = null;
let marcadores = [];

function inicializarMapa() {

    if (mapa) {
        return;
    }

    mapa = L.map("mapa").setView(
        [-23.5505, -46.6333],
        11
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(mapa);
}

function atualizarMapa(piscinas) {

    inicializarMapa();

    marcadores.forEach(function (marcador) {
        mapa.removeLayer(marcador);
    });

    marcadores = [];

    piscinas.forEach(function (piscina) {

        const marcador = L.marker([
            piscina.latitude,
            piscina.longitude
        ]).addTo(mapa);

        marcador.bindPopup(`
            <div class="popup-piscina">

                <strong>🏊 ${piscina.nome}</strong>

                <p>🏊 ${piscina.tipo}</p>

                <p>📍 ${piscina.endereco}</p>

                <p>📏 ${
                    calcularDistancia(
                        minhaLocalizacao.latitude,
                        minhaLocalizacao.longitude,
                        piscina.latitude,
                        piscina.longitude
                    ).toFixed(1)
                } km de você</p>

                <p>${verificarFuncionamento(piscina.horario)}</p>

                <button
                    class="botao-popup"
                    onclick="abrirDetalhesPiscina('${piscina.nome}')"
                >
                    👁️ Ver detalhes
                </button>

                <button
                    class="botao-popup"
                    onclick="abrirMapa('${piscina.endereco}')"
                >
                    🗺️ Como chegar
                </button>

            </div>
        `);

        marcadores.push(marcador);
    });

    if (piscinas.length > 0) {

        const limites = L.latLngBounds(
            piscinas.map(function (piscina) {
                return [
                    piscina.latitude,
                    piscina.longitude
                ];
            })
        );

        mapa.fitBounds(limites, {
            padding: [30, 30]
        });
    }
}

filtroTipo.addEventListener("change", function () {
    botao.click();
});

filtroDistancia.addEventListener("change", function () {
    botao.click();
});

filtroCategoria.addEventListener("change", function () {
    botao.click();
});

function verificarFuncionamento(horario) {

    const agora = new Date();

    const dias = [
        "domingo",
        "segunda",
        "terca",
        "quarta",
        "quinta",
        "sexta",
        "sabado"
    ];

    const diaAtual = dias[agora.getDay()];
    const horarioHoje = horario[diaAtual];

    if (!horarioHoje || horarioHoje === "fechado") {
        return "🔴 Fechada agora";
    }

    const periodos = horarioHoje.split(",");

    const minutosAgora =
        agora.getHours() * 60 + agora.getMinutes();

    for (let i = 0; i < periodos.length; i++) {

        const [abertura, fechamento] = periodos[i].split("-");

        const [horaAbertura, minutoAbertura] =
            abertura.split(":").map(Number);

        const [horaFechamento, minutoFechamento] =
            fechamento.split(":").map(Number);

        const minutosAbertura =
            horaAbertura * 60 + minutoAbertura;

        const minutosFechamento =
            horaFechamento * 60 + minutoFechamento;

        if (
            minutosAgora >= minutosAbertura &&
            minutosAgora <= minutosFechamento
        ) {
            return `🟢 Aberta agora — fecha às ${fechamento}`;
        }

        if (minutosAgora < minutosAbertura) {
            return `🔴 Fechada agora — abre às ${abertura}`;
        }
    }

    return "🔴 Fechada agora";
}

setInterval(function () {
    botao.click();
}, 60000);

botaoLocalizacao.addEventListener("click", function () {

    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            minhaLocalizacao = {
                latitude: posicao.coords.latitude,
                longitude: posicao.coords.longitude
            };


            botao.click();
        },

        function () {

            alert("Não foi possível acessar sua localização.");

        }

    );

});

fecharModal.addEventListener("click", function () {

    modal.style.display = "none";

});

modal.addEventListener("click", function (evento) {

    if (evento.target === modal) {
        modal.style.display = "none";
    }

});

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function atualizarContadorFavoritos() {
        botaoFavoritos.textContent = `⭐ Favoritos (${favoritos.length})`;
}

function alternarFavorito(nomePiscina) {

    if (favoritos.includes(nomePiscina)) {

        favoritos = favoritos.filter(function (nome) {
            return nome !== nomePiscina;
        });

    } else {

        favoritos.push(nomePiscina);

    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    atualizarContadorFavoritos();

    // Atualiza a estrela do modal imediatamente
    const botaoFavoritoModal = document.querySelector("#favoritoModal");

    if (botaoFavoritoModal) {

        if (favoritos.includes(nomePiscina)) {
            botaoFavoritoModal.textContent = "⭐ Favorita";
        } else {
            botaoFavoritoModal.textContent = "☆ Favoritar";
        }

    }

    // Atualiza a estrela do card imediatamente
    const botoesFavorito = document.querySelectorAll(".botao-favorito");

    botoesFavorito.forEach(function (botaoFavorito) {

        if (botaoFavorito.dataset.nome === nomePiscina) {

            if (favoritos.includes(nomePiscina)) {
                botaoFavorito.textContent = "⭐";
            } else {
                botaoFavorito.textContent = "☆";
            }

        }

    });
}

botaoFavoritos.addEventListener("click", function () {

    botaoFavoritos.classList.toggle("ativo");

    botao.click();

});

atualizarContadorFavoritos();

busca.addEventListener("input", async function () {

    const texto = removerAcentos(busca.value.trim());

    sugestoes.innerHTML = "";

    if (texto.length < 2) {
        return;
    }

    try {

        const resposta = await fetch("/piscinas");
        const piscinas = await resposta.json();

        const encontradas = piscinas.filter(function (piscina) {

            const nome = removerAcentos(piscina.nome);
            const endereco = removerAcentos(piscina.endereco);

            return (
                nome.includes(texto) ||
                endereco.includes(texto)
            );

        }).slice(0, 5);

        encontradas.forEach(function (piscina) {

            const item = document.createElement("div");

            item.className = "sugestao";

            item.textContent = "🏊 " + piscina.nome;

            item.addEventListener("click", function () {

                busca.value = piscina.nome;
                sugestoes.innerHTML = "";

                botao.click();

            });

            sugestoes.appendChild(item);

        });

    } catch (erro) {

        console.error("Erro ao carregar sugestões:", erro);

    }

});


function aplicarTema() {}

const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "escuro") {
    document.body.classList.add("tema-escuro");
}

if (botaoTema) {

    if (temaSalvo === "escuro") {
        botaoTema.textContent = "☀️ Modo claro";
    } else {
        botaoTema.textContent = "🌙 Modo escuro";
    }

    botaoTema.addEventListener("click", function () {

        const escuroAtivo =
            document.body.classList.toggle("tema-escuro");

        if (escuroAtivo) {

            localStorage.setItem("tema", "escuro");
            botaoTema.textContent = "☀️ Modo claro";

        } else {

            localStorage.setItem("tema", "claro");
            botaoTema.textContent = "🌙 Modo escuro";

        }

    });
}

function abrirDetalhesPiscina(nomePiscina) {

    const card = Array.from(
        document.querySelectorAll(".card-piscina")
    ).find(function (card) {

        const titulo = card.querySelector("h2");

        return titulo && titulo.textContent === nomePiscina;

    });

    if (card) {
        card.click();
    }
}

if (botaoPerfil) {

    botaoPerfil.addEventListener("click", function () {

        window.location.href = "/perfil";

    });

}

function abrirPaginaDetalhes(nomePiscina) {

    window.location.href =
        "/detalhes?nome=" +
        encodeURIComponent(nomePiscina);

}
