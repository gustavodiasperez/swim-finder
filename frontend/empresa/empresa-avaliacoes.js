const empresaLogada =
    localStorage.getItem("empresaLogada");

const empresaEmail =
    localStorage.getItem("empresaEmail");

const empresaNome =
    localStorage.getItem("empresaNome");


if (empresaLogada !== "true" || !empresaEmail) {
    window.location.href = "/empresa/login";
}


const resumoAvaliacoes =
    document.querySelector("#resumoAvaliacoes");

const listaAvaliacoes =
    document.querySelector("#listaAvaliacoes");

const botaoVoltarPainel =
    document.querySelector("#botaoVoltarPainel");


// CARREGAR AVALIAÇÕES

async function carregarAvaliacoes() {

    try {

        const resposta =
            await fetch("/avaliacoes");

        if (!resposta.ok) {
            throw new Error(
                "Erro ao carregar avaliações."
            );
        }

        const avaliacoes =
            await resposta.json();


        // Como as avaliações atuais do sistema
        // são relacionadas pelo nome da piscina,
        // filtramos pelo nome da empresa.

        const minhasAvaliacoes =
            avaliacoes.filter(function (avaliacao) {

                return (
                    avaliacao.piscina === empresaNome
                );

            });


        if (minhasAvaliacoes.length === 0) {

            resumoAvaliacoes.innerHTML = `
                <div class="avaliacao-card">
                    ⭐ Ainda não há avaliações.
                </div>
            `;

            listaAvaliacoes.innerHTML = "";

            return;
        }


        // CALCULAR MÉDIA

        let soma = 0;

        minhasAvaliacoes.forEach(
            function (avaliacao) {

                soma += Number(
                    avaliacao.nota
                );

            }
        );


        const media =
            soma / minhasAvaliacoes.length;


        resumoAvaliacoes.innerHTML = `
            <div class="nota">
                ⭐ ${media.toFixed(1)}
            </div>

            <div class="quantidade">
                ${minhasAvaliacoes.length}
                ${
                    minhasAvaliacoes.length === 1
                    ? "avaliação"
                    : "avaliações"
                }
            </div>
        `;


        listaAvaliacoes.innerHTML = "";


        // MOSTRAR AVALIAÇÕES

        minhasAvaliacoes.forEach(
            function (avaliacao) {

                const card =
                    document.createElement("div");

                card.className =
                    "avaliacao-empresa";


                const estrelas =
                    "⭐".repeat(
                        Number(avaliacao.nota)
                    );


                card.innerHTML = `

                    <div class="avaliacao-estrelas">
                        ${estrelas}
                    </div>

                    <div class="avaliacao-usuario">
                        ${avaliacao.nome_usuario}
                    </div>

                    <p class="avaliacao-comentario">
                        ${avaliacao.comentario || "Sem comentário."}
                    </p>

                `;


                listaAvaliacoes.appendChild(
                    card
                );

            }
        );


    } catch (erro) {

        console.error(erro);

        resumoAvaliacoes.innerHTML = `
            <p>
                ❌ Erro ao carregar avaliações.
            </p>
        `;

    }

}


carregarAvaliacoes();


// VOLTAR

if (botaoVoltarPainel) {

    botaoVoltarPainel.addEventListener(
        "click",
        function () {

            window.location.href =
                "/empresa/painel";

        }
    );

}