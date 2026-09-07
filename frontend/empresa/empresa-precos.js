const empresaLogada = localStorage.getItem("empresaLogada");
const empresaEmail = localStorage.getItem("empresaEmail");

if (empresaLogada !== "true" || !empresaEmail) {
    window.location.href = "/empresa/login";
}


const mensalidade = document.querySelector("#mensalidade");
const dayUse = document.querySelector("#dayUse");
const observacaoPrecos = document.querySelector("#observacaoPrecos");

const botaoSalvarPrecos =
    document.querySelector("#botaoSalvarPrecos");

const botaoVoltarPainel =
    document.querySelector("#botaoVoltarPainel");


// CARREGAR DADOS ATUAIS

async function carregarPrecos() {

    try {

        const resposta =
            await fetch("/empresa/" + encodeURIComponent(empresaEmail));

        if (!resposta.ok) {
            throw new Error("Erro ao carregar empresa.");
        }

        const empresa = await resposta.json();

        if (empresa.precos) {

            mensalidade.value =
                empresa.precos.mensalidade || "";

            dayUse.value =
                empresa.precos.day_use || "";

            observacaoPrecos.value =
                empresa.precos.observacao || "";
        }

    } catch (erro) {

        console.error(erro);

    }

}

carregarPrecos();


// SALVAR PREÇOS

if (botaoSalvarPrecos) {

    botaoSalvarPrecos.addEventListener("click", async function () {

        const dados = {

            mensalidade:
                mensalidade.value.trim(),

            day_use:
                dayUse.value.trim(),

            observacao:
                observacaoPrecos.value.trim()

        };


        try {

            const resposta = await fetch(
                "/empresa/precos/" +
                encodeURIComponent(empresaEmail),
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );


            const resultado = await resposta.json();


            if (!resposta.ok) {

                alert(
                    resultado.detail ||
                    "Erro ao salvar preços."
                );

                return;
            }


            alert("✅ Preços salvos com sucesso!");

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao conectar com o servidor."
            );

        }

    });

}


// VOLTAR

if (botaoVoltarPainel) {

    botaoVoltarPainel.addEventListener("click", function () {

        window.location.href =
            "/empresa/painel";

    });

}